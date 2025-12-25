/**
 * Example table schema demonstrating Drizzle ORM patterns.
 * This file can be used as a template for creating new schemas.
 * Following SOLID principles - Single Responsibility: only defines table structure.
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
// Drizzle ORM types are correctly inferred when dependencies are installed

import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Example table for verifying database setup.
 * Contains basic fields to demonstrate schema patterns.
 */
export const example = pgTable("example", {
  /** Auto-incrementing primary key */
  id: serial("id").primaryKey(),
  /** Name field - required text */
  name: text("name").notNull(),
  /** Creation timestamp - defaults to current time */
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

/** Type for selecting rows from the example table */
export type Example = typeof example.$inferSelect;

/** Type for inserting rows into the example table */
export type NewExample = typeof example.$inferInsert;
