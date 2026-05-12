"use server";

/**
 * Expense Server Actions
 * Next.js Server Actions for simple Ausgaben tracking.
 */

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import type { ExpenseType } from "@/lib/db/schema";
import { expenseService } from "@/lib/services/expense.service";
import { isErrResult } from "@/lib/services/types";

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

async function requireAuth(): Promise<
  { success: true } | { success: false; error: string }
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Nicht autorisiert" };
  }

  return { success: true };
}

const createExpenseTypeSchema = z.object({
  name: z.string().trim().min(1, "Name erforderlich").max(80, "Name zu lang"),
});

const expenseDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ungültiges Datum");

const amountSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Ungültiger Betrag");

const createExpenseEntrySchema = z.object({
  amount: amountSchema,
  expenseDate: expenseDateSchema,
  expenseTypeId: z.string().uuid("Ausgabentyp erforderlich"),
});

const deleteExpenseSchema = z.object({
  id: z.string().uuid("Ungültige ID"),
});

export type CreateExpenseTypeInput = z.infer<typeof createExpenseTypeSchema>;
export type CreateExpenseEntryInput = z.infer<typeof createExpenseEntrySchema>;

function parseExpenseDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

export async function listExpenseTypesAction(): Promise<
  ActionResult<ExpenseType[]>
> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const result = await expenseService.listTypes();
    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.value };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Laden der Ausgabentypen: ${String(error)}`,
    };
  }
}

export async function createExpenseTypeAction(
  input: CreateExpenseTypeInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const validationResult = createExpenseTypeSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const result = await expenseService.createType(validationResult.data);
    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/ausgaben");

    return { success: true, data: { id: result.value.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Erstellen des Ausgabentyps: ${String(error)}`,
    };
  }
}

export async function deleteExpenseTypeAction(id: string): Promise<ActionResult> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const validationResult = deleteExpenseSchema.safeParse({ id });
    if (!validationResult.success) {
      return { success: false, error: "Ungültige ID" };
    }

    const result = await expenseService.deleteType(validationResult.data.id);
    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/ausgaben");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Löschen des Ausgabentyps: ${String(error)}`,
    };
  }
}

export async function createExpenseEntryAction(
  input: CreateExpenseEntryInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const validationResult = createExpenseEntrySchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    const result = await expenseService.createEntry({
      amount: validationResult.data.amount,
      expenseDate: parseExpenseDate(validationResult.data.expenseDate),
      expenseTypeId: validationResult.data.expenseTypeId,
    });
    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/ausgaben");
    revalidatePath("/office");

    return { success: true, data: { id: result.value.id } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Erstellen der Ausgabe: ${String(error)}`,
    };
  }
}

export async function deleteExpenseEntryAction(id: string): Promise<ActionResult> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const validationResult = deleteExpenseSchema.safeParse({ id });
    if (!validationResult.success) {
      return { success: false, error: "Ungültige ID" };
    }

    const result = await expenseService.deleteEntry(validationResult.data.id);
    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/ausgaben");
    revalidatePath("/office");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Löschen der Ausgabe: ${String(error)}`,
    };
  }
}
