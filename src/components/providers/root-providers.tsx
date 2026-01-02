"use client";

/**
 * Root Providers
 * Client-side providers that wrap the entire app.
 */

import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { NavigationProgress } from "./navigation-progress";
import { QueryProvider } from "@/lib/query-client";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      {children}
      <ToastContainer />
    </QueryProvider>
  );
}
