"use client";

/**
 * GDPR Version Form Component
 * Reusable form for creating new GDPR versions with Zod validation.
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
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { createGdprVersionAction, updateGdprVersionAction } from "../../app/actions/gdpr.actions";

/**
 * Zod schema for GDPR version form validation.
 * - version is optional and will be auto-generated
 * - title is required
 * - content is required (markdown text)
 * - isActive is optional boolean
 */
export const gdprVersionFormSchema = z.object({
  version: z.string().optional(),
  title: z.string().min(1, "Titel erforderlich"),
  content: z.string().min(1, "Inhalt erforderlich"),
  isActive: z.boolean().optional().default(false),
});

export type GdprVersionFormData = z.infer<typeof gdprVersionFormSchema>;

/**
 * Default form values for creating a new GDPR version.
 */
const emptyFormValues: GdprVersionFormData = {
  version: "",
  title: "",
  content: "",
  isActive: false,
};

interface GdprVersionFormProps {
  /** Optional version ID for edit mode */
  versionId?: string;
  /** Optional initial values for edit mode */
  defaultValues?: Partial<GdprVersionFormData>;
  /** Optional callback after successful submission */
  onSuccess?: (versionId: string) => void;
  /** Optional callback when cancel button is clicked */
  onCancel?: () => void;
  /** Optional URL to redirect to after successful submission */
  redirectOnSuccess?: string;
}

/**
 * GDPR version form component with React Hook Form and Zod validation.
 *
 * Features:
 * - Create mode for new GDPR versions
 * - Zod validation with German error messages
 * - Toast notifications for success/error
 * - Loading state during submission
 * - Cancel button with navigation
 * - Markdown content support in textarea
 */
export function GdprVersionForm({
  versionId,
  defaultValues,
  onSuccess,
  onCancel,
  redirectOnSuccess,
}: GdprVersionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!versionId;

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<GdprVersionFormData>({
    resolver: zodResolver(gdprVersionFormSchema),
    defaultValues: defaultValues || emptyFormValues,
  });

  /**
   * Handle form submission.
   * Creates new GDPR version or updates existing one.
   */
  async function onSubmit(data: GdprVersionFormData) {
    setIsSubmitting(true);

    try {
      let result;

      if (isEditMode && versionId) {
        // Update existing version
        result = await updateGdprVersionAction({
          id: versionId,
          title: data.title,
          content: data.content,
          isActive: data.isActive,
        });
      } else {
        // Create new version
        result = await createGdprVersionAction({
          // version is omitted - will be auto-generated
          title: data.title,
          content: data.content,
          isActive: data.isActive,
        });
      }

      if (result.success && result.data) {
        toast.success(
          isEditMode
            ? "Datenschutzversion erfolgreich aktualisiert"
            : "Datenschutzversion erfolgreich erstellt"
        );
        if (onSuccess) {
          onSuccess(result.data.id);
        } else if (redirectOnSuccess) {
          // Redirect to specified URL
          router.push(redirectOnSuccess);
        } else {
          // Reset form and stay on page (only for create mode)
          if (!isEditMode) {
            form.reset();
          }
        }
      } else {
        toast.error(
          result.error ||
          `Fehler beim ${isEditMode ? 'Aktualisieren' : 'Erstellen'} der Datenschutzversion`
        );
      }
    } catch (error) {
      toast.error(`Ein Fehler ist aufgetreten: ${String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Handle cancel button click.
   */
  function handleCancel() {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Datenschutzversion bearbeiten' : 'Neue Datenschutzversion'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Titel <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Datenschutzerklärung v2.0"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content (Markdown) */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Inhalt <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Datenschutzerklärung hier eingeben (Markdown unterstützt)"
                      className="min-h-[300px] font-mono text-sm"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Markdown-Formatierung wird unterstützt (z.B. **fett**, *kursiv*, ## Überschrift)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Active Checkbox - only show in create mode */}
            {!isEditMode && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Als aktive Version setzen</FormLabel>
                      <FormDescription>
                        Wenn aktiviert, wird diese Version zur aktuellen Datenschutzerklärung für alle neuen Unterschriften.
                        Vorherige aktive Versionen werden deaktiviert.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {/* Form actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  "Speichern"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
