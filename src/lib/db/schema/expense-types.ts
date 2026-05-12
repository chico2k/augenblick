import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Expense types table for grouping Ausgaben.
 */
export const expenseTypes = pgTable("expense_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ExpenseType = typeof expenseTypes.$inferSelect;
export type NewExpenseType = typeof expenseTypes.$inferInsert;
