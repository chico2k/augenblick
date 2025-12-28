/**
 * Treatment Types Service
 * Provides CRUD operations for treatment types (Behandlungsarten).
 */

import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { treatmentTypes, type TreatmentType } from "@/lib/db/schema";
import { type Result, Ok, Err } from "./types";

/**
 * Input for creating a new treatment type.
 */
export interface CreateTreatmentTypeInput {
  name: string;
  description?: string | null;
  defaultPrice: string; // decimal as string
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Input for updating a treatment type.
 */
export interface UpdateTreatmentTypeInput {
  name?: string;
  description?: string | null;
  defaultPrice?: string;
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Treatment Types Service with CRUD operations.
 */
export const treatmentService = {
  /**
   * Get all active treatment types sorted by sortOrder.
   */
  async getActive(): Promise<Result<TreatmentType[]>> {
    try {
      const types = await db
        .select()
        .from(treatmentTypes)
        .where(eq(treatmentTypes.isActive, true))
        .orderBy(asc(treatmentTypes.sortOrder), asc(treatmentTypes.name));

      return Ok(types);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Behandlungsarten: ${String(error)}`,
      });
    }
  },

  /**
   * Get all treatment types (including inactive).
   */
  async getAll(): Promise<Result<TreatmentType[]>> {
    try {
      const types = await db
        .select()
        .from(treatmentTypes)
        .orderBy(asc(treatmentTypes.sortOrder), asc(treatmentTypes.name));

      return Ok(types);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Behandlungsarten: ${String(error)}`,
      });
    }
  },

  /**
   * Get a treatment type by ID.
   */
  async getById(id: string): Promise<Result<TreatmentType>> {
    try {
      const [type] = await db
        .select()
        .from(treatmentTypes)
        .where(eq(treatmentTypes.id, id))
        .limit(1);

      if (!type) {
        return Err({
          code: "NOT_FOUND",
          message: "Behandlungsart nicht gefunden",
        });
      }

      return Ok(type);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Behandlungsart: ${String(error)}`,
      });
    }
  },

  /**
   * Create a new treatment type.
   */
  async create(input: CreateTreatmentTypeInput): Promise<Result<TreatmentType>> {
    try {
      const [type] = await db
        .insert(treatmentTypes)
        .values({
          name: input.name,
          description: input.description ?? null,
          defaultPrice: input.defaultPrice,
          isActive: input.isActive ?? true,
          sortOrder: input.sortOrder?.toString() ?? "0",
        })
        .returning();

      if (!type) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Erstellen der Behandlungsart",
        });
      }

      return Ok(type);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Erstellen der Behandlungsart: ${String(error)}`,
      });
    }
  },

  /**
   * Update a treatment type.
   */
  async update(id: string, input: UpdateTreatmentTypeInput): Promise<Result<TreatmentType>> {
    try {
      const [existing] = await db
        .select()
        .from(treatmentTypes)
        .where(eq(treatmentTypes.id, id))
        .limit(1);

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Behandlungsart nicht gefunden",
        });
      }

      const [type] = await db
        .update(treatmentTypes)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.defaultPrice !== undefined && { defaultPrice: input.defaultPrice }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
          ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder.toString() }),
        })
        .where(eq(treatmentTypes.id, id))
        .returning();

      if (!type) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Aktualisieren der Behandlungsart",
        });
      }

      return Ok(type);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Aktualisieren der Behandlungsart: ${String(error)}`,
      });
    }
  },

  /**
   * Delete a treatment type.
   */
  async delete(id: string): Promise<Result<{ deleted: true }>> {
    try {
      const [existing] = await db
        .select()
        .from(treatmentTypes)
        .where(eq(treatmentTypes.id, id))
        .limit(1);

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Behandlungsart nicht gefunden",
        });
      }

      await db.delete(treatmentTypes).where(eq(treatmentTypes.id, id));

      return Ok({ deleted: true });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Löschen der Behandlungsart: ${String(error)}`,
      });
    }
  },
};

export type TreatmentService = typeof treatmentService;
