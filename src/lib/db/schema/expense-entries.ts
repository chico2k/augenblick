import { decimal, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { expenseTypes } from "./expense-types";

/**
 * Expense entries table for simple Ausgaben tracking.
 * Currency is stored for future use but not exposed in the UI yet.
 */
export const expenseEntries = pgTable("expense_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  expenseDate: timestamp("expense_date", { withTimezone: true }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
  expenseTypeId: uuid("expense_type_id").references(() => expenseTypes.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ExpenseEntry = typeof expenseEntries.$inferSelect;
export type NewExpenseEntry = typeof expenseEntries.$inferInsert;
