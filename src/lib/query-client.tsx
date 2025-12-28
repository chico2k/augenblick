"use client";

/**
 * React Query Provider
 * Provides QueryClient to the application.
 * Uses useState pattern for Next.js App Router compatibility.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 3,
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create client in useState to ensure:
  // 1. One client per request on server
  // 2. Client persists across component renders on client
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
