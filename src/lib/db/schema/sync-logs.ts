import { pgTable, text, timestamp, uuid, integer, json } from "drizzle-orm/pg-core";

/**
 * Sync logs table for tracking Outlook calendar synchronization history.
 * Each sync operation creates a new log entry.
 */
export const syncLogs = pgTable("sync_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Timing
  syncStartedAt: timestamp("sync_started_at", { withTimezone: true }).notNull(),
  syncEndedAt: timestamp("sync_ended_at", { withTimezone: true }),

  // Status
  status: text("status")
    .$type<"success" | "error" | "cancelled" | "in_progress">()
    .notNull()
    .default("in_progress"),

  // Results
  message: text("message"),
  appointmentsImported: integer("appointments_imported").default(0).notNull(),
  appointmentsFailed: integer("appointments_failed").default(0).notNull(),
  appointmentsSkipped: integer("appointments_skipped").default(0).notNull(),

  // Error details (JSON for structured error info)
  errorDetails: json("error_details").$type<{
    error?: string;
    stack?: string;
    failedAppointments?: Array<{
      id: string;
      subject: string;
      error: string;
    }>;
  }>(),

  // Metadata
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Type definitions for TypeScript
export type SyncLog = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;
