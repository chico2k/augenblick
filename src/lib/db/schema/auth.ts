/**
 * Better Auth schema for PostgreSQL using Drizzle ORM.
 * Defines user, session, account, and verification tables.
 * Following SOLID principles - Single Responsibility: only defines auth table structures.
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
// Drizzle ORM types are correctly inferred when dependencies are installed

import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * User table for Better Auth.
 * Stores core user information for authentication.
 */
export const user = pgTable("user", {
  /** Unique user identifier */
  id: text("id").primaryKey(),
  /** User display name */
  name: text("name").notNull(),
  /** User email address - must be unique */
  email: text("email").notNull().unique(),
  /** Whether email has been verified */
  emailVerified: boolean("email_verified").default(false).notNull(),
  /** User avatar/profile image URL */
  image: text("image"),
  /** When the user was created */
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  /** When the user was last updated */
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * Session table for Better Auth.
 * Stores active user sessions for authentication.
 */
export const session = pgTable(
  "session",
  {
    /** Unique session identifier */
    id: text("id").primaryKey(),
    /** When the session expires */
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    /** Session token - must be unique */
    token: text("token").notNull().unique(),
    /** When the session was created */
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    /** When the session was last updated */
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    /** IP address of the client */
    ipAddress: text("ip_address"),
    /** User agent of the client browser */
    userAgent: text("user_agent"),
    /** Reference to the user who owns this session */
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)]
);

/**
 * Account table for Better Auth.
 * Stores authentication provider accounts linked to users.
 */
export const account = pgTable(
  "account",
  {
    /** Unique account identifier */
    id: text("id").primaryKey(),
    /** Account ID from the provider (e.g., OAuth provider's user ID) */
    accountId: text("account_id").notNull(),
    /** Provider identifier (e.g., "credential", "google", "github") */
    providerId: text("provider_id").notNull(),
    /** Reference to the user who owns this account */
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Access token from the provider (for OAuth) */
    accessToken: text("access_token"),
    /** Refresh token from the provider (for OAuth) */
    refreshToken: text("refresh_token"),
    /** ID token from the provider (for OIDC) */
    idToken: text("id_token"),
    /** When the access token expires */
    accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: "date" }),
    /** When the refresh token expires */
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: "date" }),
    /** Authorization scope granted */
    scope: text("scope"),
    /** Hashed password for credential provider */
    password: text("password"),
    /** When the account was created */
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    /** When the account was last updated */
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)]
);

/**
 * Verification table for Better Auth.
 * Stores verification tokens for email verification, password reset, etc.
 */
export const verification = pgTable("verification", {
  /** Unique verification identifier */
  id: text("id").primaryKey(),
  /** The verification identifier (e.g., email address) */
  identifier: text("identifier").notNull(),
  /** The verification value/token */
  value: text("value").notNull(),
  /** When this verification expires */
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  /** When this verification was created */
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  /** When this verification was last updated */
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/** Type for selecting rows from the user table */
export type User = typeof user.$inferSelect;

/** Type for inserting rows into the user table */
export type NewUser = typeof user.$inferInsert;

/** Type for selecting rows from the session table */
export type Session = typeof session.$inferSelect;

/** Type for inserting rows into the session table */
export type NewSession = typeof session.$inferInsert;

/** Type for selecting rows from the account table */
export type Account = typeof account.$inferSelect;

/** Type for inserting rows into the account table */
export type NewAccount = typeof account.$inferInsert;

/** Type for selecting rows from the verification table */
export type Verification = typeof verification.$inferSelect;

/** Type for inserting rows into the verification table */
export type NewVerification = typeof verification.$inferInsert;
