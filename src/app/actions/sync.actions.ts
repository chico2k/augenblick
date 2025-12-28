"use server";

/**
 * Sync Actions
 * Server actions for sync log management and manual sync triggering.
 */

import { syncLogService } from "@/lib/services/sync-log.service";
import { outlookService } from "@/lib/services/outlook.service";
import { isOkResult } from "@/lib/services/types";
import type { SyncLog } from "@/lib/db/schema";

/**
 * Result type for actions.
 */
type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Get sync logs with pagination.
 */
export async function getSyncLogsAction(params: {
  page?: number;
  limit?: number;
}): Promise<
  ActionResult<{
    items: SyncLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> {
  const result = await syncLogService.list(params);

  if (isOkResult(result)) {
    return { success: true, data: result.value as {
      items: SyncLog[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    } };
  }

  return { success: false, error: result.error.message };
}

/**
 * Get the latest sync log.
 */
export async function getLatestSyncLogAction(): Promise<
  ActionResult<SyncLog | null>
> {
  const result = await syncLogService.getLatest();

  if (isOkResult(result)) {
    return { success: true, data: result.value };
  }

  return { success: false, error: result.error.message };
}

/**
 * Get sync statistics.
 */
export async function getSyncStatsAction(): Promise<
  ActionResult<{
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    totalAppointmentsImported: number;
    lastSyncAt: Date | null;
  }>
> {
  const result = await syncLogService.getStats();

  if (isOkResult(result)) {
    return { success: true, data: result.value as {
      totalSyncs: number;
      successfulSyncs: number;
      failedSyncs: number;
      totalAppointmentsImported: number;
      lastSyncAt: Date | null;
    } };
  }

  return { success: false, error: result.error.message };
}

/**
 * Trigger a manual Outlook sync.
 * This will:
 * 1. Create a new sync log entry
 * 2. Run the Outlook sync
 * 3. Update the sync log with results
 */
export async function triggerSyncAction(): Promise<ActionResult<{ logId: string }>> {
  // Create sync log entry
  const logResult = await syncLogService.create({
    syncStartedAt: new Date(),
    status: "in_progress",
    message: "Manueller Sync gestartet",
  });

  if (!isOkResult(logResult)) {
    return { success: false, error: "Fehler beim Erstellen des Sync-Logs" };
  }

  const log = logResult.value;

  try {
    // Run the sync
    const syncResult = await outlookService.syncFromOutlook();

    if (isOkResult(syncResult)) {
      const result = syncResult.value as { imported: number; updated: number; deleted: number; total: number; };
      // Update log with success
      await syncLogService.update(log.id, {
        syncEndedAt: new Date(),
        status: "success",
        message: `${result.imported} neu, ${result.updated} aktualisiert, ${result.deleted} gelöscht`,
        appointmentsImported: result.imported,
        appointmentsSkipped: 0,
        appointmentsFailed: 0,
      });

      return { success: true, data: { logId: log.id } };
    } else {
      // Update log with error
      await syncLogService.update(log.id, {
        syncEndedAt: new Date(),
        status: "error",
        message: syncResult.error.message,
        errorDetails: {
          error: syncResult.error.message,
          stack: syncResult.error.details?.toString(),
        },
      });

      return { success: false, error: syncResult.error.message };
    }
  } catch (error) {
    // Update log with error
    await syncLogService.update(log.id, {
      syncEndedAt: new Date(),
      status: "error",
      message: "Unerwarteter Fehler beim Sync",
      errorDetails: {
        error: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unbekannter Fehler",
    };
  }
}
