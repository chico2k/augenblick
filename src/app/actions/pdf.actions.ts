"use server";

/**
 * PDF Server Actions for Next.js.
 * Provides the public API for PDF generation operations with Zod validation.
 * All actions return ActionResult for consistent error handling.
 */

import { z } from "zod";
import { pdfService } from "@/lib/services/pdf.service";
import { AppError } from "@/lib/errors";

/**
 * Standard action result type for all server actions.
 * Provides consistent success/error structure for client consumption.
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

/**
 * Helper to convert AppError to ActionResult error format.
 */
function toErrorResult<T>(error: AppError): ActionResult<T> {
  return {
    success: false,
    error: { code: error.code, message: error.message },
  };
}

/**
 * Helper to handle unknown errors.
 */
function handleUnknownError<T>(e: unknown): ActionResult<T> {
  if (e instanceof AppError) {
    return toErrorResult(e);
  }
  return {
    success: false,
    error: { code: "UNKNOWN", message: "Ein Fehler ist aufgetreten" },
  };
}

// ============================================================================
// Session Handling
// ============================================================================

/**
 * Placeholder for session handling.
 * TODO: Replace with actual auth implementation when available.
 * Currently returns a mock user ID for development purposes.
 *
 * @throws AppError.unauthorized() when auth is implemented and no session exists
 */
function getSessionOrThrow(): { userId: string } {
  // TODO: Implement actual session handling with auth library
  // Example with better-auth:
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (!session) throw AppError.unauthorized();
  // return { userId: session.user.id };

  // Development placeholder - returns mock user
  return { userId: "dev-user-placeholder" };
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

/**
 * Schema for generating a GDPR PDF.
 * Validates customer ID and signature ID.
 */
const generateGdprPdfSchema = z.object({
  customerId: z.string().min(1, "Kunden-ID ist erforderlich"),
  signatureId: z.string().min(1, "Signatur-ID ist erforderlich"),
});

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Result type for PDF generation.
 * Returns the PDF as a base64-encoded string for client consumption.
 */
export type GeneratePdfResult = {
  pdf: string;
  contentType: string;
  filename: string;
};

/**
 * Generates a GDPR consent PDF document for a customer.
 * The PDF includes customer information, GDPR consent text,
 * and the customer's signature.
 *
 * @param input - Customer ID and signature ID
 * @returns ActionResult containing the PDF as base64 or an error
 */
export async function generateGdprPdfAction(
  input: z.infer<typeof generateGdprPdfSchema>
): Promise<ActionResult<GeneratePdfResult>> {
  try {
    getSessionOrThrow();

    // Validate input with Zod
    const parsed = generateGdprPdfSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: firstError?.message ?? "Validierungsfehler",
        },
      };
    }

    // Call service
    console.log("PDF Action: Calling service with", {
      customerId: parsed.data.customerId,
      signatureId: parsed.data.signatureId,
    });

    const result = await pdfService.generateGdprPdf(
      parsed.data.customerId,
      parsed.data.signatureId
    );

    if (result.isErr()) {
      console.error("PDF Action Error:", {
        code: result.error.code,
        message: result.error.message,
        details: result.error.details,
      });
      return toErrorResult(result.error);
    }

    // Convert Buffer to base64 for client consumption
    const pdfBase64 = result.value.toString("base64");

    return {
      success: true,
      data: {
        pdf: pdfBase64,
        contentType: "application/pdf",
        filename: `gdpr-einwilligung-${parsed.data.customerId}.pdf`,
      },
    };
  } catch (e) {
    return handleUnknownError(e);
  }
}
