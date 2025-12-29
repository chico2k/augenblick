"use server";

/**
 * Dashboard Server Actions
 * Next.js Server Actions for dashboard data fetching.
 */

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { incomeService } from "@/lib/services/income.service";
import { outlookService } from "@/lib/services/outlook.service";
import { isErrResult } from "@/lib/services/types";
import { db } from "@/lib/db";
import { signatures, incomeEntries } from "@/lib/db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";

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
 * Get daily income totals for chart.
 */
export async function getDailyIncomeAction(
  startDate: string,
  endDate: string
): Promise<ActionResult<Array<{ date: string; total: number }>>> {
  const authResult = await requireAuth();
  if (!authResult.success) return { success: false, error: authResult.error };

  const result = await incomeService.getDailyTotals(
    new Date(startDate),
    new Date(endDate)
  );

  if (isErrResult(result)) {
    return { success: false, error: result.error.message };
  }

  return { success: true, data: result.value };
}

/**
 * Get upcoming appointments.
 */
export async function getUpcomingAppointmentsAction(limit = 5) {
  const authResult = await requireAuth();
  if (!authResult.success) return { success: false, error: authResult.error };

  const result = await outlookService.getUpcoming(limit);

  if (isErrResult(result)) {
    return { success: false, error: result.error.message };
  }

  return { success: true, data: result.value };
}

/**
 * Get pending appointments.
 */
export async function getPendingAppointmentsAction() {
  const authResult = await requireAuth();
  if (!authResult.success) return { success: false, error: authResult.error };

  const result = await outlookService.getPending();

  if (isErrResult(result)) {
    return { success: false, error: result.error.message };
  }

  return { success: true, data: result.value };
}

/**
 * Optimized GDPR status check for appointments.
 * Uses single query with JOIN instead of N+1 queries.
 */
export async function getGdprStatusForAppointmentsAction(
  appointmentIds: string[]
): Promise<
  ActionResult<{
    appointmentsNeedingGdpr: string[];
    appointmentCustomerMap: Record<string, string>;
  }>
> {
  const authResult = await requireAuth();
  if (!authResult.success) return { success: false, error: authResult.error };

  if (appointmentIds.length === 0) {
    return {
      success: true,
      data: {
        appointmentsNeedingGdpr: [],
        appointmentCustomerMap: {},
      },
    };
  }

  const incomeWithSignatures = await db
    .select({
      appointmentId: incomeEntries.appointmentId,
      customerId: incomeEntries.customerId,
      hasSignature: signatures.id,
    })
    .from(incomeEntries)
    .leftJoin(signatures, eq(incomeEntries.customerId, signatures.customerId))
    .where(
      and(
        inArray(incomeEntries.appointmentId, appointmentIds),
        isNull(incomeEntries.deletedAt)
      )
    );

  const appointmentCustomerMap: Record<string, string> = {};
  const customersWithoutGdpr = new Set<string>();

  for (const row of incomeWithSignatures) {
    if (row.customerId && row.appointmentId) {
      appointmentCustomerMap[row.appointmentId] = row.customerId;
      if (!row.hasSignature) {
        customersWithoutGdpr.add(row.customerId);
      }
    }
  }

  const appointmentsNeedingGdpr = Object.entries(appointmentCustomerMap)
    .filter(([_appointmentId, customerId]) => customersWithoutGdpr.has(customerId))
    .map(([appointmentId]) => appointmentId);

  return {
    success: true,
    data: {
      appointmentsNeedingGdpr,
      appointmentCustomerMap,
    },
  };
}
