/**
 * Better Auth API Route Handler (Pages Router)
 *
 * This catch-all route handles all authentication API endpoints:
 * - POST /api/auth/sign-in/email - Email/password sign in
 * - POST /api/auth/sign-out - Sign out and clear session
 * - GET /api/auth/get-session - Get current session
 *
 * Note: Sign-up is disabled via auth configuration (disableSignUp: true)
 *
 * For Pages Router, we use toNodeHandler instead of toNextJsHandler
 * and disable body parsing so Better Auth can handle it.
 */

import { toNodeHandler } from "better-auth/node";
import { auth } from "../../../lib/auth";

/**
 * Disable Next.js body parsing - Better Auth handles this internally.
 * Required for proper request body handling in Pages Router.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Export the Better Auth handler for all HTTP methods.
 * toNodeHandler converts the Better Auth handler to a Node.js compatible handler
 * that works with Next.js Pages Router API routes.
 */
export default toNodeHandler(auth.handler);
