import { pgTable, text, timestamp, decimal, boolean, uuid } from "drizzle-orm/pg-core";

/**
 * Treatment types table for storing available treatments with default prices.
 * Used for quick selection during income confirmation.
 */
export const treatmentTypes = pgTable("treatment_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  defaultPrice: decimal("default_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: decimal("sort_order", { precision: 10, scale: 0 }).default("0").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Type definitions for TypeScript
export type TreatmentType = typeof treatmentTypes.$inferSelect;
export type NewTreatmentType = typeof treatmentTypes.$inferInsert;
