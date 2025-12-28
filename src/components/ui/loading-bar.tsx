"use client";

/**
 * Loading Spinner Overlay
 * A prominent loading spinner that appears during page navigation.
 */

import { Loader2 } from "lucide-react";

interface LoadingBarProps {
  isLoading: boolean;
}

export function LoadingBar({ isLoading }: LoadingBarProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
        <p className="text-sm text-muted-foreground">Wird geladen...</p>
      </div>
    </div>
  );
}
