import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import CookieConsent from "@/components/CookieConsent";

/**
 * Website Layout - Public pages layout with Navigation and Footer
 *
 * This layout wraps all public website pages (homepage, service pages, etc.)
 * and provides the standard website chrome: Navigation, Footer, CookieConsent.
 *
 * Pages outside this route group (login, office) will NOT have this layout.
 */
export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
      <CookieConsent />
      <Footer />
    </>
  );
}
