/**
 * Outlook Calendar Sync Service
 * Handles synchronization of Outlook calendar events.
 */

import { eq, and, desc, notInArray, gte, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  outlookAppointments,
  syncStatus,
  type OutlookAppointment,
  type SyncStatus,
} from "@/lib/db/schema";
import { fetchCalendarEvents, isGraphConfigured, type GraphCalendarEvent } from "@/lib/graph/client";
import { type Result, Ok, Err, isOkResult } from "./types";


/**
 * Sync result with statistics.
 */
export interface SyncResult {
  imported: number;
  updated: number;
  deleted: number;
  total: number;
}

/**
 * Filter for listing appointments.
 */
export interface AppointmentFilter {
  status?: "pending" | "confirmed" | "dismissed";
  startDate?: Date;
  endDate?: Date;
}

/**
 * Outlook Sync Service.
 */
export const outlookService = {
  /**
   * Check if Outlook integration is configured.
   */
  isConfigured(): boolean {
    return isGraphConfigured();
  },

  /**
   * Get the current sync status.
   */
  async getSyncStatus(): Promise<Result<SyncStatus | null>> {
    try {
      const [status] = await db
        .select()
        .from(syncStatus)
        .limit(1);

      return Ok(status ?? null);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden des Sync-Status: ${String(error)}`,
      });
    }
  },

  /**
   * Update sync status.
   */
  async updateSyncStatus(
    status: "success" | "error" | "in_progress",
    message?: string,
    appointmentsImported?: number
  ): Promise<Result<SyncStatus>> {
    try {
      // Check if status record exists
      const [existing] = await db.select().from(syncStatus).limit(1);

      if (existing) {
        const [updated] = await db
          .update(syncStatus)
          .set({
            lastSyncAt: status !== "in_progress" ? new Date() : existing.lastSyncAt,
            lastSyncStatus: status,
            lastSyncMessage: message ?? null,
            appointmentsImported: appointmentsImported ?? existing.appointmentsImported,
          })
          .where(eq(syncStatus.id, existing.id))
          .returning();

        return Ok(updated!);
      } else {
        const [created] = await db
          .insert(syncStatus)
          .values({
            lastSyncAt: status !== "in_progress" ? new Date() : null,
            lastSyncStatus: status,
            lastSyncMessage: message ?? null,
            appointmentsImported: appointmentsImported ?? 0,
          })
          .returning();

        return Ok(created!);
      }
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Aktualisieren des Sync-Status: ${String(error)}`,
      });
    }
  },

  /**
   * Sync calendar events from Outlook.
   * Imports events from 2026-01-01 onwards (Go-Live date).
   */
  async syncFromOutlook(): Promise<Result<SyncResult>> {
    if (!isGraphConfigured()) {
      return Err({
        code: "VALIDATION_ERROR",
        message: "Outlook-Integration ist nicht konfiguriert",
      });
    }

    try {
      // Mark sync as in progress
      await this.updateSyncStatus("in_progress", "Synchronisierung läuft...");

      // Fetch events from 2026-01-01 onwards (Go-Live date) + 3 years ahead
      const startDate = new Date("2026-01-01T00:00:00");
      const endDate = new Date("2026-01-01T00:00:00");
      endDate.setFullYear(endDate.getFullYear() + 3);

      const events = await fetchCalendarEvents(startDate, endDate);

      let imported = 0;
      let updated = 0;

      // Upsert all events from Outlook
      for (const event of events) {
        const result = await this.upsertAppointment(event);
        if (isOkResult(result)) {
          if (result.value.isNew) {
            imported++;
          } else {
            updated++;
          }
        }
      }

      // Mark pending appointments as dismissed if deleted from Outlook
      const outlookEventIds = events.map((e) => e.id);
      let deleted = 0;

      if (outlookEventIds.length > 0) {
        // Find pending appointments not in current Outlook events
        const deletedResult = await db
          .update(outlookAppointments)
          .set({ status: "dismissed" })
          .where(
            and(
              eq(outlookAppointments.status, "pending"),
              notInArray(outlookAppointments.outlookEventId, outlookEventIds)
            )
          )
          .returning({ id: outlookAppointments.id });

        deleted = deletedResult.length;
      }

      // Update sync status
      const statusParts = [];
      if (imported > 0) statusParts.push(`${imported} neue`);
      if (updated > 0) statusParts.push(`${updated} aktualisiert`);
      if (deleted > 0) statusParts.push(`${deleted} gelöscht`);
      const statusMessage = statusParts.length > 0 ? statusParts.join(", ") : "Keine Änderungen";

      await this.updateSyncStatus("success", statusMessage, imported);

      return Ok({
        imported,
        updated,
        deleted,
        total: events.length,
      });
    } catch (error) {
      await this.updateSyncStatus("error", String(error));
      return Err({
        code: "INTERNAL_ERROR",
        message: `Sync fehlgeschlagen: ${String(error)}`,
      });
    }
  },

  /**
   * Upsert a calendar event from Graph API.
   */
  async upsertAppointment(
    event: GraphCalendarEvent
  ): Promise<Result<{ appointment: OutlookAppointment; isNew: boolean }>> {
    try {
      // Check if appointment exists
      const [existing] = await db
        .select()
        .from(outlookAppointments)
        .where(eq(outlookAppointments.outlookEventId, event.id))
        .limit(1);

      if (existing) {
        // Don't update confirmed or dismissed appointments
        // Only update pending appointments if they changed in Outlook
        if (existing.status !== "pending") {
          // Already processed by user - don't overwrite
          return Ok({ appointment: existing, isNew: false });
        }

        // Update pending appointment if changeKey differs (event was modified in Outlook)
        if (existing.outlookChangeKey !== event.changeKey) {
          const [updated] = await db
            .update(outlookAppointments)
            .set({
              outlookChangeKey: event.changeKey ?? null,
              subject: event.subject,
              startTime: new Date(event.start.dateTime),
              endTime: new Date(event.end.dateTime),
              location: event.location?.displayName ?? null,
              bodyPreview: event.bodyPreview ?? null,
              lastSyncAt: new Date(),
            })
            .where(eq(outlookAppointments.id, existing.id))
            .returning();

          if (!updated) {
            return Err({
              code: "DATABASE_ERROR",
              message: "Termin konnte nicht aktualisiert werden",
            });
          }

          return Ok({ appointment: updated, isNew: false });
        }

        // No changes needed
        return Ok({ appointment: existing, isNew: false });
      }

      // Create new appointment
      const [created] = await db
        .insert(outlookAppointments)
        .values({
          outlookEventId: event.id,
          outlookChangeKey: event.changeKey ?? null,
          subject: event.subject,
          startTime: new Date(event.start.dateTime),
          endTime: new Date(event.end.dateTime),
          location: event.location?.displayName ?? null,
          bodyPreview: event.bodyPreview ?? null,
          status: "pending",
        })
        .returning();

      if (!created) {
        return Err({
          code: "DATABASE_ERROR",
          message: "Termin konnte nicht erstellt werden",
        });
      }

      return Ok({ appointment: created, isNew: true });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Speichern des Termins: ${String(error)}`,
      });
    }
  },

  /**
   * Get pending appointments (not yet confirmed or dismissed).
   * Sorted from nearest to furthest.
   */
  async getPending(): Promise<Result<OutlookAppointment[]>> {
    try {
      const appointments = await db
        .select()
        .from(outlookAppointments)
        .where(eq(outlookAppointments.status, "pending"))
        .orderBy(asc(outlookAppointments.startTime));

      return Ok(appointments);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Termine: ${String(error)}`,
      });
    }
  },

  /**
   * Get all appointments with optional filtering.
   */
  async getAll(filter?: AppointmentFilter): Promise<Result<OutlookAppointment[]>> {
    try {
      const appointments = filter?.status
        ? await db
            .select()
            .from(outlookAppointments)
            .where(eq(outlookAppointments.status, filter.status))
            .orderBy(desc(outlookAppointments.startTime))
        : await db
            .select()
            .from(outlookAppointments)
            .orderBy(desc(outlookAppointments.startTime));

      return Ok(appointments);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der Termine: ${String(error)}`,
      });
    }
  },

  /**
   * Get upcoming appointments (next N confirmed or pending appointments in the future).
   */
  async getUpcoming(limit = 5): Promise<Result<OutlookAppointment[]>> {
    try {
      const now = new Date();
      const appointments = await db
        .select()
        .from(outlookAppointments)
        .where(
          and(
            notInArray(outlookAppointments.status, ["dismissed"]),
            gte(outlookAppointments.startTime, now)
          )
        )
        .orderBy(asc(outlookAppointments.startTime))
        .limit(limit);

      return Ok(appointments);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden der kommenden Termine: ${String(error)}`,
      });
    }
  },

  /**
   * Get appointment by ID.
   */
  async getById(id: string): Promise<Result<OutlookAppointment>> {
    try {
      const [appointment] = await db
        .select()
        .from(outlookAppointments)
        .where(eq(outlookAppointments.id, id))
        .limit(1);

      if (!appointment) {
        return Err({
          code: "NOT_FOUND",
          message: "Termin nicht gefunden",
        });
      }

      return Ok(appointment);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Laden des Termins: ${String(error)}`,
      });
    }
  },

  /**
   * Confirm an appointment (mark as business appointment).
   */
  async confirm(id: string): Promise<Result<OutlookAppointment>> {
    try {
      const [appointment] = await db
        .update(outlookAppointments)
        .set({
          status: "confirmed",
          confirmedAt: new Date(),
        })
        .where(eq(outlookAppointments.id, id))
        .returning();

      if (!appointment) {
        return Err({
          code: "NOT_FOUND",
          message: "Termin nicht gefunden",
        });
      }

      return Ok(appointment);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Bestätigen des Termins: ${String(error)}`,
      });
    }
  },

  /**
   * Revert an appointment to pending status.
   * Used when income creation fails after confirm.
   */
  async revertToPending(id: string): Promise<Result<OutlookAppointment>> {
    try {
      const [appointment] = await db
        .update(outlookAppointments)
        .set({
          status: "pending",
          confirmedAt: null,
        })
        .where(eq(outlookAppointments.id, id))
        .returning();

      if (!appointment) {
        return Err({
          code: "NOT_FOUND",
          message: "Termin nicht gefunden",
        });
      }

      return Ok(appointment);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Zurücksetzen des Termins: ${String(error)}`,
      });
    }
  },

  /**
   * Dismiss an appointment (mark as private, never show again).
   */
  async dismiss(id: string): Promise<Result<OutlookAppointment>> {
    try {
      const [appointment] = await db
        .update(outlookAppointments)
        .set({
          status: "dismissed",
        })
        .where(eq(outlookAppointments.id, id))
        .returning();

      if (!appointment) {
        return Err({
          code: "NOT_FOUND",
          message: "Termin nicht gefunden",
        });
      }

      return Ok(appointment);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Ablehnen des Termins: ${String(error)}`,
      });
    }
  },

  /**
   * Cancel an appointment with a reason.
   * This marks the appointment as cancelled but keeps it visible.
   */
  async cancel(id: string, reason?: string): Promise<Result<OutlookAppointment>> {
    try {
      const [appointment] = await db
        .update(outlookAppointments)
        .set({
          cancelled: true,
          cancelledReason: reason || null,
          cancelledAt: new Date(),
        })
        .where(eq(outlookAppointments.id, id))
        .returning();

      if (!appointment) {
        return Err({
          code: "NOT_FOUND",
          message: "Termin nicht gefunden",
        });
      }

      return Ok(appointment);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Stornieren des Termins: ${String(error)}`,
      });
    }
  },

  /**
   * Uncancel an appointment (revert cancellation).
   */
  async uncancel(id: string): Promise<Result<OutlookAppointment>> {
    try {
      const [appointment] = await db
        .update(outlookAppointments)
        .set({
          cancelled: false,
          cancelledReason: null,
          cancelledAt: null,
        })
        .where(eq(outlookAppointments.id, id))
        .returning();

      if (!appointment) {
        return Err({
          code: "NOT_FOUND",
          message: "Termin nicht gefunden",
        });
      }

      return Ok(appointment);
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Wiederherstellen des Termins: ${String(error)}`,
      });
    }
  },

  /**
   * Check if sync is needed (last sync > 1 hour ago).
   */
  async isSyncNeeded(): Promise<boolean> {
    const statusResult = await this.getSyncStatus();
    if (statusResult.isErr() || !statusResult.value) {
      return true;
    }

    const lastSync = statusResult.value.lastSyncAt;
    if (!lastSync) {
      return true;
    }

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    return lastSync < oneHourAgo;
  },

  /**
   * Delete all appointments from the database.
   * Use with caution - this is irreversible!
   */
  async deleteAllAppointments(): Promise<Result<{ deletedCount: number }>> {
    try {
      const deleted = await db.delete(outlookAppointments).returning();
      return Ok({ deletedCount: deleted.length });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Löschen der Termine: ${String(error)}`,
      });
    }
  },
};

export type OutlookService = typeof outlookService;
