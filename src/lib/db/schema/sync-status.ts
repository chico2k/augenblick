import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

/**
 * Sync status table for tracking Outlook calendar synchronization.
 * Single row table - only one sync status record exists.
 */
export const syncStatus = pgTable("sync_status", {
  id: uuid("id").defaultRandom().primaryKey(),
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
  lastSyncStatus: text("last_sync_status").$type<"success" | "error" | "in_progress">().default("success"),
  lastSyncMessage: text("last_sync_message"),
  appointmentsImported: integer("appointments_imported").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Type definitions for TypeScript
export type SyncStatus = typeof syncStatus.$inferSelect;
export type NewSyncStatus = typeof syncStatus.$inferInsert;
