import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { gdprVersions } from "./gdpr-versions";

/**
 * Signatures table for storing customer GDPR consent signatures.
 * Links customers to the GDPR version they signed and stores the signature image.
 *
 * Stores three separate consents as per GDPR requirements:
 * - dataProcessingConsent: Required for service provision
 * - healthDataConsent: Required for safe treatment (Art. 9 GDPR)
 * - photoConsent: Optional, for marketing purposes
 */
export const signatures = pgTable("signatures", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  gdprVersionId: uuid("gdpr_version_id")
    .notNull()
    .references(() => gdprVersions.id, { onDelete: "restrict" }),
  signatureData: text("signature_data").notNull(), // Base64 PNG image

  // Three separate consents
  dataProcessingConsent: boolean("data_processing_consent").notNull(), // Einwilligung Datenverarbeitung
  healthDataConsent: boolean("health_data_consent").notNull(), // Einwilligung Gesundheitsdaten
  photoConsent: boolean("photo_consent"), // Einwilligung Fotonutzung (optional/nullable)

  signedAt: timestamp("signed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Type definitions for TypeScript
export type Signature = typeof signatures.$inferSelect;
export type NewSignature = typeof signatures.$inferInsert;
