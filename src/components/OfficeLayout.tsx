import React, { useState, useCallback } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { signOut } from "../lib/auth-client";
import type { User } from "../lib/auth";

interface OfficeLayoutProps {
  children: React.ReactNode;
  user: User;
}

/**
 * Layout component for the protected office/admin area.
 *
 * Features:
 * - Minimal header with logo and sign-out button
 * - German labels per spec requirements
 * - Handles sign-out with redirect to login page
 * - No public navigation or footer (admin-only area)
 */
const OfficeLayout: React.FC<OfficeLayoutProps> = ({ children, user }) => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            void router.push("/login");
          },
        },
      });
    } catch {
      // On error, still attempt to redirect to login
      void router.push("/login");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Verwaltung - Augenblick Chiemgau</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Office Header */}
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <NextLink
                  href="/office"
                  className="text-xl font-semibold text-gray-900 hover:text-fuchsia-600"
                >
                  Augenblick Verwaltung
                </NextLink>
              </div>

              {/* User info and Sign Out */}
              <div className="flex items-center space-x-4">
                <span className="hidden text-sm text-gray-600 sm:block">
                  {user.name ?? user.email}
                </span>
                <button
                  onClick={() => void handleSignOut()}
                  disabled={isSigningOut}
                  className="inline-flex items-center rounded-md border border-transparent bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSigningOut ? "..." : "Abmelden"}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </>
  );
};

export default OfficeLayout;
