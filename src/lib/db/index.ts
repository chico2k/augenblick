/**
 * Database public API.
 * Re-exports client, table definitions, and types for clean imports.
 * Following SOLID principles - Interface Segregation: export only what's needed.
 *
 * Usage:
 *   import { db } from '@/lib/db';
 *   import { exampleTable, type InsertExample } from '@/lib/db';
 */

// Export database client
export { default as db } from "./client";

// Export all schemas and schema types
export * from "./schema";

// Export database types and interfaces
export * from "./types";
