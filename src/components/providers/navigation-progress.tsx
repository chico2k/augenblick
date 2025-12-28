"use client";

/**
 * Navigation Progress Provider
 * Tracks route changes and displays a loading indicator during navigation.
 * Shows loading during Next.js compilation in development mode.
 */

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingBar } from "@/components/ui/loading-bar";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only render on client-side to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Intercept all link clicks to start loading immediately
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && link.href.startsWith(window.location.origin)) {
        // Internal link - start loading
        setIsLoading(true);
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    // Stop loading when route actually changes
    setIsLoading(false);
  }, [pathname, searchParams, isMounted]);

  if (!isMounted) return null;

  return <LoadingBar isLoading={isLoading} />;
}
