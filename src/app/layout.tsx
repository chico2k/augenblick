import "../styles/globals.css";
import "keen-slider/keen-slider.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import GoogleAnalytics from "../components/GoogleAnalytics";
import CookieConsent from "../components/CookieConsent";
import { AxiomWebVitals } from "next-axiom";
import type { Metadata } from "next";

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
        <CookieConsent />
        <Footer />
      </body>
    </html>
  );
}
