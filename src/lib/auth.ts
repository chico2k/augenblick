/**
 * Better Auth server-side configuration with Drizzle adapter.
 * Following SOLID principles - Single Responsibility: only handles auth configuration.
 * Configured for single-user authentication without public registration.
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
// Better Auth types are correctly inferred when dependencies are installed

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db/client";
import * as schema from "./db/schema";

/**
 * Better Auth secret key for session signing.
 * Must be set in environment variables for security.
 */
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!authSecret) {
  throw new Error(
    "BETTER_AUTH_SECRET environment variable is required for authentication"
  );
}

/**
 * Application base URL for auth callbacks and redirects.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Trusted localhost origins for development.
 * Supports common development ports to allow testing on multiple ports.
 */
const localhostOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:4000",
  "http://localhost:5000",
];

/**
 * Session configuration constants.
 * 30-day session expiry with 24-hour refresh interval.
 */
const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 30; // 30 days
const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24; // 24 hours

/**
 * Better Auth instance configured for the cosmetics studio admin panel.
 *
 * Features:
 * - Email/password authentication only (no social logins)
 * - Public registration disabled (admin user created via seed script)
 * - Session-based authentication with 30-day expiry
 * - No email verification or password reset flows
 */
export const auth = betterAuth({
  /**
   * Database configuration using Drizzle ORM adapter.
   * Uses the existing Neon Postgres connection from db/client.ts.
   */
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  /**
   * Base URL for the application.
   * Used for generating callback URLs and redirects.
   */
  baseURL: appUrl,

  /**
   * Secret key for signing sessions and tokens.
   */
  secret: authSecret,

  /**
   * Email and password authentication configuration.
   * Sign-up is disabled since the admin user is created via seed script.
   */
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: false,
  },

  /**
   * Session configuration for 30-day expiry with daily refresh.
   */
  session: {
    expiresIn: SESSION_EXPIRY_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },

  /**
   * Trusted origins for CORS and security.
   * In development, includes common localhost ports.
   * In production, only includes the configured app URL.
   */
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? [appUrl]
      : [...new Set([appUrl, ...localhostOrigins])],
});

/** Type for the auth session */
export type Session = typeof auth.$Infer.Session;

/** Type for the authenticated user */
export type User = typeof auth.$Infer.Session.user;
