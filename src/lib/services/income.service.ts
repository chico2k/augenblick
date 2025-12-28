/**
 * Income Service
 * Provides CRUD operations for income entries (Einnahmen).
 */

import { eq, and, gte, lte, desc, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  incomeEntries,
  treatmentTypes,
  customers,
  outlookAppointments,
  type IncomeEntry,
  type PaymentMethod,
} from "@/lib/db/schema";
import { type Result, Ok, Err, isErrResult, type PaginationParams, type PaginatedResult } from "./types";

/**
 * Income entry with related data.
 */
export interface IncomeEntryWithRelations extends IncomeEntry {
  customer?: { id: string; firstName: string; lastName: string } | null;
  treatmentType?: { id: string; name: string; defaultPrice: string } | null;
  appointment?: { id: string; subject: string; startTime: Date } | null;
}

/**
 * Input for creating an income entry.
 */
export interface CreateIncomeInput {
  amount: string; // decimal as string
  paymentMethod?: PaymentMethod;
  incomeDate: Date;
  customerId?: string | null;
  treatmentTypeId?: string | null;
  appointmentId?: string | null;
  notes?: string | null;
}

/**
 * Input for updating an income entry.
 */
export interface UpdateIncomeInput {
  amount?: string;
  paymentMethod?: PaymentMethod;
  incomeDate?: Date;
  customerId?: string | null;
  treatmentTypeId?: string | null;
  notes?: string | null;
}

/**
 * Filter for listing income entries.
 */
export interface IncomeFilter {
  startDate?: Date;
  endDate?: Date;
  customerId?: string;
  treatmentTypeId?: string;
  paymentMethod?: PaymentMethod;
}

/**
 * Aggregated income statistics.
 */
export interface IncomeStats {
  totalAmount: number;
  count: number;
  cashAmount: number;
  cardAmount: number;
}

/**
 * Income Service with CRUD operations.
 */
export const incomeService = {
  /**
   * Get income entry by appointment ID.
   */
  async getByAppointmentId(appointmentId: string): Promise<Result<IncomeEntryWithRelations | null>> {
    try {
      const result = await db
        .select({
          income: incomeEntries,
          customer: {
            id: customers.id,
            firstName: customers.firstName,
            lastName: customers.lastName,
          },
          treatmentType: {
            id: treatmentTypes.id,
            name: treatmentTypes.name,
            defaultPrice: treatmentTypes.defaultPrice,
          },
          appointment: {
            id: outlookAppointments.id,
            subject: outlookAppointments.subject,
            startTime: outlookAppointments.startTime,
          },
        })
        .from(incomeEntries)
        .leftJoin(customers, eq(incomeEntries.customerId, customers.id))
        .leftJoin(treatmentTypes, eq(incomeEntries.treatmentTypeId, treatmentTypes.id))
        .leftJoin(outlookAppointments, eq(incomeEntries.appointmentId, outlookAppointments.id))
        .where(and(eq(incomeEntries.appointmentId, appointmentId), isNull(incomeEntries.deletedAt)))
        .limit(1);

      if (result.length === 0) {
        return Ok(null);
      }

      const row = result[0]!;
      return Ok({
        ...row.income,
        customer: row.customer?.id ? row.customer : null,
        treatmentType: row.treatmentType?.id ? row.treatmentType : null,
        appointment: row.appointment?.id ? row.appointment : null,
      });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Einnahme: ${String(error)}`,
      });
    }
  },

  /**
   * Get income entry by ID with relations.
   */
  async getById(id: string): Promise<Result<IncomeEntryWithRelations>> {
    try {
      const result = await db
        .select({
          income: incomeEntries,
          customer: {
            id: customers.id,
            firstName: customers.firstName,
            lastName: customers.lastName,
          },
          treatmentType: {
            id: treatmentTypes.id,
            name: treatmentTypes.name,
            defaultPrice: treatmentTypes.defaultPrice,
          },
          appointment: {
            id: outlookAppointments.id,
            subject: outlookAppointments.subject,
            startTime: outlookAppointments.startTime,
          },
        })
        .from(incomeEntries)
        .leftJoin(customers, eq(incomeEntries.customerId, customers.id))
        .leftJoin(treatmentTypes, eq(incomeEntries.treatmentTypeId, treatmentTypes.id))
        .leftJoin(outlookAppointments, eq(incomeEntries.appointmentId, outlookAppointments.id))
        .where(and(eq(incomeEntries.id, id), isNull(incomeEntries.deletedAt)))
        .limit(1);

      if (result.length === 0) {
        return Err({
          code: "NOT_FOUND",
          message: "Einnahme nicht gefunden",
        });
      }

      const row = result[0]!;
      return Ok({
        ...row.income,
        customer: row.customer?.id ? row.customer : null,
        treatmentType: row.treatmentType?.id ? row.treatmentType : null,
        appointment: row.appointment?.id ? row.appointment : null,
      });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Einnahme: ${String(error)}`,
      });
    }
  },

  /**
   * List income entries with optional filtering.
   */
  async list(
    filter: IncomeFilter = {},
    pagination: PaginationParams = {}
  ): Promise<Result<PaginatedResult<IncomeEntryWithRelations>>> {
    try {
      const page = pagination.page ?? 1;
      const limit = pagination.limit ?? 20;
      const offset = (page - 1) * limit;

      // Build conditions
      const conditions = [isNull(incomeEntries.deletedAt)];

      if (filter.startDate) {
        conditions.push(gte(incomeEntries.incomeDate, filter.startDate));
      }
      if (filter.endDate) {
        conditions.push(lte(incomeEntries.incomeDate, filter.endDate));
      }
      if (filter.customerId) {
        conditions.push(eq(incomeEntries.customerId, filter.customerId));
      }
      if (filter.treatmentTypeId) {
        conditions.push(eq(incomeEntries.treatmentTypeId, filter.treatmentTypeId));
      }
      if (filter.paymentMethod) {
        conditions.push(eq(incomeEntries.paymentMethod, filter.paymentMethod));
      }

      // Get total count
      const countResult = await db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(incomeEntries)
        .where(and(...conditions));

      const total = countResult[0]?.count ?? 0;

      // Get paginated items with relations
      const result = await db
        .select({
          income: incomeEntries,
          customer: {
            id: customers.id,
            firstName: customers.firstName,
            lastName: customers.lastName,
          },
          treatmentType: {
            id: treatmentTypes.id,
            name: treatmentTypes.name,
            defaultPrice: treatmentTypes.defaultPrice,
          },
          appointment: {
            id: outlookAppointments.id,
            subject: outlookAppointments.subject,
            startTime: outlookAppointments.startTime,
          },
        })
        .from(incomeEntries)
        .leftJoin(customers, eq(incomeEntries.customerId, customers.id))
        .leftJoin(treatmentTypes, eq(incomeEntries.treatmentTypeId, treatmentTypes.id))
        .leftJoin(outlookAppointments, eq(incomeEntries.appointmentId, outlookAppointments.id))
        .where(and(...conditions))
        .orderBy(desc(incomeEntries.incomeDate))
        .limit(limit)
        .offset(offset);

      const items = result.map((row) => ({
        ...row.income,
        customer: row.customer?.id ? row.customer : null,
        treatmentType: row.treatmentType?.id ? row.treatmentType : null,
        appointment: row.appointment?.id ? row.appointment : null,
      }));

      return Ok({
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Einnahmen: ${String(error)}`,
      });
    }
  },

  /**
   * Create a new income entry.
   */
  async create(input: CreateIncomeInput): Promise<Result<IncomeEntry>> {
    try {
      const [entry] = await db
        .insert(incomeEntries)
        .values({
          amount: input.amount,
          paymentMethod: input.paymentMethod ?? "cash",
          incomeDate: input.incomeDate,
          customerId: input.customerId ?? null,
          treatmentTypeId: input.treatmentTypeId ?? null,
          appointmentId: input.appointmentId ?? null,
          notes: input.notes ?? null,
        })
        .returning();

      if (!entry) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Erstellen der Einnahme",
        });
      }

      return Ok(entry);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Erstellen der Einnahme: ${String(error)}`,
      });
    }
  },

  /**
   * Update an income entry.
   */
  async update(id: string, input: UpdateIncomeInput): Promise<Result<IncomeEntry>> {
    try {
      const [existing] = await db
        .select()
        .from(incomeEntries)
        .where(and(eq(incomeEntries.id, id), isNull(incomeEntries.deletedAt)))
        .limit(1);

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Einnahme nicht gefunden",
        });
      }

      const [entry] = await db
        .update(incomeEntries)
        .set({
          ...(input.amount !== undefined && { amount: input.amount }),
          ...(input.paymentMethod !== undefined && { paymentMethod: input.paymentMethod }),
          ...(input.incomeDate !== undefined && { incomeDate: input.incomeDate }),
          ...(input.customerId !== undefined && { customerId: input.customerId }),
          ...(input.treatmentTypeId !== undefined && { treatmentTypeId: input.treatmentTypeId }),
          ...(input.notes !== undefined && { notes: input.notes }),
        })
        .where(eq(incomeEntries.id, id))
        .returning();

      if (!entry) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Fehler beim Aktualisieren der Einnahme",
        });
      }

      return Ok(entry);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Aktualisieren der Einnahme: ${String(error)}`,
      });
    }
  },

  /**
   * Soft delete an income entry.
   */
  async delete(id: string): Promise<Result<{ deleted: true }>> {
    try {
      const [existing] = await db
        .select()
        .from(incomeEntries)
        .where(and(eq(incomeEntries.id, id), isNull(incomeEntries.deletedAt)))
        .limit(1);

      if (!existing) {
        return Err({
          code: "NOT_FOUND",
          message: "Einnahme nicht gefunden",
        });
      }

      await db
        .update(incomeEntries)
        .set({ deletedAt: new Date() })
        .where(eq(incomeEntries.id, id));

      return Ok({ deleted: true });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Löschen der Einnahme: ${String(error)}`,
      });
    }
  },

  /**
   * Get income statistics for a date range.
   */
  async getStats(startDate: Date, endDate: Date): Promise<Result<IncomeStats>> {
    try {
      const result = await db
        .select({
          totalAmount: sql`COALESCE(SUM(${incomeEntries.amount}), 0)`.mapWith(String),
          count: sql`COUNT(*)`.mapWith(Number),
          cashAmount: sql`COALESCE(SUM(CASE WHEN ${incomeEntries.paymentMethod} = 'cash' THEN ${incomeEntries.amount} ELSE 0 END), 0)`.mapWith(String),
          cardAmount: sql`COALESCE(SUM(CASE WHEN ${incomeEntries.paymentMethod} = 'card' THEN ${incomeEntries.amount} ELSE 0 END), 0)`.mapWith(String),
        })
        .from(incomeEntries)
        .where(
          and(
            isNull(incomeEntries.deletedAt),
            gte(incomeEntries.incomeDate, startDate),
            lte(incomeEntries.incomeDate, endDate)
          )
        );

      const row = result[0];
      if (!row) {
        return Ok({ totalAmount: 0, count: 0, cashAmount: 0, cardAmount: 0 });
      }
      return Ok({
        totalAmount: parseFloat(row.totalAmount),
        count: row.count,
        cashAmount: parseFloat(row.cashAmount),
        cardAmount: parseFloat(row.cardAmount),
      });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Statistiken: ${String(error)}`,
      });
    }
  },

  /**
   * Get weekly income total (current week, Mon-Sun).
   */
  async getWeeklyTotal(): Promise<Result<IncomeStats>> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + mondayOffset);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return this.getStats(startOfWeek, endOfWeek);
  },

  /**
   * Get monthly income total (current month).
   */
  async getMonthlyTotal(): Promise<Result<IncomeStats>> {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return this.getStats(startOfMonth, endOfMonth);
  },

  /**
   * Get recent income entries.
   */
  async getRecent(limit = 5): Promise<Result<IncomeEntryWithRelations[]>> {
    const result = await this.list({}, { page: 1, limit });
    if (isErrResult(result)) {
      return Err(result.error);
    }
    return Ok(result.value.items);
  },

  /**
   * Export income entries for a date range (for EÜR/CSV export).
   */
  async exportForDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Result<IncomeEntryWithRelations[]>> {
    const result = await this.list({ startDate, endDate }, { page: 1, limit: 10000 });
    if (isErrResult(result)) {
      return Err(result.error);
    }
    return Ok(result.value.items);
  },

  /**
   * Get daily income totals for chart display.
   * Groups income by date and sums the total for each day.
   */
  async getDailyTotals(
    startDate: Date,
    endDate: Date
  ): Promise<Result<Array<{ date: string; total: number }>>> {
    try {
      const result = await db
        .select({
          date: sql<string>`DATE(${incomeEntries.incomeDate})`.as('date'),
          total: sql<number>`COALESCE(SUM(CAST(${incomeEntries.amount} AS DECIMAL)), 0)`.as('total'),
        })
        .from(incomeEntries)
        .where(
          and(
            gte(incomeEntries.incomeDate, startDate),
            lte(incomeEntries.incomeDate, endDate),
            isNull(incomeEntries.deletedAt)
          )
        )
        .groupBy(sql`DATE(${incomeEntries.incomeDate})`)
        .orderBy(sql`DATE(${incomeEntries.incomeDate})`);

      return Ok(result.map((row) => ({
        date: row.date,
        total: Number(row.total),
      })));
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Tageseinnahmen: ${String(error)}`,
      });
    }
  },
};

export type IncomeService = typeof incomeService;
