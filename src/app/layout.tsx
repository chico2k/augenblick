import "../styles/globals.css";
import "keen-slider/keen-slider.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { AxiomWebVitals } from "next-axiom";
import { RootProviders } from "@/components/providers/root-providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Augenblick Chiemgau",
  description: "Augenblick Chiemgau - Wimperverlängerung Lashlift Traunreut",
};

/**
 * Root Layout - Base HTML structure for all pages
 *
 * This layout provides:
 * - Global CSS imports
 * - Analytics (Axiom, Google Analytics)
 * - Toast notifications
 *
 * Note: Navigation and Footer are NOT included here.
 * They are added in the (website) route group for public pages only.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <AxiomWebVitals />
        <GoogleAnalytics />
        <RootProviders>{children}</RootProviders>
        <ToastContainer />
      </body>
    </html>
  );
}
