import { pgTable, text, timestamp, uuid, boolean, pgEnum } from "drizzle-orm/pg-core";

/**
 * Appointment status enum for tracking confirmation state.
 */
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",    // Neu importiert, noch nicht bestätigt
  "confirmed",  // Als Geschäftstermin bestätigt
  "dismissed",  // Als privat markiert (nicht mehr anzeigen)
]);

/**
 * Outlook appointments table for storing imported calendar events.
 * Serves as cache for Outlook events and tracks confirmation status.
 */
export const outlookAppointments = pgTable("outlook_appointments", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Outlook event identifiers
  outlookEventId: text("outlook_event_id").notNull().unique(),
  outlookChangeKey: text("outlook_change_key"),

  // Event details from Outlook
  subject: text("subject").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  location: text("location"),
  bodyPreview: text("body_preview"),

  // Confirmation status
  status: appointmentStatusEnum("status").default("pending").notNull(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),

  // Cancellation tracking
  cancelled: boolean("cancelled").default(false).notNull(),
  cancelledReason: text("cancelled_reason"),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

  // Sync metadata
  importedAt: timestamp("imported_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  // Standard timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Type definitions for TypeScript
export type OutlookAppointment = typeof outlookAppointments.$inferSelect;
export type NewOutlookAppointment = typeof outlookAppointments.$inferInsert;
export type AppointmentStatus = "pending" | "confirmed" | "dismissed";
