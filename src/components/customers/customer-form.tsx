"use client";

/**
 * Customer Form Component
 * Reusable form for creating and editing customers with Zod validation.
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
  createCustomerAction,
  updateCustomerAction,
} from "../../app/actions/customer.actions";

/**
 * Zod schema for customer form validation.
 * - firstName and lastName are required
 * - email is optional but must be valid if provided
 * - phone and notes are optional
 * - isRegularCustomer defaults to false
 * - status defaults to "active"
 */
export const customerFormSchema = z.object({
  firstName: z.string().min(1, "Vorname erforderlich"),
  lastName: z.string().min(1, "Nachname erforderlich"),
  email: z.string().email("Ungültige E-Mail").or(z.literal("")).optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  isRegularCustomer: z.boolean().default(false),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;

/**
 * Default form values for creating a new customer.
 */
const defaultFormValues: CustomerFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
  isRegularCustomer: false,
  status: "active",
};

interface CustomerFormProps {
  /** Form mode: create or edit */
  mode: "create" | "edit";
  /** Customer ID for edit mode */
  customerId?: string;
  /** Default values for the form (for edit mode) */
  defaultValues?: Partial<CustomerFormData>;
  /** Optional callback after successful submission */
  onSuccess?: (customerId: string) => void;
  /** Optional callback when cancel button is clicked */
  onCancel?: () => void;
}

/**
 * Customer form component with React Hook Form and Zod validation.
 *
 * Features:
 * - Create and edit modes
 * - Zod validation with German error messages
 * - Toast notifications for success/error
 * - Loading state during submission
 * - Cancel button with navigation
 */
export function CustomerForm({
  mode,
  customerId,
  defaultValues,
  onSuccess,
  onCancel,
}: CustomerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  });

  /**
   * Handle form submission.
   * Creates or updates customer based on mode.
   */
  async function onSubmit(data: CustomerFormData) {
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        // Create new customer
        const result = await createCustomerAction(data);

        if (result.success && result.data) {
          toast.success("Kunde erfolgreich erstellt");
          if (onSuccess) {
            onSuccess(result.data.id);
          } else {
            router.push("/office/kunden");
          }
        } else {
          toast.error(result.error || "Fehler beim Erstellen des Kunden");
        }
      } else {
        // Update existing customer
        if (!customerId) {
          toast.error("Kunden-ID fehlt");
          return;
        }

        const result = await updateCustomerAction({
          id: customerId,
          ...data,
        });

        if (result.success) {
          toast.success("Kunde erfolgreich aktualisiert");
          if (onSuccess) {
            onSuccess(customerId);
          } else {
            router.push(`/office/kunden/${customerId}`);
          }
        } else {
          toast.error(result.error || "Fehler beim Aktualisieren des Kunden");
        }
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
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        {mode === "create" ? "Neuer Kunde" : "Kunde bearbeiten"}
      </h2>
      <Form {...form}>
        <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }} className="space-y-6">
            {/* Name fields - grid layout */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Vorname <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Vorname eingeben"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nachname <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nachname eingeben"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="E-Mail eingeben"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Telefon eingeben"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notizen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optionale Notizen zum Kunden"
                      className="min-h-[100px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status fields - grid layout */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Regular Customer Checkbox */}
              <FormField
                control={form.control}
                name="isRegularCustomer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Stammkundin</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {/* Status Dropdown */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Aktiv</SelectItem>
                        <SelectItem value="inactive">Inaktiv</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
    </div>
  );
}
