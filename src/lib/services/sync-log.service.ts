/**
 * Sync Log Service
 * Manages Outlook sync log entries using neverthrow for error handling.
 */

import { desc, count, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { syncLogs, type SyncLog, type NewSyncLog } from "@/lib/db/schema";
import { Result, Ok, Err, type ServiceError } from "./types";

/**
 * List sync logs with pagination.
 */
async function list(params: {
  page?: number;
  limit?: number;
}): Promise<
  Result<{
    items: SyncLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> {
  try {
    const page = params.page ?? 1;
    const limit = params.limit ?? 25;
    const offset = (page - 1) * limit;

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(syncLogs)
      .execute();
    const total = totalResult[0]?.count ?? 0;

    // Get paginated logs
    const items = await db
      .select()
      .from(syncLogs)
      .orderBy(desc(syncLogs.syncStartedAt))
      .limit(limit)
      .offset(offset)
      .execute();

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
      message: "Failed to list sync logs",
      details: { error: String(error) },
    });
  }
}

/**
 * Get the most recent sync log.
 */
async function getLatest(): Promise<Result<SyncLog | null>> {
  try {
    const result = await db
      .select()
      .from(syncLogs)
      .orderBy(desc(syncLogs.syncStartedAt))
      .limit(1)
      .execute();

    return Ok(result[0] ?? null);
  } catch (error) {
    return Err({
      code: "DATABASE_ERROR",
      message: "Failed to get latest sync log",
      details: { error: String(error) },
    });
  }
}

/**
 * Get a sync log by ID.
 */
async function getById(id: string): Promise<Result<SyncLog | null>> {
  try {
    const result = await db
      .select()
      .from(syncLogs)
      .where(sql`${syncLogs.id} = ${id}`)
      .limit(1)
      .execute();

    return Ok(result[0] ?? null);
  } catch (error) {
    return Err({
      code: "DATABASE_ERROR",
      message: "Failed to get sync log",
      details: { error: String(error) },
    });
  }
}

/**
 * Create a new sync log entry (start of sync).
 */
async function create(
  data: Pick<
    NewSyncLog,
    "syncStartedAt" | "status" | "message"
  >
): Promise<Result<SyncLog>> {
  try {
    const result = await db
      .insert(syncLogs)
      .values({
        syncStartedAt: data.syncStartedAt,
        status: data.status ?? "in_progress",
        message: data.message,
        appointmentsImported: 0,
        appointmentsFailed: 0,
        appointmentsSkipped: 0,
      })
      .returning()
      .execute();

    if (!result[0]) {
      return Err({
        code: "DATABASE_ERROR",
        message: "Failed to create sync log",
      });
    }

    return Ok(result[0]);
  } catch (error) {
    return Err({
      code: "DATABASE_ERROR",
      message: "Failed to create sync log",
      details: { error: String(error) },
    });
  }
}

/**
 * Update a sync log entry (end of sync or progress update).
 */
async function update(
  id: string,
  data: Partial<
    Pick<
      SyncLog,
      | "syncEndedAt"
      | "status"
      | "message"
      | "appointmentsImported"
      | "appointmentsFailed"
      | "appointmentsSkipped"
      | "errorDetails"
    >
  >
): Promise<Result<SyncLog>> {
  try {
    const result = await db
      .update(syncLogs)
      .set(data)
      .where(sql`${syncLogs.id} = ${id}`)
      .returning()
      .execute();

    if (!result[0]) {
      return Err({
        code: "NOT_FOUND",
        message: "Sync log not found",
      });
    }

    return Ok(result[0]);
  } catch (error) {
    return Err({
      code: "DATABASE_ERROR",
      message: "Failed to update sync log",
      details: { error: String(error) },
    });
  }
}

/**
 * Get sync statistics (total syncs, success rate, etc.)
 */
async function getStats(): Promise<
  Result<{
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    totalAppointmentsImported: number;
    lastSyncAt: Date | null;
  }>
> {
  try {
    const stats = await db
      .select({
        totalSyncs: count(),
        successfulSyncs: sql<number>`count(*) filter (where ${syncLogs.status} = 'success')`,
        failedSyncs: sql<number>`count(*) filter (where ${syncLogs.status} = 'error')`,
        totalAppointmentsImported: sql<number>`sum(${syncLogs.appointmentsImported})`,
        lastSyncAt: sql<Date | null>`max(${syncLogs.syncStartedAt})`,
      })
      .from(syncLogs)
      .execute();

    return Ok({
      totalSyncs: stats[0]?.totalSyncs ?? 0,
      successfulSyncs: stats[0]?.successfulSyncs ?? 0,
      failedSyncs: stats[0]?.failedSyncs ?? 0,
      totalAppointmentsImported: stats[0]?.totalAppointmentsImported ?? 0,
      lastSyncAt: stats[0]?.lastSyncAt ?? null,
    });
  } catch (error) {
    return Err({
      code: "DATABASE_ERROR",
      message: "Failed to get sync statistics",
      details: { error: String(error) },
    });
  }
}

export const syncLogService = {
  list,
  getLatest,
  getById,
  create,
  update,
  getStats,
};
