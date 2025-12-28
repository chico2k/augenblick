"use server";

/**
 * Treatment Types Server Actions
 * Next.js Server Actions for treatment type CRUD operations.
 */

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { treatmentService } from "@/lib/services/treatment.service";
import { isErrResult } from "@/lib/services/types";

/**
 * Verify user is authenticated.
 */
async function requireAuth(): Promise<{ success: true } | { success: false; error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Nicht autorisiert" };
  }

  return { success: true };
}

/**
 * Action result type for consistent responses.
 */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Zod schema for treatment type creation.
 */
const createTreatmentSchema = z.object({
  name: z.string().min(1, "Name erforderlich"),
  description: z.string().optional(),
  defaultPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Ungültiger Preis"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

/**
 * Zod schema for treatment type update.
 */
const updateTreatmentSchema = z.object({
  id: z.string().uuid("Ungültige ID"),
  name: z.string().min(1, "Name erforderlich").optional(),
  description: z.string().nullable().optional(),
  defaultPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Ungültiger Preis").optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

/**
 * Input types derived from Zod schemas.
 */
export type CreateTreatmentInput = z.infer<typeof createTreatmentSchema>;
export type UpdateTreatmentInput = z.infer<typeof updateTreatmentSchema>;

/**
 * Create a new treatment type.
 */
export async function createTreatmentAction(
  input: CreateTreatmentInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const validationResult = createTreatmentSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const result = await treatmentService.create(validationResult.data);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");
    revalidatePath("/office/euer/behandlungen");

    return { success: true, data: { id: result.value.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Erstellen der Behandlungsart: ${String(error)}`,
    };
  }
}

/**
 * Update an existing treatment type.
 */
export async function updateTreatmentAction(
  input: UpdateTreatmentInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const validationResult = updateTreatmentSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const { id, ...updateData } = validationResult.data;
    const result = await treatmentService.update(id, updateData);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");
    revalidatePath("/office/euer/behandlungen");

    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Aktualisieren der Behandlungsart: ${String(error)}`,
    };
  }
}

/**
 * Delete a treatment type.
 */
export async function deleteTreatmentAction(
  id: string
): Promise<ActionResult> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    if (!id || typeof id !== "string") {
      return { success: false, error: "Ungültige ID" };
    }

    const result = await treatmentService.delete(id);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");
    revalidatePath("/office/euer/behandlungen");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Löschen der Behandlungsart: ${String(error)}`,
    };
  }
}

/**
 * Get all treatment types.
 */
export async function getTreatmentsAction(): Promise<
  ActionResult<{
    id: string;
    name: string;
    description: string | null;
    defaultPrice: string;
    isActive: boolean;
    sortOrder: string;
    createdAt: Date;
  }[]>
> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const result = await treatmentService.getAll();

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.value };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Laden der Behandlungsarten: ${String(error)}`,
    };
  }
}
