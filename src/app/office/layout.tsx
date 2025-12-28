import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { OfficeLayoutClient } from "@/components/layout/office-layout-client";

/**
 * Office layout with server-side session validation.
 *
 * This provides defense-in-depth alongside the middleware:
 * - Middleware handles the initial redirect (fast, cookie-based check)
 * - This layout validates the full session server-side (secure validation)
 *
 * If no valid session exists, redirects to /login.
 */
export default async function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validate session server-side
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    // No valid session - redirect to login
    redirect("/login");
  }

  // Render client component that handles pathname-based layout
  return <OfficeLayoutClient>{children}</OfficeLayoutClient>;
}
