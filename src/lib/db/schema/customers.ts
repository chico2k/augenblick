import { pgTable, text, timestamp, uuid, varchar, boolean, pgEnum } from "drizzle-orm/pg-core";

/**
 * Customer status enum: active or inactive
 */
export const customerStatusEnum = pgEnum("customer_status", ["active", "inactive"]);

/**
 * Customers table for storing studio customer information.
 * Used for GDPR signature management and customer tracking.
 */
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  notes: text("notes"),
  isRegularCustomer: boolean("is_regular_customer").default(false).notNull(),
  status: customerStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Type definitions for TypeScript
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
