"use server";

/**
 * Customer Server Actions
 * Next.js Server Actions for customer CRUD operations.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { customerService } from "@/lib/services/customer.service";
import { auditService } from "@/lib/services/audit.service";
import { isErrResult } from "@/lib/services/types";

/**
 * Action result type for consistent responses.
 */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Zod schema for customer creation.
 */
const createCustomerSchema = z.object({
  firstName: z.string().min(1, "Vorname erforderlich"),
  lastName: z.string().min(1, "Nachname erforderlich"),
  email: z.string().email("Ungültige E-Mail").or(z.literal("")).optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  isRegularCustomer: z.boolean().default(false),
  status: z.enum(["active", "inactive"]).default("active"),
});

/**
 * Zod schema for customer update.
 */
const updateCustomerSchema = z.object({
  id: z.string().uuid("Ungültige Kunden-ID"),
  firstName: z.string().min(1, "Vorname erforderlich").optional(),
  lastName: z.string().min(1, "Nachname erforderlich").optional(),
  email: z.string().email("Ungültige E-Mail").or(z.literal("")).optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  isRegularCustomer: z.boolean().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

/**
 * Zod schema for customer deletion.
 */
const deleteCustomerSchema = z.object({
  id: z.string().uuid("Ungültige Kunden-ID"),
});

/**
 * Input types derived from Zod schemas.
 */
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type DeleteCustomerInput = z.infer<typeof deleteCustomerSchema>;

/**
 * Create a new customer.
 *
 * @param input - Customer data to create
 * @returns ActionResult with the created customer ID
 */
export async function createCustomerAction(
  input: CreateCustomerInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validationResult = createCustomerSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validatedData = validationResult.data;

    // Create customer
    const result = await customerService.create({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      notes: validatedData.notes || null,
      isRegularCustomer: validatedData.isRegularCustomer,
      status: validatedData.status,
    });

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    const customer = result.value;

    // Log audit trail
    await auditService.logCreate(customer.id, null, null);

    // Revalidate customer list page
    revalidatePath("/office/kunden");

    return { success: true, data: { id: customer.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Erstellen des Kunden: ${String(error)}`,
    };
  }
}

/**
 * Update an existing customer.
 *
 * @param input - Customer data to update (must include id)
 * @returns ActionResult indicating success or failure
 */
export async function updateCustomerAction(
  input: UpdateCustomerInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validationResult = updateCustomerSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const { id, ...updateData } = validationResult.data;

    // Get existing customer for audit comparison
    const existingResult = await customerService.getById(id);
    if (isErrResult(existingResult)) {
      return { success: false, error: existingResult.error.message };
    }

    const existingCustomer = existingResult.value;

    // Build changes object for audit
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    if (updateData.firstName !== undefined && updateData.firstName !== existingCustomer.firstName) {
      changes.firstName = { from: existingCustomer.firstName, to: updateData.firstName };
    }
    if (updateData.lastName !== undefined && updateData.lastName !== existingCustomer.lastName) {
      changes.lastName = { from: existingCustomer.lastName, to: updateData.lastName };
    }
    if (updateData.email !== undefined && updateData.email !== existingCustomer.email) {
      changes.email = { from: existingCustomer.email, to: updateData.email };
    }
    if (updateData.phone !== undefined && updateData.phone !== existingCustomer.phone) {
      changes.phone = { from: existingCustomer.phone, to: updateData.phone };
    }
    if (updateData.notes !== undefined && updateData.notes !== existingCustomer.notes) {
      changes.notes = { from: existingCustomer.notes, to: updateData.notes };
    }
    if (updateData.isRegularCustomer !== undefined && updateData.isRegularCustomer !== existingCustomer.isRegularCustomer) {
      changes.isRegularCustomer = { from: existingCustomer.isRegularCustomer, to: updateData.isRegularCustomer };
    }
    if (updateData.status !== undefined && updateData.status !== existingCustomer.status) {
      changes.status = { from: existingCustomer.status, to: updateData.status };
    }

    // Update customer
    const result = await customerService.update(id, {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email || null,
      phone: updateData.phone || null,
      notes: updateData.notes || null,
      isRegularCustomer: updateData.isRegularCustomer,
      status: updateData.status,
    });

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    // Log audit trail with changes (only if there are actual changes)
    if (Object.keys(changes).length > 0) {
      await auditService.logUpdate(id, changes, null, null);
    }

    // Revalidate customer pages
    revalidatePath("/office/kunden");
    revalidatePath(`/office/kunden/${id}`);

    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Aktualisieren des Kunden: ${String(error)}`,
    };
  }
}

/**
 * Delete a customer.
 *
 * @param input - Object containing the customer ID to delete
 * @returns ActionResult indicating success or failure
 */
export async function deleteCustomerAction(
  input: DeleteCustomerInput
): Promise<ActionResult> {
  try {
    // Validate input
    const validationResult = deleteCustomerSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const { id } = validationResult.data;

    // Log audit trail before deletion (so we have the customer ID)
    await auditService.logDelete(id, null, null);

    // Delete customer
    const result = await customerService.delete(id);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    // Revalidate customer list page
    revalidatePath("/office/kunden");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Löschen des Kunden: ${String(error)}`,
    };
  }
}

/**
 * Form action wrapper for creating a customer from FormData.
 * Use this when submitting forms with FormData.
 *
 * @param formData - FormData from the form submission
 * @returns ActionResult with the created customer ID
 */
export async function createCustomerFormAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const input: CreateCustomerInput = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: (formData.get("email") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    isRegularCustomer: formData.get("isRegularCustomer") === "true",
    status: (formData.get("status") as "active" | "inactive") || "active",
  };

  return createCustomerAction(input);
}

/**
 * Form action wrapper for updating a customer from FormData.
 * Use this when submitting forms with FormData.
 *
 * @param formData - FormData from the form submission
 * @returns ActionResult indicating success or failure
 */
export async function updateCustomerFormAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const input: UpdateCustomerInput = {
    id: formData.get("id") as string,
    firstName: (formData.get("firstName") as string) || undefined,
    lastName: (formData.get("lastName") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  };

  return updateCustomerAction(input);
}

/**
 * Form action wrapper for deleting a customer from FormData.
 * Use this when submitting forms with FormData.
 *
 * @param formData - FormData from the form submission
 * @returns ActionResult indicating success or failure
 */
export async function deleteCustomerFormAction(
  formData: FormData
): Promise<ActionResult> {
  const input: DeleteCustomerInput = {
    id: formData.get("id") as string,
  };

  return deleteCustomerAction(input);
}

/**
 * Get list of customers.
 *
 * @param params - Pagination parameters
 * @returns ActionResult with array of customers
 */
export async function getCustomersListAction(params: {
  page: number;
  limit: number;
}) {
  try {
    const result = await customerService.list(params);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.value.items };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Laden der Kunden: ${String(error)}`,
    };
  }
}

/**
 * Get customer detail with audit logs.
 *
 * @param id - Customer ID
 * @returns ActionResult with customer and audit entries
 */
export async function getCustomerDetailAction(id: string) {
  try {
    // Parallel fetch
    const [customerResult, auditResult] = await Promise.all([
      customerService.getWithSignatureStatus(id),
      auditService.getForCustomer(id, { page: 1, limit: 50 }),
    ]);

    if (isErrResult(customerResult)) {
      return { success: false, error: customerResult.error.message };
    }

    const auditEntries = isErrResult(auditResult) ? [] : auditResult.value.items;

    return {
      success: true,
      data: {
        customer: customerResult.value,
        auditEntries,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Laden des Kunden: ${String(error)}`,
    };
  }
}
