/**
 * New Treatment Page
 * Server component that renders the TreatmentForm in create mode.
 */

import { TreatmentForm } from "@/components/treatments/treatment-form";

export const metadata = {
  title: "Neue Behandlung",
  description: "Erstellen Sie eine neue Behandlungsart",
};

/**
 * Page for creating a new treatment.
 * Renders the TreatmentForm component in create mode.
 */
export default function NewTreatmentPage() {
  return <TreatmentForm mode="create" />;
}
