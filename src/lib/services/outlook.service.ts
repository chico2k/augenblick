/**
 * Outlook Calendar Sync Service
 * Handles synchronization of Outlook calendar events.
 */

import { eq, and, desc, inArray, notInArray, gte, asc, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  outlookAppointments,
  syncStatus,
  type OutlookAppointment,
  type SyncStatus,
} from "@/lib/db/schema";
import { fetchCalendarEvents, isGraphConfigured, type GraphCalendarEvent } from "@/lib/graph/client";
import { type Result, Ok, Err, isOkResult } from "./types";

const DEFAULT_SYNC_START_DATE = "2026-05-01";
const SYNC_LOOKAHEAD_YEARS = 3;

function getSyncStartDate(): Date {
  const configuredDate = process.env.OUTLOOK_SYNC_START_DATE ?? DEFAULT_SYNC_START_DATE;
  const dateInput = /^\d{4}-\d{2}-\d{2}$/.test(configuredDate)
    ? `${configuredDate}T00:00:00`
    : configuredDate;
  const startDate = new Date(dateInput);

  if (Number.isNaN(startDate.getTime())) {
    throw new Error(`Ungültiges OUTLOOK_SYNC_START_DATE: ${configuredDate}`);
  }

  return startDate;
}

function getSyncEndDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + SYNC_LOOKAHEAD_YEARS);
  return endDate;
}

/**
 * Sync result with statistics.
 */
export interface SyncResult {
  imported: number;
  updated: number;
  deleted: number;
  removedBeforeStart: number;
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

        if (!updated) {
          return Err({
            code: "DATABASE_ERROR",
            message: "Sync-Status konnte nicht aktualisiert werden",
          });
        }
        return Ok(updated);
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

        if (!created) {
          return Err({
            code: "DATABASE_ERROR",
            message: "Sync-Status konnte nicht erstellt werden",
          });
        }
        return Ok(created);
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
   * Imports events from the configured sync start date onwards.
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

      // Remove previously imported appointments before the active sync window.
      const startDate = getSyncStartDate();
      const endDate = getSyncEndDate(startDate);
      const cleanupResult = await this.deleteAppointmentsBefore(startDate);

      if (!isOkResult(cleanupResult)) {
        throw new Error(cleanupResult.error.message);
      }

      const removedBeforeStart = cleanupResult.value.deletedCount;

      const events = await fetchCalendarEvents(startDate, endDate);

      let imported = 0;
      let updated = 0;

      if (events.length > 0) {
        // Bulk-fetch all existing appointments for these event IDs in one query.
        const eventIds = events.map((e) => e.id);
        const existingRows = await db
          .select()
          .from(outlookAppointments)
          .where(inArray(outlookAppointments.outlookEventId, eventIds));

        const existingMap = new Map(
          existingRows.map((row) => [row.outlookEventId, row])
        );

        const now = new Date();
        const toInsert: Array<typeof outlookAppointments.$inferInsert> = [];
        const toUpdate: Array<{
          id: string;
          values: Partial<typeof outlookAppointments.$inferInsert>;
        }> = [];

        for (const event of events) {
          const existing = existingMap.get(event.id);

          if (!existing) {
            toInsert.push({
              outlookEventId: event.id,
              outlookChangeKey: event.changeKey ?? null,
              subject: event.subject,
              startTime: new Date(event.start.dateTime),
              endTime: new Date(event.end.dateTime),
              location: event.location?.displayName ?? null,
              bodyPreview: event.bodyPreview ?? null,
              status: "pending",
            });
            continue;
          }

          // Only update pending appointments whose changeKey differs;
          // confirmed/dismissed entries are kept as-is.
          if (
            existing.status === "pending" &&
            existing.outlookChangeKey !== (event.changeKey ?? null)
          ) {
            toUpdate.push({
              id: existing.id,
              values: {
                outlookChangeKey: event.changeKey ?? null,
                subject: event.subject,
                startTime: new Date(event.start.dateTime),
                endTime: new Date(event.end.dateTime),
                location: event.location?.displayName ?? null,
                bodyPreview: event.bodyPreview ?? null,
                lastSyncAt: now,
              },
            });
          }
        }

        // Bulk insert new appointments in one round-trip.
        if (toInsert.length > 0) {
          await db.insert(outlookAppointments).values(toInsert);
          imported = toInsert.length;
        }

        // Parallelize updates in chunks to avoid pool/socket pressure.
        const UPDATE_CONCURRENCY = 20;
        for (let i = 0; i < toUpdate.length; i += UPDATE_CONCURRENCY) {
          const chunk = toUpdate.slice(i, i + UPDATE_CONCURRENCY);
          await Promise.all(
            chunk.map((u) =>
              db
                .update(outlookAppointments)
                .set(u.values)
                .where(eq(outlookAppointments.id, u.id))
            )
          );
        }

        // Original behaviour: count everything that wasn't a fresh insert as "updated"
        // (includes no-op skips for confirmed/dismissed and unchanged entries).
        updated = events.length - imported;
      }

      // Mark pending appointments as dismissed if deleted from Outlook
      const outlookEventIds = events.map((e) => e.id);
      let deleted = 0;

      // Find pending appointments inside the sync window that are no longer in Outlook.
      const deletedResult = outlookEventIds.length > 0
        ? await db
            .update(outlookAppointments)
            .set({ status: "dismissed" })
            .where(
              and(
                eq(outlookAppointments.status, "pending"),
                gte(outlookAppointments.startTime, startDate),
                lt(outlookAppointments.startTime, endDate),
                notInArray(outlookAppointments.outlookEventId, outlookEventIds)
              )
            )
            .returning({ id: outlookAppointments.id })
        : await db
            .update(outlookAppointments)
            .set({ status: "dismissed" })
            .where(
              and(
                eq(outlookAppointments.status, "pending"),
                gte(outlookAppointments.startTime, startDate),
                lt(outlookAppointments.startTime, endDate)
              )
            )
            .returning({ id: outlookAppointments.id });

      deleted = deletedResult.length;

      // Update sync status
      const statusParts = [];
      if (removedBeforeStart > 0) statusParts.push(`${removedBeforeStart} vor Stichtag entfernt`);
      if (imported > 0) statusParts.push(`${imported} neue`);
      if (updated > 0) statusParts.push(`${updated} aktualisiert`);
      if (deleted > 0) statusParts.push(`${deleted} gelöscht`);
      const statusMessage = statusParts.length > 0 ? statusParts.join(", ") : "Keine Änderungen";

      await this.updateSyncStatus("success", statusMessage, imported);

      return Ok({
        imported,
        updated,
        deleted,
        removedBeforeStart,
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

  /**
   * Delete imported appointments before the active sync start date.
   */
  async deleteAppointmentsBefore(startDate: Date): Promise<Result<{ deletedCount: number }>> {
    try {
      const deleted = await db
        .delete(outlookAppointments)
        .where(lt(outlookAppointments.startTime, startDate))
        .returning({ id: outlookAppointments.id });

      return Ok({ deletedCount: deleted.length });
    } catch (error) {
      return Err({
        code: "DATABASE_ERROR",
        message: `Fehler beim Löschen alter Termine: ${String(error)}`,
      });
    }
  },
};

export type OutlookService = typeof outlookService;
