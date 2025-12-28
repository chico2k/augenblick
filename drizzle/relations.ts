import { relations } from "drizzle-orm/relations";
import { customers, customerAudit, user, account, session, signatures, gdprVersions } from "./schema";

export const customerAuditRelations = relations(customerAudit, ({one}) => ({
	customer: one(customers, {
		fields: [customerAudit.customerId],
		references: [customers.id]
	}),
}));

export const customersRelations = relations(customers, ({many}) => ({
	customerAudits: many(customerAudit),
	signatures: many(signatures),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const signaturesRelations = relations(signatures, ({one}) => ({
	customer: one(customers, {
		fields: [signatures.customerId],
		references: [customers.id]
	}),
	gdprVersion: one(gdprVersions, {
		fields: [signatures.gdprVersionId],
		references: [gdprVersions.id]
	}),
}));

export const gdprVersionsRelations = relations(gdprVersions, ({many}) => ({
	signatures: many(signatures),
}));