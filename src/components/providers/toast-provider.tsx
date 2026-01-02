"use client";

/**
 * Toast Provider
 * Client-side wrapper for sonner's Toaster component.
 */

import { Toaster } from "sonner";

export function ToastProvider() {
  return <Toaster position="top-right" richColors />;
}
