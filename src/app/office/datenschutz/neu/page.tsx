import { GdprVersionForm } from "@/components/gdpr/gdpr-version-form";

/**
 * Page metadata for creating new GDPR version.
 */
export const metadata = {
  title: "Neue Datenschutzversion",
  description: "Erstellen Sie eine neue Datenschutzversion.",
};

/**
 * New GDPR Version Page
 *
 * Displays the form for creating a new GDPR version.
 * After successful creation, redirects to the GDPR version list.
 */
export default function NeueDatenschutzversionPage() {
  return (
    <div className="max-w-3xl">
      <GdprVersionForm redirectOnSuccess="/office/datenschutz" />
    </div>
  );
}
