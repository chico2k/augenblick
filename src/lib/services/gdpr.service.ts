/**
 * GDPR Service
 * Provides operations for GDPR version management and signature handling.
 */

import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  gdprVersions,
  signatures,
  type GdprVersion,
  type Signature,
} from "@/lib/db/schema";
import {
  type Result,
  type PaginationParams,
  type PaginatedResult,
  Ok,
  Err,
} from "./types";

/**
 * Input for creating a new GDPR version.
 */
export interface CreateGdprVersionInput {
  version?: string; // Optional - auto-generated if not provided
  title: string;
  content: string;
  isActive?: boolean;
}

/**
 * Input for updating an existing GDPR version.
 */
export interface UpdateGdprVersionInput {
  id: string;
  title?: string;
  content?: string;
  isActive?: boolean;
}

/**
 * Input for creating a signature.
 */
export interface CreateSignatureInput {
  customerId: string;
  gdprVersionId: string;
  signatureData: string; // Base64 PNG image
  // Three separate consents
  dataProcessingConsent: boolean; // Required
  healthDataConsent: boolean; // Required
  photoConsent?: boolean | null; // Optional
}

/**
 * Signature with related version information.
 */
export interface SignatureWithVersion extends Signature {
  gdprVersion: GdprVersion;
}

/**
 * GDPR Service with version management and signature operations.
 */
export const gdprService = {
  /**
   * Get the currently active GDPR version.
   *
   * @returns Result containing the active version or an error if none is active
   */
  async getActiveVersion(): Promise<Result<GdprVersion>> {
    try {
      const activeVersion = await db.query.gdprVersions.findFirst({
        where: eq(gdprVersions.isActive, true),
      });

      if (!activeVersion) {
        return Err({
          code: "NOT_FOUND",
          message: "Keine aktive Datenschutzerklärung gefunden",
        });
      }

      return Ok(activeVersion);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },

  /**
   * Get a GDPR version by ID.
   *
   * @param id - The version's UUID
   * @returns Result containing the version or an error
   */
  async getById(id: string): Promise<Result<GdprVersion>> {
    try {
      const version = await db.query.gdprVersions.findFirst({
        where: eq(gdprVersions.id, id),
      });

      if (!version) {
        return Err({
          code: "NOT_FOUND",
          message: "Datenschutzversion nicht gefunden",
        });
      }

      return Ok(version);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },

  /**
   * List all GDPR versions with pagination.
   *
   * @param params - Pagination parameters
   * @returns Result containing paginated versions
   */
  async list(
    params: PaginationParams = {}
  ): Promise<Result<PaginatedResult<GdprVersion>>> {
    try {
      const page = params.page ?? 1;
      const limit = params.limit ?? 20;
      const offset = (page - 1) * limit;

      // Get total count
      const allVersions = await db.query.gdprVersions.findMany({
        orderBy: desc(gdprVersions.createdAt),
      });
      const total = allVersions.length;

      // Get paginated versions
      const versions = await db.query.gdprVersions.findMany({
        orderBy: desc(gdprVersions.createdAt),
        offset,
        limit,
      });

      const totalPages = Math.ceil(total / limit);

      return Ok({
        items: versions,
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
   * Create a new GDPR version.
   * If isActive is true, deactivates all other versions first.
   * If version is not provided, auto-generates the next version (1.0, 2.0, 3.0, etc.)
   *
   * @param input - GDPR version data to create
   * @returns Result containing the created version
   */
  async create(input: CreateGdprVersionInput): Promise<Result<GdprVersion>> {
    try {
      // Auto-generate version if not provided
      let versionNumber = input.version;
      if (!versionNumber) {
        // Get all existing versions
        const allVersions = await db.query.gdprVersions.findMany({
          orderBy: desc(gdprVersions.createdAt),
        });

        // Find the highest version number
        let maxVersion = 0;
        for (const v of allVersions) {
          const versionMatch = v.version.match(/^(\d+)\.0$/);
          if (versionMatch?.[1]) {
            const num = parseInt(versionMatch[1], 10);
            if (num > maxVersion) {
              maxVersion = num;
            }
          }
        }

        // Next version is maxVersion + 1
        versionNumber = `${maxVersion + 1}.0`;
      }

      // If this version should be active, deactivate all others first
      if (input.isActive) {
        await db
          .update(gdprVersions)
          .set({ isActive: false })
          .where(eq(gdprVersions.isActive, true));
      }

      const [version] = await db
        .insert(gdprVersions)
        .values({
          version: versionNumber,
          title: input.title,
          content: input.content,
          isActive: input.isActive ?? false,
        })
        .returning();

      if (!version) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Erstellen der Datenschutzversion: Kein Datensatz erstellt",
        });
      }

      return Ok(version);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Erstellen der Datenschutzversion: ${String(error)}`,
      });
    }
  },

  /**
   * Update an existing GDPR version.
   * Only updates the provided fields (partial update).
   *
   * @param input - GDPR version data to update
   * @returns Result containing the updated version
   */
  async update(input: UpdateGdprVersionInput): Promise<Result<GdprVersion>> {
    try {
      // Check if version exists
      const existing = await db.query.gdprVersions.findFirst({
        where: eq(gdprVersions.id, input.id),
      });

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Datenschutzversion nicht gefunden",
        });
      }

      // Build update object with only provided fields
      const updateData: Partial<typeof gdprVersions.$inferInsert> = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.isActive !== undefined) {
        updateData.isActive = input.isActive;

        // If setting to active, deactivate all others first
        if (input.isActive) {
          await db
            .update(gdprVersions)
            .set({ isActive: false })
            .where(eq(gdprVersions.isActive, true));
        }
      }

      const [version] = await db
        .update(gdprVersions)
        .set(updateData)
        .where(eq(gdprVersions.id, input.id))
        .returning();

      if (!version) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Aktualisieren der Datenschutzversion: Kein Datensatz aktualisiert",
        });
      }

      return Ok(version);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Aktualisieren der Datenschutzversion: ${String(error)}`,
      });
    }
  },

  /**
   * Set a GDPR version as the active version.
   * Deactivates all other versions.
   *
   * @param id - The version's UUID to activate
   * @returns Result containing the activated version
   */
  async setActive(id: string): Promise<Result<GdprVersion>> {
    try {
      // Check if version exists
      const existing = await db.query.gdprVersions.findFirst({
        where: eq(gdprVersions.id, id),
      });

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Datenschutzversion nicht gefunden",
        });
      }

      // Deactivate all versions
      await db
        .update(gdprVersions)
        .set({ isActive: false })
        .where(eq(gdprVersions.isActive, true));

      // Activate the specified version
      const [version] = await db
        .update(gdprVersions)
        .set({ isActive: true })
        .where(eq(gdprVersions.id, id))
        .returning();

      if (!version) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Aktivieren der Datenschutzversion: Kein Datensatz aktualisiert",
        });
      }

      return Ok(version);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Aktivieren der Datenschutzversion: ${String(error)}`,
      });
    }
  },

  /**
   * Create a signature for a customer.
   *
   * @param input - Signature data including customer ID, version ID, and signature image
   * @returns Result containing the created signature
   */
  async createSignature(input: CreateSignatureInput): Promise<Result<Signature>> {
    try {
      // Validate that the GDPR version exists and is active
      const version = await db.query.gdprVersions.findFirst({
        where: eq(gdprVersions.id, input.gdprVersionId),
      });

      if (!version) {
        return Err({
          code: "NOT_FOUND",
          message: "Datenschutzversion nicht gefunden",
        });
      }

      if (!version.isActive) {
        return Err({
          code: "VALIDATION_ERROR",
          message: "Nur die aktive Datenschutzversion kann unterschrieben werden",
        });
      }

      // Validate signature data is not empty
      if (!input.signatureData || input.signatureData.trim() === "") {
        return Err({
          code: "VALIDATION_ERROR",
          message: "Unterschrift darf nicht leer sein",
        });
      }

      const [signature] = await db
        .insert(signatures)
        .values({
          customerId: input.customerId,
          gdprVersionId: input.gdprVersionId,
          signatureData: input.signatureData,
          dataProcessingConsent: input.dataProcessingConsent,
          healthDataConsent: input.healthDataConsent,
          photoConsent: input.photoConsent ?? null,
        })
        .returning();

      if (!signature) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Speichern der Unterschrift: Kein Datensatz erstellt",
        });
      }

      return Ok(signature);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Speichern der Unterschrift: ${String(error)}`,
      });
    }
  },

  /**
   * Get all signatures for a customer.
   *
   * @param customerId - The customer's UUID
   * @returns Result containing the customer's signatures with version info
   */
  async getSignaturesForCustomer(
    customerId: string
  ): Promise<Result<SignatureWithVersion[]>> {
    try {
      const customerSignatures = await db.query.signatures.findMany({
        where: eq(signatures.customerId, customerId),
        with: {
          gdprVersion: true,
        },
        orderBy: desc(signatures.signedAt),
      });

      return Ok(customerSignatures);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },

  /**
   * Check if a customer has signed the currently active GDPR version.
   *
   * @param customerId - The customer's UUID
   * @returns Result containing boolean indicating if customer has signed active version
   */
  async hasSignedActiveVersion(customerId: string): Promise<Result<boolean>> {
    try {
      // Get active version
      const activeVersion = await db.query.gdprVersions.findFirst({
        where: eq(gdprVersions.isActive, true),
      });

      if (!activeVersion) {
        return Ok(false); // No active version means no one has signed
      }

      // Check if customer has signed the active version
      const signature = await db.query.signatures.findFirst({
        where: eq(signatures.customerId, customerId),
        orderBy: desc(signatures.signedAt),
      });

      const hasSigned = signature?.gdprVersionId === activeVersion.id;

      return Ok(hasSigned);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },

  /**
   * Get signature statistics for a GDPR version.
   *
   * @param versionId - The version's UUID
   * @returns Result containing the count of signatures
   */
  async getSignatureCount(versionId: string): Promise<Result<number>> {
    try {
      const versionSignatures = await db.query.signatures.findMany({
        where: eq(signatures.gdprVersionId, versionId),
      });

      return Ok(versionSignatures.length);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Datenbankfehler: ${String(error)}`,
      });
    }
  },
};

export type GdprService = typeof gdprService;
