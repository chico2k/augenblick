import { pgTable, text, timestamp, uuid, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { treatmentTypes } from "./treatment-types";
import { outlookAppointments } from "./outlook-appointments";

/**
 * Payment method enum for income entries.
 */
export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",     // Bar
  "card",     // EC-Karte
]);

/**
 * Income entries table for tracking revenue.
 * Links to appointments, customers, and treatment types.
 */
export const incomeEntries = pgTable("income_entries", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Amount and payment
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").default("cash").notNull(),

  // Date of income (may differ from appointment date)
  incomeDate: timestamp("income_date", { withTimezone: true }).notNull(),

  // Optional relationships
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  treatmentTypeId: uuid("treatment_type_id").references(() => treatmentTypes.id, { onDelete: "set null" }),
  appointmentId: uuid("appointment_id").references(() => outlookAppointments.id, { onDelete: "set null" }),

  // Additional info
  notes: text("notes"),

  // Soft delete for EÜR compliance
  deletedAt: timestamp("deleted_at", { withTimezone: true }),

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
export type IncomeEntry = typeof incomeEntries.$inferSelect;
export type NewIncomeEntry = typeof incomeEntries.$inferInsert;
export type PaymentMethod = "cash" | "card";
