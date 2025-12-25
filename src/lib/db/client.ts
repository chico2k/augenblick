/**
 * Database client using Drizzle ORM with HTTP adapter for serverless.
 * Following SOLID principles - Single Responsibility: only handles connection.
 * Provider-agnostic naming to support Dependency Inversion Principle.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/env.mjs";

/**
 * Create the HTTP SQL client for serverless environments.
 * Uses stateless HTTP connections - no persistent WebSocket overhead.
 */
const sql = neon(env.DATABASE_URL);

/**
 * Drizzle ORM database client instance.
 * Configured for serverless with HTTP adapter for minimal cold start impact.
 */
const db = drizzle(sql);

export default db;
