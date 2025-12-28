"use server";

/**
 * GDPR Server Actions
 * Next.js Server Actions for GDPR version and signature operations.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { gdprService } from "@/lib/services/gdpr.service";
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
 * Zod schema for creating a GDPR version.
 * Version is optional and will be auto-generated if not provided.
 */
const createGdprVersionSchema = z.object({
  version: z.string().optional(),
  title: z.string().min(1, "Titel erforderlich"),
  content: z.string().min(1, "Inhalt erforderlich"),
  isActive: z.boolean().optional(),
});

/**
 * Zod schema for updating a GDPR version.
 */
const updateGdprVersionSchema = z.object({
  id: z.string().uuid("Ungültige Versions-ID"),
  title: z.string().min(1, "Titel erforderlich").optional(),
  content: z.string().min(1, "Inhalt erforderlich").optional(),
  isActive: z.boolean().optional(),
});

/**
 * Zod schema for setting active version.
 */
const setActiveVersionSchema = z.object({
  id: z.string().uuid("Ungültige Versions-ID"),
});

/**
 * Zod schema for creating a signature.
 */
const createSignatureSchema = z.object({
  customerId: z.string().uuid("Ungültige Kunden-ID"),
  gdprVersionId: z.string().uuid("Ungültige Versions-ID"),
  signatureData: z.string().min(1, "Unterschrift erforderlich"),
  // Three separate consents
  dataProcessingConsent: z.boolean({ required_error: "Einwilligung zur Datenverarbeitung erforderlich" }),
  healthDataConsent: z.boolean({ required_error: "Einwilligung zur Verarbeitung von Gesundheitsdaten erforderlich" }),
  photoConsent: z.boolean().nullable().optional(), // Optional
});

/**
 * Input types derived from Zod schemas.
 */
export type CreateGdprVersionInput = z.infer<typeof createGdprVersionSchema>;
export type UpdateGdprVersionInput = z.infer<typeof updateGdprVersionSchema>;
export type SetActiveVersionInput = z.infer<typeof setActiveVersionSchema>;
export type CreateSignatureInput = z.infer<typeof createSignatureSchema>;

/**
 * Create a new GDPR version.
 *
 * @param input - GDPR version data to create
 * @returns ActionResult with the created version ID
 */
export async function createGdprVersionAction(
  input: CreateGdprVersionInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validationResult = createGdprVersionSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validatedData = validationResult.data;

    // Create GDPR version
    const result = await gdprService.create({
      version: validatedData.version,
      title: validatedData.title,
      content: validatedData.content,
      isActive: validatedData.isActive,
    });

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    const version = result.value;

    // Revalidate GDPR management page
    revalidatePath("/office/datenschutz");

    return { success: true, data: { id: version.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Erstellen der Datenschutzversion: ${String(error)}`,
    };
  }
}

/**
 * Update an existing GDPR version.
 *
 * @param input - GDPR version data to update
 * @returns ActionResult with the updated version ID
 */
export async function updateGdprVersionAction(
  input: UpdateGdprVersionInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validationResult = updateGdprVersionSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validatedData = validationResult.data;

    // Update GDPR version
    const result = await gdprService.update({
      id: validatedData.id,
      title: validatedData.title,
      content: validatedData.content,
      isActive: validatedData.isActive,
    });

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    const version = result.value;

    // Revalidate GDPR management page
    revalidatePath("/office/datenschutz");

    return { success: true, data: { id: version.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Aktualisieren der Datenschutzversion: ${String(error)}`,
    };
  }
}

/**
 * Set a GDPR version as the active version.
 *
 * @param input - Object containing the version ID to activate
 * @returns ActionResult indicating success or failure
 */
export async function setActiveVersionAction(
  input: SetActiveVersionInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validationResult = setActiveVersionSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const { id } = validationResult.data;

    // Set version as active
    const result = await gdprService.setActive(id);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    const version = result.value;

    // Revalidate GDPR and customer pages (signature status may have changed)
    revalidatePath("/office/datenschutz");
    revalidatePath("/office/kunden");

    return { success: true, data: { id: version.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Aktivieren der Datenschutzversion: ${String(error)}`,
    };
  }
}

/**
 * Create a signature for a customer.
 *
 * @param input - Signature data including customer ID, version ID, and signature image
 * @returns ActionResult with the created signature ID
 */
export async function createSignatureAction(
  input: CreateSignatureInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // Validate input
    const validationResult = createSignatureSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const validatedData = validationResult.data;

    // Create signature
    const result = await gdprService.createSignature({
      customerId: validatedData.customerId,
      gdprVersionId: validatedData.gdprVersionId,
      signatureData: validatedData.signatureData,
      dataProcessingConsent: validatedData.dataProcessingConsent,
      healthDataConsent: validatedData.healthDataConsent,
      photoConsent: validatedData.photoConsent,
    });

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    const signature = result.value;

    // Revalidate customer pages (signature status has changed)
    revalidatePath("/office/kunden");
    revalidatePath(`/office/kunden/${validatedData.customerId}`);

    return { success: true, data: { id: signature.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Speichern der Unterschrift: ${String(error)}`,
    };
  }
}

/**
 * Form action wrapper for creating a GDPR version from FormData.
 * Use this when submitting forms with FormData.
 *
 * @param formData - FormData from the form submission
 * @returns ActionResult with the created version ID
 */
export async function createGdprVersionFormAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const input: CreateGdprVersionInput = {
    version: formData.get("version") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    isActive: formData.get("isActive") === "true",
  };

  return createGdprVersionAction(input);
}

/**
 * Form action wrapper for setting active version from FormData.
 * Use this when submitting forms with FormData.
 *
 * @param formData - FormData from the form submission
 * @returns ActionResult indicating success or failure
 */
export async function setActiveVersionFormAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const input: SetActiveVersionInput = {
    id: formData.get("id") as string,
  };

  return setActiveVersionAction(input);
}

/**
 * Form action wrapper for creating a signature from FormData.
 * Use this when submitting forms with FormData.
 *
 * @param formData - FormData from the form submission
 * @returns ActionResult with the created signature ID
 */
export async function createSignatureFormAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const input: CreateSignatureInput = {
    customerId: formData.get("customerId") as string,
    gdprVersionId: formData.get("gdprVersionId") as string,
    signatureData: formData.get("signatureData") as string,
    dataProcessingConsent: formData.get("dataProcessingConsent") === "true",
    healthDataConsent: formData.get("healthDataConsent") === "true",
    photoConsent: formData.has("photoConsent") ? formData.get("photoConsent") === "true" : null,
  };

  return createSignatureAction(input);
}
