/**
 * Next.js Middleware for Route Protection
 *
 * This middleware handles authentication-based routing:
 * - Protects /office/* routes: redirects unauthenticated users to /login
 * - Redirects authenticated users from /login to /office
 *
 * Note: This uses optimistic cookie-based session checking for performance.
 * Full session validation happens server-side on each protected page
 * (defense in depth / belt and suspenders approach).
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Protected routes that require authentication.
 */
const PROTECTED_ROUTES = ["/office"];

/**
 * Auth routes that should redirect to /office if user is authenticated.
 */
const AUTH_ROUTES = ["/login"];

/**
 * Default redirect destination after successful login.
 */
const DEFAULT_REDIRECT = "/office";

/**
 * Login page path for unauthenticated users.
 */
const LOGIN_PATH = "/login";

/**
 * Checks if the pathname starts with any of the protected route prefixes.
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Checks if the pathname is an auth route (login, signup, etc.).
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname);
}

/**
 * Route protection middleware.
 *
 * Uses optimistic session cookie check for redirects.
 * This is NOT a security boundary - actual session validation
 * happens server-side on each protected page/API route.
 */
export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Authenticated users on auth routes (login) -> redirect to /office
  if (sessionCookie && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  // Unauthenticated users on protected routes -> redirect to /login
  if (!sessionCookie && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

/**
 * Middleware configuration.
 * Specifies which routes the middleware should run on.
 *
 * Matches:
 * - /office and all sub-routes (/office/*, /office/customers, etc.)
 * - /login page
 *
 * Does NOT match:
 * - API routes (/api/*)
 * - Static files (_next/static/*, *.ico, *.png, etc.)
 * - Other public pages (/, /about, etc.)
 */
export const config = {
  matcher: ["/office/:path*", "/login"],
};
