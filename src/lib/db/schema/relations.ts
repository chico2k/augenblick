/**
 * Drizzle ORM relations for the cosmetics studio database.
 * Defines all relationships between tables for type-safe querying with joins.
 * Following SOLID principles - Single Responsibility: only defines table relationships.
 */

import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { customers } from "./customers";
import { gdprVersions } from "./gdpr-versions";
import { signatures } from "./signatures";
import { customerAudit } from "./customer-audit";
import { treatmentTypes } from "./treatment-types";
import { outlookAppointments } from "./outlook-appointments";
import { incomeEntries } from "./income-entries";

// ============================================================================
// Auth Schema Relations
// ============================================================================

/**
 * User relations.
 * A user has many sessions, accounts, and customer audit entries.
 */
export const userRelations = relations(user, ({ many }) => ({
  /** Active sessions for this user */
  sessions: many(session),
  /** Authentication provider accounts linked to this user */
  accounts: many(account),
  /** Audit entries for customer changes made by this user */
  customerAuditEntries: many(customerAudit),
}));

/**
 * Session relations.
 * A session belongs to one user.
 */
export const sessionRelations = relations(session, ({ one }) => ({
  /** The user who owns this session */
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

/**
 * Account relations.
 * An account belongs to one user.
 */
export const accountRelations = relations(account, ({ one }) => ({
  /** The user who owns this account */
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ============================================================================
// Customer Schema Relations
// ============================================================================

/**
 * Customer relations.
 * A customer has many signatures, audit entries, and income entries.
 */
export const customersRelations = relations(customers, ({ many }) => ({
  /** Digital signatures linking this customer to GDPR versions */
  signatures: many(signatures),
  /** Audit trail entries for this customer's data changes */
  auditEntries: many(customerAudit),
  /** Income entries linked to this customer */
  incomeEntries: many(incomeEntries),
}));

// ============================================================================
// GDPR Versions Schema Relations
// ============================================================================

/**
 * GDPR Version relations.
 * A GDPR version has many signatures.
 */
export const gdprVersionsRelations = relations(gdprVersions, ({ many }) => ({
  /** All signatures for this GDPR version */
  signatures: many(signatures),
}));

// ============================================================================
// Signatures Schema Relations
// ============================================================================

/**
 * Signature relations.
 * A signature belongs to one customer and one GDPR version.
 */
export const signaturesRelations = relations(signatures, ({ one }) => ({
  /** The customer who signed */
  customer: one(customers, {
    fields: [signatures.customerId],
    references: [customers.id],
  }),
  /** The GDPR version that was signed */
  gdprVersion: one(gdprVersions, {
    fields: [signatures.gdprVersionId],
    references: [gdprVersions.id],
  }),
}));

// ============================================================================
// Customer Audit Schema Relations
// ============================================================================

/**
 * Customer Audit relations.
 * An audit entry belongs to one customer and optionally one user.
 */
export const customerAuditRelations = relations(customerAudit, ({ one }) => ({
  /** The customer whose data was modified */
  customer: one(customers, {
    fields: [customerAudit.customerId],
    references: [customers.id],
  }),
  /** The user who made the change (may be null if user was deleted) */
  user: one(user, {
    fields: [customerAudit.actorId],
    references: [user.id],
  }),
}));

// ============================================================================
// EÜR Module Relations
// ============================================================================

/**
 * Treatment Type relations.
 * A treatment type has many income entries.
 */
export const treatmentTypesRelations = relations(treatmentTypes, ({ many }) => ({
  /** Income entries using this treatment type */
  incomeEntries: many(incomeEntries),
}));

/**
 * Outlook Appointment relations.
 * An appointment has one income entry (when confirmed).
 */
export const outlookAppointmentsRelations = relations(outlookAppointments, ({ one }) => ({
  /** The income entry created when this appointment was confirmed */
  incomeEntry: one(incomeEntries, {
    fields: [outlookAppointments.id],
    references: [incomeEntries.appointmentId],
  }),
}));

/**
 * Income Entry relations.
 * An income entry optionally belongs to a customer, treatment type, and appointment.
 */
export const incomeEntriesRelations = relations(incomeEntries, ({ one }) => ({
  /** The customer for this income (optional) */
  customer: one(customers, {
    fields: [incomeEntries.customerId],
    references: [customers.id],
  }),
  /** The treatment type for this income (optional) */
  treatmentType: one(treatmentTypes, {
    fields: [incomeEntries.treatmentTypeId],
    references: [treatmentTypes.id],
  }),
  /** The Outlook appointment this income was confirmed from (optional) */
  appointment: one(outlookAppointments, {
    fields: [incomeEntries.appointmentId],
    references: [outlookAppointments.id],
  }),
}));
