/**
 * Better Auth API Route Handler (App Router)
 *
 * This catch-all route handles all authentication API endpoints:
 * - POST /api/auth/sign-in/email - Email/password sign in
 * - POST /api/auth/sign-out - Sign out and clear session
 * - GET /api/auth/get-session - Get current session
 *
 * Note: Sign-up is disabled via auth configuration (disableSignUp: true)
 *
 * For App Router, we use toNextJsHandler which automatically handles:
 * - Request body parsing
 * - HTTP method routing (GET, POST)
 * - Session cookie management
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Export GET and POST handlers for all authentication endpoints.
 * toNextJsHandler converts the Better Auth instance to Next.js App Router
 * compatible route handlers.
 */
export const { GET, POST } = toNextJsHandler(auth);
