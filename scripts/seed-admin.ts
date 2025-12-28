/**
 * Admin user seed script for Better Auth.
 * Creates the initial admin user with hashed password.
 * Run once during initial setup or when resetting the admin user.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secure-password ADMIN_NAME=Admin npx tsx scripts/seed-admin.ts
 *
 * Required environment variables:
 *   - DATABASE_URL: Neon Postgres connection string
 *   - ADMIN_EMAIL: Admin user email address
 *   - ADMIN_PASSWORD: Admin user password (will be hashed)
 *   - ADMIN_NAME: Admin user display name
 */
import "dotenv/config";

import { neon as createSqlClient } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

import * as schema from "../src/lib/db/schema";

const { user, account } = schema;

/**
 * Generate a unique ID for database records.
 * Uses crypto.randomUUID for secure random ID generation.
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Validate that all required environment variables are set.
 * Throws an error with clear message if any are missing.
 */
function validateEnvironment(): {
  databaseUrl: string;
  adminEmail: string;
  adminPassword: string;
  adminName: string;
} {
  const databaseUrl = process.env.DATABASE_URL;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  const missing: string[] = [];

  if (!databaseUrl) missing.push("DATABASE_URL");
  if (!adminEmail) missing.push("ADMIN_EMAIL");
  if (!adminPassword) missing.push("ADMIN_PASSWORD");
  if (!adminName) missing.push("ADMIN_NAME");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please set these variables before running the seed script."
    );
  }

  return {
    databaseUrl: databaseUrl as string,
    adminEmail: adminEmail as string,
    adminPassword: adminPassword as string,
    adminName: adminName as string,
  };
}

/**
 * Main seed function.
 * Creates admin user and credential account with hashed password.
 */
async function seedAdmin(): Promise<void> {
  const { databaseUrl, adminEmail, adminPassword, adminName } =
    validateEnvironment();

  // Create database connection with schema for type-safe queries
  const sql = createSqlClient(databaseUrl);
  const db = drizzle(sql, { schema });

  // Check if user already exists
  const existingUsers = await db
    .select()
    .from(user)
    .where(eq(user.email, adminEmail))
    .limit(1);

  if (existingUsers.length > 0) {
    throw new Error(
      `Admin user with email "${adminEmail}" already exists.\n` +
        "Delete the existing user first if you want to recreate it."
    );
  }

  // Hash the password using Better Auth's crypto module
  const hashedPassword = await hashPassword(adminPassword);

  // Generate IDs for user and account
  const userId = generateId();
  const accountId = generateId();

  // Insert user record
  await db.insert(user).values({
    id: userId,
    name: adminName,
    email: adminEmail,
    emailVerified: true, // Admin is pre-verified
    image: null,
  });

  // Insert account record with credential provider
  await db.insert(account).values({
    id: accountId,
    accountId: userId, // For credential provider, accountId equals userId
    providerId: "credential",
    userId: userId,
    password: hashedPassword,
    accessToken: null,
    refreshToken: null,
    idToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: null,
  });

  // eslint-disable-next-line no-console
  console.log(`Admin user created successfully:`);
  // eslint-disable-next-line no-console
  console.log(`  Email: ${adminEmail}`);
  // eslint-disable-next-line no-console
  console.log(`  Name: ${adminName}`);
  // eslint-disable-next-line no-console
  console.log(`  User ID: ${userId}`);
}

// Run the seed script
seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.error("Error seeding admin user:", error.message);
    process.exit(1);
  });
