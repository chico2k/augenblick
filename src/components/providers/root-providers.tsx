"use client";

/**
 * Root Providers
 * Client-side providers that wrap the entire app.
 */

import { Suspense } from "react";
import { NavigationProgress } from "./navigation-progress";
import { ToastProvider } from "./toast-provider";
import { QueryProvider } from "@/lib/query-client";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      {children}
      <ToastProvider />
    </QueryProvider>
  );
}
