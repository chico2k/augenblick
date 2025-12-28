import { pgTable, text, timestamp, uuid, boolean, varchar } from "drizzle-orm/pg-core";

/**
 * GDPR versions table for storing privacy policy versions.
 * Supports markdown content and active version flagging for signature collection.
 */
export const gdprVersions = pgTable("gdpr_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  version: varchar("version", { length: 20 }).notNull(), // e.g., "1.0", "2.0"
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Type definitions for TypeScript
export type GdprVersion = typeof gdprVersions.$inferSelect;
export type NewGdprVersion = typeof gdprVersions.$inferInsert;
