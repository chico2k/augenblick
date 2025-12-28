/**
 * Database public API.
 * Re-exports client, table definitions, and types for clean imports.
 * Following SOLID principles - Interface Segregation: export only what's needed.
 *
 * Usage:
 *   import { db } from '@/lib/db';
 *   import { exampleTable, type InsertExample } from '@/lib/db';
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export type Database = typeof db;

// Export all schemas and schema types
export * from "./schema";

// Export database types and interfaces
export * from "./types";