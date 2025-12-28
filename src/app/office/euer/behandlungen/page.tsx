"use client";

/**
 * Treatment Types Admin Page
 * Manage treatment types and their default prices.
 */

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createTreatmentAction,
  updateTreatmentAction,
  deleteTreatmentAction,
  getTreatmentsAction,
} from "@/app/actions/treatment.actions";

/**
 * Treatment type for local state.
 */
interface TreatmentType {
  id: string;
  name: string;
  description: string | null;
  defaultPrice: string;
  isActive: boolean;
  sortOrder: string;
  createdAt: Date;
}

export default function BehandlungenPage() {
  const [treatments, setTreatments] = useState<TreatmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<TreatmentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Load treatments
  useEffect(() => {
    async function loadTreatments() {
      const result = await getTreatmentsAction();
      if (result.success && result.data) {
        setTreatments(result.data);
      }
      setIsLoading(false);
    }
    void loadTreatments();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setDefaultPrice("");
    setIsActive(true);
    setEditingTreatment(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (treatment: TreatmentType) => {
    setEditingTreatment(treatment);
    setName(treatment.name);
    setDescription(treatment.description ?? "");
    setDefaultPrice(treatment.defaultPrice);
    setIsActive(treatment.isActive);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Name erforderlich");
      return;
    }
    if (!defaultPrice || parseFloat(defaultPrice) < 0) {
      toast.error("Gültiger Preis erforderlich");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTreatment) {
        // Update
        const result = await updateTreatmentAction({
          id: editingTreatment.id,
          name,
          description: description || null,
          defaultPrice,
          isActive,
        });

        if (result.success) {
          toast.success("Behandlungsart aktualisiert");
          // Refresh list
          const listResult = await getTreatmentsAction();
          if (listResult.success && listResult.data) {
            setTreatments(listResult.data);
          }
          setIsDialogOpen(false);
        } else {
          toast.error(result.error || "Fehler");
        }
      } else {
        // Create
        const result = await createTreatmentAction({
          name,
          description: description || undefined,
          defaultPrice,
          isActive,
          sortOrder: treatments.length,
        });

        if (result.success) {
          toast.success("Behandlungsart erstellt");
          // Refresh list
          const listResult = await getTreatmentsAction();
          if (listResult.success && listResult.data) {
            setTreatments(listResult.data);
          }
          setIsDialogOpen(false);
        } else {
          toast.error(result.error || "Fehler");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Behandlungsart wirklich löschen?")) return;

    const result = await deleteTreatmentAction(id);
    if (result.success) {
      toast.success("Behandlungsart gelöscht");
      setTreatments((prev) => prev.filter((t) => t.id !== id));
    } else {
      toast.error(result.error || "Fehler");
    }
  };

  /**
   * Format currency in German format.
   */
  function formatCurrency(amount: string): string {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(amount));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action button */}
      <div className="flex justify-end">
        <Button onClick={openCreateDialog} className="min-h-11">
          <Plus className="mr-2 h-4 w-4" />
          Neu
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {treatments.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Noch keine Behandlungsarten angelegt
            </p>
          ) : (
            <div className="divide-y">
              {treatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className={`font-medium ${!treatment.isActive ? "text-muted-foreground" : ""}`}>
                      {treatment.name}
                      {!treatment.isActive && " (inaktiv)"}
                    </p>
                    {treatment.description && (
                      <p className="text-sm text-muted-foreground">
                        {treatment.description}
                      </p>
                    )}
                    <p className="text-sm font-medium text-primary">
                      {formatCurrency(treatment.defaultPrice)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11"
                      onClick={() => openEditDialog(treatment)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 text-red-500 hover:text-red-600"
                      onClick={() => void handleDelete(treatment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTreatment ? "Behandlungsart bearbeiten" : "Neue Behandlungsart"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Lashlift"
                className="min-h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kurze Beschreibung..."
                className="min-h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Standardpreis (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
                placeholder="0.00"
                className="min-h-11"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Aktiv</Label>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            <Button
              className="w-full min-h-12"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gespeichert...
                </>
              ) : editingTreatment ? (
                "Speichern"
              ) : (
                "Erstellen"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
