"use server";

/**
 * Outlook Sync Server Actions
 * Next.js Server Actions for Outlook calendar sync operations.
 */

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { outlookService } from "@/lib/services/outlook.service";
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
 * Trigger manual Outlook sync.
 */
export async function syncOutlookAction(): Promise<
  ActionResult<{ imported: number; updated: number; total: number }>
> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    if (!outlookService.isConfigured()) {
      return {
        success: false,
        error: "Outlook-Integration ist nicht konfiguriert",
      };
    }

    const result = await outlookService.syncFromOutlook();

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");

    return { success: true, data: result.value };
  } catch (error) {
    return {
      success: false,
      error: `Sync fehlgeschlagen: ${String(error)}`,
    };
  }
}

/**
 * Dismiss an appointment (mark as private).
 */
export async function dismissAppointmentAction(
  appointmentId: string
): Promise<ActionResult> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    if (!appointmentId) {
      return { success: false, error: "Ungültige Termin-ID" };
    }

    const result = await outlookService.dismiss(appointmentId);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Ablehnen des Termins: ${String(error)}`,
    };
  }
}

/**
 * Check if sync is needed (called on page load).
 */
export async function checkSyncNeededAction(): Promise<ActionResult<{ needsSync: boolean }>> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const needsSync = await outlookService.isSyncNeeded();
    return { success: true, data: { needsSync } };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Prüfen des Sync-Status: ${String(error)}`,
    };
  }
}

/**
 * Get current sync status.
 */
export async function getSyncStatusAction(): Promise<
  ActionResult<{
    lastSyncAt: string | null;
    lastSyncStatus: string | null;
    lastSyncMessage: string | null;
  }>
> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const result = await outlookService.getSyncStatus();

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    const status = result.value;
    return {
      success: true,
      data: {
        lastSyncAt: status?.lastSyncAt?.toISOString() ?? null,
        lastSyncStatus: status?.lastSyncStatus ?? null,
        lastSyncMessage: status?.lastSyncMessage ?? null,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Laden des Sync-Status: ${String(error)}`,
    };
  }
}

/**
 * Revert a dismissed appointment back to pending status.
 */
export async function revertToPendingAction(
  appointmentId: string
): Promise<ActionResult> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    if (!appointmentId) {
      return { success: false, error: "Ungültige Termin-ID" };
    }

    const result = await outlookService.revertToPending(appointmentId);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");
    revalidatePath("/office");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Wiederherstellen des Termins: ${String(error)}`,
    };
  }
}

/**
 * Cancel an appointment with optional reason.
 */
export async function cancelAppointmentAction(
  appointmentId: string,
  reason?: string
): Promise<ActionResult> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    if (!appointmentId) {
      return { success: false, error: "Ungültige Termin-ID" };
    }

    const result = await outlookService.cancel(appointmentId, reason);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");
    revalidatePath("/office");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Stornieren des Termins: ${String(error)}`,
    };
  }
}

/**
 * Uncancel an appointment (revert cancellation).
 */
export async function uncancelAppointmentAction(
  appointmentId: string
): Promise<ActionResult> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    if (!appointmentId) {
      return { success: false, error: "Ungültige Termin-ID" };
    }

    const result = await outlookService.uncancel(appointmentId);

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");
    revalidatePath("/office");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Wiederherstellen des Termins: ${String(error)}`,
    };
  }
}

/**
 * Delete all appointments from the database.
 * CAUTION: This is irreversible!
 */
export async function deleteAllAppointmentsAction(): Promise<
  ActionResult<{ deletedCount: number }>
> {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const result = await outlookService.deleteAllAppointments();

    if (isErrResult(result)) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/office/euer");
    revalidatePath("/office");

    return { success: true, data: result.value };
  } catch (error) {
    return {
      success: false,
      error: `Fehler beim Löschen der Termine: ${String(error)}`,
    };
  }
}
