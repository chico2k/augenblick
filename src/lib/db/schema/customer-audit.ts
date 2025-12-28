import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { customers } from "./customers";

/**
 * Customer audit log table for tracking customer change history.
 * Records create, update, and delete actions with timestamps and actor information.
 */
export const customerAudit = pgTable("customer_audit", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 50 }).notNull(), // 'create', 'update', 'delete'
  changes: text("changes"), // JSON string of field changes for updates
  actorId: uuid("actor_id"), // User who made the change (nullable for system actions)
  actorName: varchar("actor_name", { length: 255 }), // Denormalized actor name for display
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Type definitions for TypeScript
export type CustomerAudit = typeof customerAudit.$inferSelect;
export type NewCustomerAudit = typeof customerAudit.$inferInsert;

// Note: Relations are defined in ./relations.ts for centralized management
