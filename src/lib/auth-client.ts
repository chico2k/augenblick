/**
 * Client-side auth utilities for Better Auth.
 * Following SOLID principles - Single Responsibility: only handles client-side auth operations.
 *
 * Usage:
 * - Import authClient for direct API access
 * - Import signIn, signOut for auth operations
 * - Import useSession hook for session state in React components
 */

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client instance configured for the application.
 * Uses the NEXT_PUBLIC_APP_URL environment variable as the base URL.
 *
 * Features:
 * - signIn.email() for email/password authentication
 * - signOut() for session termination
 * - useSession() hook for reactive session state
 */
export const authClient = createAuthClient({
  /**
   * Base URL for auth API requests.
   * In browser, use window.location.origin to always match current port.
   * On server, use NEXT_PUBLIC_APP_URL or fallback to localhost:3000.
   */
  baseURL: typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
});

/**
 * Sign in with email and password.
 * Returns { data, error } where data contains session info on success.
 *
 * @example
 * const { data, error } = await signIn({
 *   email: "user@example.com",
 *   password: "password123",
 *   callbackURL: "/office"
 * });
 */
export const signIn = authClient.signIn;

/**
 * Sign out the current user.
 * Clears the session cookie and invalidates the session.
 *
 * @example
 * await signOut({ fetchOptions: { onSuccess: () => redirect("/login") } });
 */
export const signOut = authClient.signOut;

/**
 * React hook for accessing session state.
 * Returns { data: session, isPending, error } for reactive session management.
 *
 * @example
 * const { data: session, isPending } = useSession();
 * if (isPending) return <Loading />;
 * if (!session) return <LoginPrompt />;
 * return <Dashboard user={session.user} />;
 */
export const useSession = authClient.useSession;

/**
 * Get the current session (non-reactive).
 * Useful for one-time session checks outside of React components.
 *
 * @example
 * const { data: session } = await getSession();
 */
export const getSession = authClient.getSession;
