import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Login page metadata
 */
export const metadata: Metadata = {
  title: "Anmelden - Augenblick Chiemgau",
  robots: "noindex, nofollow",
};

/**
 * Login page for admin authentication.
 *
 * Features:
 * - Minimal layout (no site navigation/footer)
 * - Centered login form with shadcn/ui styling
 * - German language labels
 * - Redirects to /office on successful login
 * - Server-side session check for authenticated user redirect
 *
 * Note: No social login, registration or forgot password links per spec.
 */
export default async function LoginPage() {
  // Check if user is already authenticated
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (session) {
    // Redirect authenticated users to /office
    redirect("/office");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium text-foreground hover:text-fuchsia-600 transition-colors">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 text-white">
            A
          </div>
          Augenblick Chiemgau
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
