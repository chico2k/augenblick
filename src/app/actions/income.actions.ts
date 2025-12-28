"use server";

/**
 * Income Server Actions
 * Next.js Server Actions for income entry CRUD operations.
 */

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { incomeService } from "@/lib/services/income.service";
import { outlookService } from "@/lib/services/outlook.service";
import { isErrResult } from "@/lib/services/types";

/**
 * Sanitize a value for CSV export to prevent formula injection.
 * Prefixes dangerous characters with a single quote to prevent
 * spreadsheet programs from interpreting them as formulas.
 */
function sanitizeCsvValue(value: string): string {
  // Characters that can trigger formula execution in Excel/LibreOffice
  const dangerousChars = ["=", "+", "-", "@", "\t", "\r", "\n"];
  if (dangerousChars.some((char) => value.startsWith(char))) {
    return `'${value}`;
  }
  return value;
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
 * Zod schema for income creation.
 */
const createIncomeSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Ungültiger Betrag"),
  paymentMethod: z.enum(["cash", "card"]).default("cash"),
  incomeDate: z.coerce.date(),
  customerId: z.string().uuid().nullable().optional(),
  treatmentTypeId: z.string().uuid().nullable().optional(),
  appointmentId: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
});

/**
 * Zod schema for income update.
 */
const updateIncomeSchema = z.object({
  id: z.string().uuid("Ungültige ID"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Ungültiger Betrag").optional(),
  paymentMethod: z.enum(["cash", "card"]).optional(),
  incomeDate: z.coerce.date().optional(),
  customerId: z.string().uuid().nullable().optional(),
  treatmentTypeId: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
});

/**
 * Input types derived from Zod schemas.
 */
export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;

/**
 * Create a new income entry.
 */
export async function createIncomeAction(
  input: CreateIncomeInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const validationResult = createIncomeSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const result = await incomeService.create(validationResult.data);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");

    return { success: true, data: { id: result.value.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Erstellen der Einnahme: ${String(error)}`,
    };
  }
}

/**
 * Get existing income entry for an appointment.
 */
export async function getIncomeByAppointmentAction(
  appointmentId: string
): Promise<ActionResult<{
  id: string;
  amount: string;
  treatmentTypeId: string | null;
  customerId: string | null;
  paymentMethod: "cash" | "card";
} | null>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const result = await incomeService.getByAppointmentId(appointmentId);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    if (!result.value) {
      return { success: true, data: null };
    }

    const income = result.value;
    return {
      success: true,
      data: {
        id: income.id,
        amount: income.amount,
        treatmentTypeId: income.treatmentTypeId,
        customerId: income.customerId,
        paymentMethod: income.paymentMethod,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Laden der Einnahme: ${String(error)}`,
    };
  }
}

/**
 * Confirm an appointment and create/update income entry in one action.
 * This is the main "confirm appointment" flow.
 */
export async function confirmAppointmentAction(input: {
  appointmentId: string;
  amount: string;
  treatmentTypeId?: string | null;
  customerId?: string | null;
  paymentMethod?: "cash" | "card";
  notes?: string | null;
}): Promise<ActionResult<{ incomeId: string }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    // Validate appointment exists
    const appointmentResult = await outlookService.getById(input.appointmentId);
    if (isErrResult(appointmentResult)) {
      return { success: false, error: appointmentResult.error.message };
    }

    const appointment = appointmentResult.value;

    // Check if income entry already exists for this appointment
    const existingIncomeResult = await incomeService.getByAppointmentId(input.appointmentId);
    if (isErrResult(existingIncomeResult)) {
      return { success: false, error: existingIncomeResult.error.message };
    }

    let incomeId: string;

    if (existingIncomeResult.value) {
      // Update existing income entry
      const updateResult = await incomeService.update(existingIncomeResult.value.id, {
        amount: input.amount,
        paymentMethod: input.paymentMethod ?? "cash",
        customerId: input.customerId ?? null,
        treatmentTypeId: input.treatmentTypeId ?? null,
        notes: input.notes ?? null,
      });

      if (isErrResult(updateResult)) {
        return { success: false, error: updateResult.error.message };
      }

      incomeId = updateResult.value.id;
    } else {
      // Mark appointment as confirmed
      const confirmResult = await outlookService.confirm(input.appointmentId);
      if (isErrResult(confirmResult)) {
        return { success: false, error: confirmResult.error.message };
      }

      // Create new income entry linked to appointment
      const incomeResult = await incomeService.create({
        amount: input.amount,
        paymentMethod: input.paymentMethod ?? "cash",
        incomeDate: appointment.startTime,
        customerId: input.customerId ?? null,
        treatmentTypeId: input.treatmentTypeId ?? null,
        appointmentId: input.appointmentId,
        notes: input.notes ?? null,
      });

      if (isErrResult(incomeResult)) {
        // Rollback: revert appointment to pending status
        await outlookService.revertToPending(input.appointmentId);
        return { success: false, error: incomeResult.error.message };
      }

      incomeId = incomeResult.value.id;
    }

    revalidatePath("/office/euer");
    revalidatePath("/office");

    return { success: true, data: { incomeId } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Bestätigen des Termins: ${String(error)}`,
    };
  }
}

/**
 * Update an existing income entry.
 */
export async function updateIncomeAction(
  input: UpdateIncomeInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const validationResult = updateIncomeSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const { id, ...updateData } = validationResult.data;
    const result = await incomeService.update(id, updateData);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");

    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Aktualisieren der Einnahme: ${String(error)}`,
    };
  }
}

/**
 * Delete an income entry (soft delete).
 */
export async function deleteIncomeAction(id: string): Promise<ActionResult> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    if (!id || typeof id !== "string") {
      return { success: false, error: "Ungültige ID" };
    }

    const result = await incomeService.delete(id);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Löschen der Einnahme: ${String(error)}`,
    };
  }
}

/**
 * Get income statistics for dashboard.
 */
export async function getIncomeStatsAction(): Promise<
  ActionResult<{
    weeklyTotal: number;
    monthlyTotal: number;
    weeklyCount: number;
    monthlyCount: number;
  }>
> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const weeklyResult = await incomeService.getWeeklyTotal();
    const monthlyResult = await incomeService.getMonthlyTotal();

    if (isErrResult(weeklyResult)) {
      return { success: false, error: weeklyResult.error.message };
    }
    if (isErrResult(monthlyResult)) {
      return { success: false, error: monthlyResult.error.message };
    }

    return {
      success: true,
      data: {
        weeklyTotal: weeklyResult.value.totalAmount,
        monthlyTotal: monthlyResult.value.totalAmount,
        weeklyCount: weeklyResult.value.count,
        monthlyCount: monthlyResult.value.count,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Laden der Statistiken: ${String(error)}`,
    };
  }
}

/**
 * Export income entries as CSV data.
 */
export async function exportIncomeAction(input: {
  startDate: string;
  endDate: string;
}): Promise<ActionResult<{ csv: string; filename: string }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    endDate.setHours(23, 59, 59, 999);

    const result = await incomeService.exportForDateRange(startDate, endDate);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    const entries = result.value;

    // Generate CSV with sanitized values to prevent formula injection
    const csvHeaders = ["Datum", "Betrag", "Zahlungsart", "Behandlung", "Kunde", "Notizen"];
    const rows = entries.map((entry) => [
      entry.incomeDate.toLocaleDateString("de-DE"),
      parseFloat(entry.amount).toFixed(2).replace(".", ","),
      entry.paymentMethod === "cash" ? "Bar" : "EC-Karte",
      sanitizeCsvValue(entry.treatmentType?.name ?? ""),
      sanitizeCsvValue(
        entry.customer ? `${entry.customer.firstName} ${entry.customer.lastName}` : ""
      ),
      sanitizeCsvValue(entry.notes ?? ""),
    ]);

    const csv = [
      csvHeaders.join(";"),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(";")),
    ].join("\n");

    const filename = `einnahmen_${input.startDate}_${input.endDate}.csv`;

    return { success: true, data: { csv, filename } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Exportieren: ${String(error)}`,
    };
  }
}
