"use client";

/**
 * Treatment Types Admin Page
 * Manage treatment types and their default prices.
 */

import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TreatmentTable } from "@/components/treatments/treatment-table";
import { useTreatments, useDeleteTreatment } from "@/hooks/use-treatments";

export default function BehandlungenPage() {
  const { data: treatments = [], isLoading } = useTreatments();
  const deleteMutation = useDeleteTreatment();

  const handleDelete = (id: string) => {
    if (!confirm("Behandlungsart wirklich löschen?")) return;

    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Behandlungsart gelöscht"),
      onError: (error) => toast.error(error.message || "Fehler"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TreatmentTable
      data={treatments}
      onDelete={handleDelete}
      actionButton={
        <Link href="/office/behandlungen/neu">
          <Button className="min-h-11">
            <Plus className="mr-2 h-4 w-4" />
            Neu
          </Button>
        </Link>
      }
    />
  );
}
