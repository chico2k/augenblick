# Specification: Better Auth Implementation with Email/Password

## Overview

This task implements a single-user authentication system for a cosmetics studio admin panel using Better Auth. The studio owner requires access to protected `/office/*` routes for customer management and GDPR signature handling. The implementation uses email/password authentication only—no social logins, email verification, password reset flows, or public registration. The admin user is created once via a seed script, and session-based authentication (30-day expiry) protects the admin routes.

## Workflow Type

**Type**: feature

**Rationale**: This is a new feature implementation that adds authentication infrastructure to an existing Next.js application. It requires creating new files (auth config, API routes, middleware, login page), modifying existing database schema exports, and integrating with the existing Drizzle ORM setup.

## Task Scope

### Services Involved
- **main** (primary) - Next.js 15 application with App Router, Drizzle ORM, and Neon Postgres

### This Task Will:
- [ ] Install Better Auth and TanStack React Query dependencies
- [ ] Generate and integrate Better Auth database schema with existing Drizzle setup
- [ ] Create server-side auth configuration (`src/lib/auth.ts`)
- [ ] Create client-side auth utilities (`src/lib/auth-client.ts`)
- [ ] Create API route handler (`src/app/api/auth/[...all]/route.ts`)
- [ ] Create route protection middleware (`middleware.ts`)
- [ ] Create admin user seed script (`scripts/seed-admin.ts`)
- [ ] Create login page with React Hook Form + Zod validation (`src/app/login/page.tsx`)
- [ ] Add session validation to protected pages

### Out of Scope:
- Social login providers (Google, GitHub, etc.)
- Email verification flow
- Password reset flow
- Public user registration
- Two-factor authentication (2FA)
- Admin plugin or multi-user management
- Role-based access control (single user only)

## Service Context

### Main Service (Next.js)

**Tech Stack:**
- Language: TypeScript
- Framework: Next.js 15.5.9 (App Router)
- Styling: Tailwind CSS
- ORM: Drizzle with Neon Postgres (HTTP adapter)
- Forms: React Hook Form 7.43.1 + Zod 3.20.2 (already installed)
- Key directories: `src/lib`, `src/app`, `src/components`

**Entry Point:** `src/app/layout.tsx`

**How to Run:**
```bash
pnpm dev
```

**Port:** 3000

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `src/lib/db/schema/index.ts` | main | Add export for Better Auth generated schema tables |
| `src/lib/db/client.ts` | main | Update to include schema for Better Auth adapter |
| `package.json` | main | Add `better-auth` and `@tanstack/react-query` dependencies |
| `.env` | main | Add `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, admin seed vars |
| `.env.example` | main | Document new required environment variables |

## Files to Create

| File | Service | Purpose |
|------|---------|---------|
| `src/lib/auth.ts` | main | Better Auth server configuration with Drizzle adapter |
| `src/lib/auth-client.ts` | main | Client-side auth utilities (signIn, signOut, useSession) |
| `src/app/api/auth/[...all]/route.ts` | main | API route handler for auth endpoints |
| `middleware.ts` | main | Route protection for `/office/*` and login redirects |
| `src/lib/db/schema/auth.ts` | main | Better Auth schema (generated via CLI) |
| `scripts/seed-admin.ts` | main | One-time admin user creation script |
| `src/app/login/page.tsx` | main | Login page with form |
| `src/components/LoginForm.tsx` | main | Login form component with React Hook Form |
| `drizzle.config.ts` | main | Drizzle Kit configuration for migrations |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| `src/lib/db/client.ts` | Drizzle client setup with Neon serverless |
| `src/lib/db/schema/index.ts` | Schema barrel export pattern |
| `src/lib/db/index.ts` | Public API export pattern |
| `src/lib/hooks/useContactSubmit.ts` | React Hook Form integration pattern |
| `src/components/ui/dialog.tsx` | UI component structure |
| `src/app/api/email/route.ts` | API route handler pattern |

## Patterns to Follow

### Drizzle Client Pattern

From `src/lib/db/client.ts`:

```typescript
import { neon as createSqlClient } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = process.env.DATABASE_URL as string;
const sql = createSqlClient(databaseUrl);
const db = drizzle(sql);

export default db;
```

**Key Points:**
- Uses Neon serverless HTTP adapter
- Clean single-responsibility exports
- Environment variable for connection string

### Schema Barrel Export Pattern

From `src/lib/db/schema/index.ts`:

```typescript
// Export all schemas and types from each schema file
export * from "./example";
export * from "./auth";  // Add this for auth schema
```

**Key Points:**
- Re-export all table schemas
- Enables clean imports via `@/lib/db`

### API Route Pattern

From existing routes:

```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Handle request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "..." }, { status: 500 });
  }
}
```

**Key Points:**
- Use NextResponse for responses
- Consistent error handling
- Try-catch for error safety

## Requirements

### Functional Requirements

1. **Email/Password Authentication**
   - Description: Users can sign in with email and password
   - Acceptance: Successful login redirects to `/office`, failed login shows "Ungültige Anmeldedaten" error

2. **Session Management**
   - Description: Session-based auth with 30-day expiry, updates once per 24 hours
   - Acceptance: Session persists across browser restarts, expires after 30 days of inactivity

3. **Route Protection**
   - Description: All `/office/*` routes require authentication
   - Acceptance: Unauthenticated users redirected to `/login`, authenticated users on `/login` redirected to `/office`

4. **No Public Registration**
   - Description: Sign-up endpoint is disabled via Better Auth config
   - Acceptance: POST to `/api/auth/sign-up/email` returns 404 or disabled error

5. **Admin User Seeding**
   - Description: One-time script to create the admin user
   - Acceptance: Running `npx tsx scripts/seed-admin.ts` creates user with hashed password in database

### Edge Cases

1. **Invalid Credentials** - Show generic "Ungültige Anmeldedaten" error (don't reveal if email exists)
2. **Session Expiry** - Redirect to `/login` with no error message
3. **Concurrent Sessions** - Allow multiple sessions (same user on different devices)
4. **Missing Environment Variables** - Auth initialization should fail with clear error message
5. **Database Connection Failure** - Handle gracefully with error logging

## Implementation Notes

### DO
- Follow the pattern in `src/lib/db/client.ts` for database exports
- Reuse existing React Hook Form + Zod setup (already in package.json)
- Use German text for UI labels: "E-Mail", "Passwort", "Anmelden", "Ungültige Anmeldedaten"
- Export auth session type for TypeScript support
- Use `better-auth/crypto` for password hashing in seed script
- Add server-side session validation on each protected page (belt and suspenders)

### DON'T
- Create registration flow or "Registrieren" links
- Add "Passwort vergessen" functionality
- Use JWT-based auth (use session-based)
- Expose detailed error messages that reveal user existence
- Skip the middleware even with server-side checks (defense in depth)
- Use `middleware.ts` export name `middleware` with Next.js 15.2+ (check if `proxy.ts` rename is needed based on Next.js version)

## Development Environment

### Start Services

```bash
# Install dependencies
pnpm install

# Generate auth schema
npx @better-auth/cli generate --output ./src/lib/db/schema/auth.ts

# Apply database migrations
pnpm db:push  # or equivalent drizzle migration command

# Seed admin user (run once)
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="secure-password-here" ADMIN_NAME="Admin" npx tsx scripts/seed-admin.ts

# Start dev server
pnpm dev
```

### Service URLs
- Main Application: http://localhost:3000
- Login Page: http://localhost:3000/login
- Admin Office: http://localhost:3000/office

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon Postgres connection string | `postgresql://...@neon.tech/...` |
| `BETTER_AUTH_SECRET` | Auth secret key (generate with `openssl rand -base64 32`) | Base64 string |
| `NEXT_PUBLIC_APP_URL` | Application URL for auth callbacks | `http://localhost:3000` |
| `ADMIN_EMAIL` | Initial admin email (seed script only) | `owner@studio.de` |
| `ADMIN_PASSWORD` | Initial admin password (seed script only) | Secure password |
| `ADMIN_NAME` | Initial admin display name (seed script only) | `Studio Owner` |

## Success Criteria

The task is complete when:

1. [ ] Better Auth is installed and configured with Drizzle adapter
2. [ ] Auth schema is generated and exported from `src/lib/db/schema`
3. [ ] API route `/api/auth/[...all]` handles auth requests
4. [ ] Middleware protects `/office/*` routes and handles `/login` redirects
5. [ ] Login page displays email/password form with German labels
6. [ ] Login form validates with Zod and submits via authClient.signIn.email
7. [ ] Failed login shows "Ungültige Anmeldedaten" error
8. [ ] Successful login redirects to `/office`
9. [ ] Seed script creates admin user with hashed password
10. [ ] No public registration endpoint accessible
11. [ ] No console errors in development
12. [ ] Existing tests still pass

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests

| Test | File | What to Verify |
|------|------|----------------|
| Login Form Validation | `tests/components/LoginForm.test.tsx` | Form validates email format and password length |
| Auth Config | `tests/lib/auth.test.ts` | Auth instance created with correct options |

### Integration Tests

| Test | Services | What to Verify |
|------|----------|----------------|
| Sign In Flow | API ↔ Database | POST to `/api/auth/sign-in/email` creates session cookie |
| Sign Out Flow | API ↔ Database | POST to `/api/auth/sign-out` clears session |
| Disabled Sign Up | API Route | POST to `/api/auth/sign-up/email` returns 404/disabled |

### End-to-End Tests

| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Successful Login | 1. Navigate to `/login` 2. Enter valid credentials 3. Submit | Redirect to `/office` with session cookie set |
| Failed Login | 1. Navigate to `/login` 2. Enter invalid credentials 3. Submit | Stay on `/login` with "Ungültige Anmeldedaten" error |
| Protected Route Access | 1. Navigate to `/office` without session | Redirect to `/login` |
| Authenticated Redirect | 1. Login successfully 2. Navigate to `/login` | Redirect to `/office` |
| Session Persistence | 1. Login 2. Close browser 3. Reopen and navigate to `/office` | Access granted (session valid) |

### Browser Verification (if frontend)

| Page/Component | URL | Checks |
|----------------|-----|--------|
| Login Page | `http://localhost:3000/login` | Displays email/password inputs, submit button, no register/forgot links |
| Login Form | `http://localhost:3000/login` | Form validates inputs, shows loading state during submission |
| Error Display | `http://localhost:3000/login` | Shows "Ungültige Anmeldedaten" on failed login attempt |
| Protected Page | `http://localhost:3000/office` | Displays user name, redirects if not authenticated |

### Database Verification

| Check | Query/Command | Expected |
|-------|---------------|----------|
| User Table Exists | `SELECT * FROM "user" LIMIT 1` | Table exists with Better Auth schema |
| Session Table Exists | `SELECT * FROM "session" LIMIT 1` | Table exists with Better Auth schema |
| Account Table Exists | `SELECT * FROM "account" LIMIT 1` | Table exists with Better Auth schema |
| Admin User Created | `SELECT email FROM "user" WHERE email = 'admin@...'` | Admin email exists |
| Password Hashed | `SELECT password FROM "account" WHERE "providerId" = 'credential'` | Password is hashed (not plaintext) |

### Manual Testing Checklist

- [ ] Navigate to `/office` without login → redirects to `/login`
- [ ] Submit login with empty fields → validation errors shown
- [ ] Submit login with invalid email format → "Ungültige E-Mail" error
- [ ] Submit login with short password → "Mindestens 8 Zeichen" error
- [ ] Submit login with wrong credentials → "Ungültige Anmeldedaten" error
- [ ] Submit login with correct credentials → redirects to `/office`
- [ ] Navigate to `/login` while authenticated → redirects to `/office`
- [ ] Close browser, reopen, navigate to `/office` → still authenticated
- [ ] Sign out → redirected to `/login`, cannot access `/office`

### QA Sign-off Requirements

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Browser verification complete
- [ ] Database state verified
- [ ] No regressions in existing functionality
- [ ] Code follows established patterns (Drizzle, React Hook Form, TypeScript)
- [ ] No security vulnerabilities introduced
- [ ] German language used correctly in UI
- [ ] No "forgot password" or "register" links present
