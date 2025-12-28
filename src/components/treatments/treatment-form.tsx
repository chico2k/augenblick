"use client";

/**
 * Treatment Form Component
 * Reusable form for creating and editing treatments with Zod validation.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  createTreatmentAction,
  updateTreatmentAction,
} from "../../app/actions/treatment.actions";

/**
 * Zod schema for treatment form validation.
 */
export const treatmentFormSchema = z.object({
  name: z.string().min(1, "Name erforderlich"),
  description: z.string().optional(),
  defaultPrice: z
    .string()
    .min(1, "Preis erforderlich")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Gültiger Preis erforderlich",
    }),
  isActive: z.boolean().default(true),
});

export type TreatmentFormData = z.infer<typeof treatmentFormSchema>;

/**
 * Default form values for creating a new treatment.
 */
const defaultFormValues: TreatmentFormData = {
  name: "",
  description: "",
  defaultPrice: "",
  isActive: true,
};

interface TreatmentFormProps {
  /** Form mode: create or edit */
  mode: "create" | "edit";
  /** Treatment ID for edit mode */
  treatmentId?: string;
  /** Default values for the form (for edit mode) */
  defaultValues?: Partial<TreatmentFormData>;
  /** Sort order for new treatments */
  sortOrder?: number;
}

/**
 * Treatment form component with React Hook Form and Zod validation.
 */
export function TreatmentForm({
  mode,
  treatmentId,
  defaultValues,
  sortOrder = 0,
}: TreatmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  });

  const onSubmit = async (data: TreatmentFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "edit" && treatmentId) {
        const result = await updateTreatmentAction({
          id: treatmentId,
          name: data.name,
          description: data.description || null,
          defaultPrice: data.defaultPrice,
          isActive: data.isActive,
        });

        if (result.success) {
          toast.success("Behandlungsart aktualisiert");
          router.push("/office/behandlungen");
          router.refresh();
        } else {
          toast.error(result.error || "Fehler beim Aktualisieren");
        }
      } else {
        const result = await createTreatmentAction({
          name: data.name,
          description: data.description,
          defaultPrice: data.defaultPrice,
          isActive: data.isActive,
          sortOrder,
        });

        if (result.success) {
          toast.success("Behandlungsart erstellt");
          router.push("/office/behandlungen");
          router.refresh();
        } else {
          toast.error(result.error || "Fehler beim Erstellen");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/office/behandlungen");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        {mode === "create" ? "Neue Behandlungsart" : "Behandlungsart bearbeiten"}
      </h2>
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="z.B. Lashlift"
                      className="min-h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Kurze Beschreibung..."
                      className="min-h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standardpreis (€)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="min-h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Aktiv</FormLabel>
                    <FormDescription>
                      Aktive Behandlungsarten können bei Terminen ausgewählt werden
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 min-h-12"
                disabled={isSubmitting}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="flex-1 min-h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : mode === "create" ? (
                  "Erstellen"
                ) : (
                  "Speichern"
                )}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}
