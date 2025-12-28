/**
 * Database client configuration using Drizzle ORM with Neon serverless.
 * Provides a singleton database connection for use across the application.
 * Following SOLID principles - Single Responsibility: only handles connection.
 * Provider-agnostic naming to support Dependency Inversion Principle.
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
// Drizzle ORM types are correctly inferred when dependencies are installed

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Create the HTTP SQL client for serverless environments.
 * Uses stateless HTTP connections - no persistent WebSocket overhead.
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Drizzle ORM database client instance.
 * Configured for serverless with HTTP adapter for minimal cold start impact.
 */
export const db = drizzle(sql, { schema });

// Export schema for convenience
export { schema };

// Export types
export type Database = typeof db;