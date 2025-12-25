import "../styles/globals.css";
import "keen-slider/keen-slider.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { AxiomWebVitals } from "next-axiom";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const DynamicConsent = dynamic(() => import("../components/CookieConsent"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Augenblick Chiemgau",
  description: "Augenblick Chiemgau - Wimperverlängerung Lashlift Traunreut",
};

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
        <Navigation />
        {children}
        <ToastContainer />
        <DynamicConsent />
        <Footer />
      </body>
    </html>
  );
}
