/**
 * Database public API.
 * Re-exports client, table definitions, and types for clean imports.
 * Following SOLID principles - Interface Segregation: export only what's needed.
 *
 * Usage:
 *   import { db } from '@/lib/db';
 *   import { exampleTable, type InsertExample } from '@/lib/db';
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
// Drizzle ORM types are correctly inferred when dependencies are installed

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Create the HTTP SQL client for Neon serverless environments.
 * Uses stateless HTTP connections - no persistent WebSocket overhead.
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Drizzle ORM database client instance.
 * Configured for serverless with HTTP adapter for minimal cold start impact.
 */
export const db = drizzle(sql, { schema });

export type Database = typeof db;

// Export all schemas and schema types
export * from "./schema";

// Export database types and interfaces
export * from "./types";