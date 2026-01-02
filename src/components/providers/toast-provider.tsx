"use client";

/**
 * Toast Provider
 * Client-side wrapper for react-toastify's ToastContainer.
 * Handles the client-side only import to avoid SSR issues.
 */

import dynamic from "next/dynamic";

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export function ToastProvider() {
  return <ToastContainer />;
}
