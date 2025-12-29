/**
 * Edit Treatment Page
 * Server component that fetches treatment data and renders the TreatmentForm in edit mode.
 */

import { notFound } from "next/navigation";
import { TreatmentForm } from "@/components/treatments/treatment-form";
import { treatmentService } from "@/lib/services/treatment.service";
import { isErrResult } from "@/lib/services/types";

export const metadata = {
  title: "Behandlung bearbeiten",
  description: "Bearbeiten Sie die Behandlungsdaten",
};

interface EditTreatmentPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Page for editing an existing treatment.
 * Fetches treatment data and renders the TreatmentForm in edit mode with pre-filled values.
 */
export default async function EditTreatmentPage({
  params,
}: EditTreatmentPageProps) {
  const { id } = await params;

  // Fetch treatment data
  const result = await treatmentService.getById(id);

  if (isErrResult(result)) {
    notFound();
  }

  const treatment = result.value;

  // Map treatment data to form values
  const defaultValues = {
    name: treatment.name,
    description: treatment.description ?? "",
    defaultPrice: treatment.defaultPrice,
    isActive: treatment.isActive,
  };

  return (
    <div className="container max-w-2xl py-6">
      <TreatmentForm
        mode="edit"
        treatmentId={treatment.id}
        defaultValues={defaultValues}
      />
    </div>
  );
}
