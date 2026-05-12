/**
 * Expense Service
 * Provides simple CRUD operations for Ausgaben.
 */

import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  expenseEntries,
  expenseTypes,
  type ExpenseEntry,
  type ExpenseType,
} from "@/lib/db/schema";
import { type Result, Ok, Err } from "./types";

export interface ExpenseEntryWithType extends ExpenseEntry {
  expenseType?: { id: string; name: string } | null;
}

export interface CreateExpenseTypeInput {
  name: string;
}

export interface CreateExpenseEntryInput {
  amount: string;
  expenseDate: Date;
  expenseTypeId?: string | null;
}

export interface ExpenseStats {
  totalAmount: number;
  count: number;
}

export const expenseService = {
  /**
   * List all expense types ordered by name.
   */
  async listTypes(): Promise<Result<ExpenseType[]>> {
    try {
      const types = await db
        .select()
        .from(expenseTypes)
        .orderBy(asc(expenseTypes.name));

      return Ok(types);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Ausgabentypen: ${String(error)}`,
      });
    }
  },

  /**
   * Create a new expense type.
   */
  async createType(input: CreateExpenseTypeInput): Promise<Result<ExpenseType>> {
    try {
      const [type] = await db
        .insert(expenseTypes)
        .values({ name: input.name.trim() })
        .returning();

      if (!type) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Erstellen des Ausgabentyps",
        });
      }

      return Ok(type);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Erstellen des Ausgabentyps: ${String(error)}`,
      });
    }
  },

  /**
   * Delete an expense type. Existing expense entries keep their amount/date.
   */
  async deleteType(id: string): Promise<Result<{ deleted: true }>> {
    try {
      const [existing] = await db
        .select()
        .from(expenseTypes)
        .where(eq(expenseTypes.id, id))
        .limit(1);

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Ausgabentyp nicht gefunden",
        });
      }

      await db.delete(expenseTypes).where(eq(expenseTypes.id, id));

      return Ok({ deleted: true });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Löschen des Ausgabentyps: ${String(error)}`,
      });
    }
  },

  /**
   * List recent expense entries.
   */
  async listEntries(limit = 100): Promise<Result<ExpenseEntryWithType[]>> {
    try {
      const result = await db
        .select({
          expense: expenseEntries,
          expenseType: {
            id: expenseTypes.id,
            name: expenseTypes.name,
          },
        })
        .from(expenseEntries)
        .leftJoin(expenseTypes, eq(expenseEntries.expenseTypeId, expenseTypes.id))
        .orderBy(desc(expenseEntries.expenseDate), desc(expenseEntries.createdAt))
        .limit(limit);

      return Ok(
        result.map((row) => ({
          ...row.expense,
          expenseType: row.expenseType?.id ? row.expenseType : null,
        }))
      );
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Ausgaben: ${String(error)}`,
      });
    }
  },

  /**
   * Create a new expense entry.
   */
  async createEntry(input: CreateExpenseEntryInput): Promise<Result<ExpenseEntry>> {
    try {
      const [entry] = await db
        .insert(expenseEntries)
        .values({
          amount: input.amount,
          expenseDate: input.expenseDate,
          expenseTypeId: input.expenseTypeId ?? null,
        })
        .returning();

      if (!entry) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Erstellen der Ausgabe",
        });
      }

      return Ok(entry);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Erstellen der Ausgabe: ${String(error)}`,
      });
    }
  },

  /**
   * Delete an expense entry.
   */
  async deleteEntry(id: string): Promise<Result<{ deleted: true }>> {
    try {
      const [existing] = await db
        .select()
        .from(expenseEntries)
        .where(eq(expenseEntries.id, id))
        .limit(1);

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Ausgabe nicht gefunden",
        });
      }

      await db.delete(expenseEntries).where(eq(expenseEntries.id, id));

      return Ok({ deleted: true });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Löschen der Ausgabe: ${String(error)}`,
      });
    }
  },

  /**
   * Get expense statistics for a date range.
   */
  async getStats(startDate: Date, endDate: Date): Promise<Result<ExpenseStats>> {
    try {
      const result = await db
        .select({
          totalAmount: sql`COALESCE(SUM(${expenseEntries.amount}), 0)`.mapWith(String),
          count: sql`COUNT(*)`.mapWith(Number),
        })
        .from(expenseEntries)
        .where(
          and(
            gte(expenseEntries.expenseDate, startDate),
            lte(expenseEntries.expenseDate, endDate)
          )
        );

      const row = result[0];
      if (!row) {
        return Ok({ totalAmount: 0, count: 0 });
      }

      return Ok({
        totalAmount: parseFloat(row.totalAmount),
        count: row.count,
      });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Ausgaben-Statistik: ${String(error)}`,
      });
    }
  },

  /**
   * Get current month expense total.
   */
  async getMonthlyTotal(): Promise<Result<ExpenseStats>> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return this.getStats(startOfMonth, endOfMonth);
  },
};

export type ExpenseService = typeof expenseService;
