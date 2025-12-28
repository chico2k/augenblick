/**
 * Customer Service
 * Provides CRUD operations for customers and signature status queries.
 */

import { eq, ilike, or, desc, sql, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers, signatures, gdprVersions } from "@/lib/db/schema";
import type { Customer } from "@/lib/db/schema/customers";
import {
  type Result,
  type PaginationParams,
  type PaginatedResult,
  Ok,
  Err,
  isErrResult,
} from "./types";

/**
 * Customer with signature status information.
 */
export interface CustomerWithSignatureStatus extends Customer {
  hasSignedCurrentVersion: boolean;
  lastSignedAt: Date | null;
  lastSignedVersionId: string | null;
  lastSignatureId: string | null;
}

/**
 * Input for creating a new customer.
 */
export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  isRegularCustomer?: boolean;
  status?: "active" | "inactive";
}

/**
 * Input for updating a customer.
 */
export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  isRegularCustomer?: boolean;
  status?: "active" | "inactive";
}

/**
 * Filter options for listing customers.
 */
export interface CustomerListFilter {
  search?: string;
  signatureStatus?: "all" | "signed" | "unsigned";
}

/**
 * Customer Service with CRUD operations and signature status.
 */
export const customerService = {
  /**
   * Get a customer by ID.
   *
   * @param id - The customer's UUID
   * @returns Result containing the customer or an error
   */
  async getById(id: string): Promise<Result<Customer>> {
    try {
      const customer = await db.query.customers.findFirst({
        where: eq(customers.id, id),
      });

      if (!customer) {
        return Err({
          code: "NOT_FOUND",
          message: "Kunde nicht gefunden",
        });
      }

      return Ok(customer);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },

  /**
   * Get a customer by ID with their signature status.
   * Checks if the customer has signed the currently active GDPR version.
   *
   * @param id - The customer's UUID
   * @returns Result containing the customer with signature status
   */
  async getWithSignatureStatus(
    id: string
  ): Promise<Result<CustomerWithSignatureStatus>> {
    try {
      const customer = await db.query.customers.findFirst({
        where: eq(customers.id, id),
      });

      if (!customer) {
        return Err({
          code: "NOT_FOUND",
          message: "Kunde nicht gefunden",
        });
      }

      // Get the active GDPR version
      const activeVersion = await db.query.gdprVersions.findFirst({
        where: eq(gdprVersions.isActive, true),
      });

      // Get the customer's most recent signature
      const latestSignature = await db.query.signatures.findFirst({
        where: eq(signatures.customerId, id),
        orderBy: desc(signatures.signedAt),
      });

      // Check if customer has signed the current active version
      const hasSignedCurrentVersion =
        activeVersion && latestSignature
          ? latestSignature.gdprVersionId === activeVersion.id
          : false;

      return Ok({
        ...customer,
        hasSignedCurrentVersion,
        lastSignedAt: latestSignature?.signedAt ?? null,
        lastSignedVersionId: latestSignature?.gdprVersionId ?? null,
        lastSignatureId: latestSignature?.id ?? null,
      });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },

  /**
   * List all customers with pagination and filtering.
   *
   * @param params - Pagination parameters
   * @param filter - Filter options (search, signature status)
   * @returns Result containing paginated customers with signature status
   */
  async list(
    params: PaginationParams = {},
    filter: CustomerListFilter = {}
  ): Promise<Result<PaginatedResult<CustomerWithSignatureStatus>>> {
    try {
      const page = params.page ?? 1;
      const limit = params.limit ?? 20;
      const offset = (page - 1) * limit;

      // Get the active GDPR version ID
      const activeVersion = await db.query.gdprVersions.findFirst({
        where: eq(gdprVersions.isActive, true),
      });
      const activeVersionId = activeVersion?.id ?? null;

      // Build search conditions
      const searchConditions = filter.search
        ? or(
            ilike(customers.firstName, `%${filter.search}%`),
            ilike(customers.lastName, `%${filter.search}%`),
            ilike(customers.email, `%${filter.search}%`),
            ilike(customers.phone, `%${filter.search}%`)
          )
        : undefined;

      // Get all customers first (for filtering by signature status)
      const allCustomers = await db
        .select({
          customer: customers,
          latestSignature: signatures,
        })
        .from(customers)
        .leftJoin(
          signatures,
          and(
            eq(signatures.customerId, customers.id),
            // Only join the latest signature per customer
            sql`${signatures.id} = (
              SELECT s2.id FROM signatures s2
              WHERE s2.customer_id = ${customers.id}
              ORDER BY s2.signed_at DESC
              LIMIT 1
            )`
          )
        )
        .where(searchConditions)
        .orderBy(desc(customers.createdAt));

      // Transform and filter by signature status
      let customersWithStatus: CustomerWithSignatureStatus[] = allCustomers.map(
        (row) => {
          const hasSignedCurrentVersion =
            activeVersionId && row.latestSignature
              ? row.latestSignature.gdprVersionId === activeVersionId
              : false;

          return {
            ...row.customer,
            hasSignedCurrentVersion,
            lastSignedAt: row.latestSignature?.signedAt ?? null,
            lastSignedVersionId: row.latestSignature?.gdprVersionId ?? null,
            lastSignatureId: row.latestSignature?.id ?? null,
          };
        }
      );

      // Filter by signature status
      if (filter.signatureStatus === "signed") {
        customersWithStatus = customersWithStatus.filter(
          (c) => c.hasSignedCurrentVersion
        );
      } else if (filter.signatureStatus === "unsigned") {
        customersWithStatus = customersWithStatus.filter(
          (c) => !c.hasSignedCurrentVersion
        );
      }

      const total = customersWithStatus.length;
      const totalPages = Math.ceil(total / limit);

      // Apply pagination
      const paginatedItems = customersWithStatus.slice(offset, offset + limit);

      return Ok({
        items: paginatedItems,
        total,
        page,
        limit,
        totalPages,
      });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },

  /**
   * Create a new customer.
   *
   * @param input - Customer data to create
   * @returns Result containing the created customer
   */
  async create(input: CreateCustomerInput): Promise<Result<Customer>> {
    try {
      const [customer] = await db
        .insert(customers)
        .values({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email ?? null,
          phone: input.phone ?? null,
          notes: input.notes ?? null,
          isRegularCustomer: input.isRegularCustomer ?? false,
          status: input.status ?? "active",
        })
        .returning();

      if (!customer) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Erstellen des Kunden: Kein Datensatz erstellt",
        });
      }

      return Ok(customer);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Erstellen des Kunden: ${String(error)}`,
      });
    }
  },

  /**
   * Update an existing customer.
   *
   * @param id - The customer's UUID
   * @param input - Customer data to update
   * @returns Result containing the updated customer
   */
  async update(id: string, input: UpdateCustomerInput): Promise<Result<Customer>> {
    try {
      // Check if customer exists
      const existing = await db.query.customers.findFirst({
        where: eq(customers.id, id),
      });

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Kunde nicht gefunden",
        });
      }

      const [customer] = await db
        .update(customers)
        .set({
          ...(input.firstName !== undefined && { firstName: input.firstName }),
          ...(input.lastName !== undefined && { lastName: input.lastName }),
          ...(input.email !== undefined && { email: input.email }),
          ...(input.phone !== undefined && { phone: input.phone }),
          ...(input.notes !== undefined && { notes: input.notes }),
          ...(input.isRegularCustomer !== undefined && {
            isRegularCustomer: input.isRegularCustomer,
          }),
          ...(input.status !== undefined && { status: input.status }),
        })
        .where(eq(customers.id, id))
        .returning();

      if (!customer) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Aktualisieren des Kunden: Kein Datensatz aktualisiert",
        });
      }

      return Ok(customer);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Aktualisieren des Kunden: ${String(error)}`,
      });
    }
  },

  /**
   * Delete a customer.
   *
   * @param id - The customer's UUID
   * @returns Result indicating success or failure
   */
  async delete(id: string): Promise<Result<{ deleted: true }>> {
    try {
      // Check if customer exists
      const existing = await db.query.customers.findFirst({
        where: eq(customers.id, id),
      });

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Kunde nicht gefunden",
        });
      }

      await db.delete(customers).where(eq(customers.id, id));

      return Ok({ deleted: true });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Löschen des Kunden: ${String(error)}`,
      });
    }
  },

  /**
   * Search customers by name, email, or phone.
   *
   * @param query - Search query string
   * @param limit - Maximum number of results (default: 10)
   * @returns Result containing matching customers
   */
  async search(query: string, limit = 10): Promise<Result<Customer[]>> {
    try {
      const searchResults = await db
        .select()
        .from(customers)
        .where(
          or(
            ilike(customers.firstName, `%${query}%`),
            ilike(customers.lastName, `%${query}%`),
            ilike(customers.email, `%${query}%`),
            ilike(customers.phone, `%${query}%`)
          )
        )
        .orderBy(desc(customers.createdAt))
        .limit(limit);

      return Ok(searchResults);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler bei der Suche: ${String(error)}`,
      });
    }
  },

  /**
   * Get customers who haven't signed the current GDPR version.
   *
   * @param limit - Maximum number of results (default: 50)
   * @returns Result containing customers without current signature
   */
  async getUnsignedCustomers(
    limit = 50
  ): Promise<Result<CustomerWithSignatureStatus[]>> {
    try {
      const listResult = await this.list(
        { page: 1, limit },
        { signatureStatus: "unsigned" }
      );

      if (isErrResult(listResult)) {
        return Err(listResult.error);
      }

      return Ok(listResult.value.items);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },
};

export type CustomerService = typeof customerService;
