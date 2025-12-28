"use client";

/**
 * Confirmation Sheet Component
 * Bottom sheet for confirming an appointment with price and treatment selection.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, Ban } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { confirmAppointmentAction, getIncomeByAppointmentAction } from "@/app/actions/income.actions";
import { createCustomerAction } from "@/app/actions/customer.actions";
import { cancelAppointmentAction, dismissAppointmentAction } from "@/app/actions/outlook.actions";
import type { OutlookAppointment, TreatmentType, Customer } from "@/lib/db/schema";

interface ConfirmationSheetProps {
  appointment: OutlookAppointment | null;
  treatmentTypes: TreatmentType[];
  customers: Customer[];
  onClose: () => void;
  onConfirmed: () => void;
}

export function ConfirmationSheet({
  appointment,
  treatmentTypes,
  customers,
  onClose,
  onConfirmed,
}: ConfirmationSheetProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [treatmentTypeId, setTreatmentTypeId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [cancelReason, setCancelReason] = useState("");

  // Quick add customer state
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [newCustomerFirstName, setNewCustomerFirstName] = useState("");
  const [newCustomerLastName, setNewCustomerLastName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  // Load existing income data when appointment changes using React Query
  const { data: existingIncome, isLoading: isLoadingIncome } = useQuery({
    queryKey: ["income", appointment?.id],
    queryFn: async () => {
      if (!appointment) return null;
      const result = await getIncomeByAppointmentAction(appointment.id);
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    },
    enabled: !!appointment,
  });

  // Update form when existing income data loads
  useEffect(() => {
    if (existingIncome) {
      setAmount(existingIncome.amount);
      setTreatmentTypeId(existingIncome.treatmentTypeId ?? "");
      setCustomerId(existingIncome.customerId ?? "");
    } else if (appointment && !isLoadingIncome) {
      // No existing entry and done loading, reset form
      setAmount("");
      setTreatmentTypeId("");
      setCustomerId("");
    }
  }, [existingIncome, appointment, isLoadingIncome]);

  // Reset form when appointment changes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setAmount("");
      setTreatmentTypeId("");
      setCustomerId("");
      setCancelReason("");
      setShowCancelForm(false);
    }
  };

  // Auto-fill price when treatment type selected
  const handleTreatmentChange = (value: string) => {
    setTreatmentTypeId(value);
    const treatment = treatmentTypes.find((t) => t.id === value);
    if (treatment && !amount) {
      setAmount(treatment.defaultPrice);
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomerFirstName || !newCustomerLastName) {
      toast.error("Vorname und Nachname sind erforderlich");
      return;
    }

    setIsCreatingCustomer(true);
    try {
      const result = await createCustomerAction({
        firstName: newCustomerFirstName,
        lastName: newCustomerLastName,
        email: newCustomerEmail || undefined,
        phone: newCustomerPhone || undefined,
        status: "active",
        isRegularCustomer: false,
      });

      if (result.success && result.data) {
        toast.success("Kunde erfolgreich angelegt");
        setCustomerId(result.data.id);
        setShowAddCustomer(false);
        setNewCustomerFirstName("");
        setNewCustomerLastName("");
        setNewCustomerEmail("");
        setNewCustomerPhone("");
        // Refresh to get updated customer list
        router.refresh();
      } else {
        toast.error(result.error || "Fehler beim Anlegen des Kunden");
      }
    } catch (error) {
      toast.error(`Fehler: ${String(error)}`);
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  const handleSubmit = async () => {
    if (!appointment) return;

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Bitte geben Sie einen Betrag ein");
      return;
    }

    if (!customerId) {
      toast.error("Bitte wählen Sie einen Kunden aus");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await confirmAppointmentAction({
        appointmentId: appointment.id,
        amount,
        treatmentTypeId: treatmentTypeId || null,
        customerId: customerId,
        paymentMethod: "cash", // Default to cash since we removed the selector
      });

      if (result.success) {
        toast.success("Gespeichert");
        onConfirmed();
        handleOpenChange(false);
      } else {
        toast.error(result.error || "Fehler beim Speichern");
      }
    } catch (error) {
      toast.error(`Fehler: ${String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelForm(true);
  };

  const handleCancelConfirm = async () => {
    if (!appointment || !cancelReason) {
      toast.error("Bitte wählen Sie einen Grund aus");
      return;
    }

    setIsCancelling(true);
    try {
      const result = await cancelAppointmentAction(
        appointment.id,
        cancelReason
      );

      if (result.success) {
        toast.success("Termin storniert");
        onConfirmed();
        handleOpenChange(false);
      } else {
        toast.error(result.error || "Fehler beim Stornieren");
      }
    } catch (error) {
      toast.error(`Fehler: ${String(error)}`);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelAbort = () => {
    setShowCancelForm(false);
    setCancelReason("");
  };

  const handleDismiss = async () => {
    if (!appointment) return;

    setIsDismissing(true);
    try {
      const result = await dismissAppointmentAction(appointment.id);

      if (result.success) {
        toast.success("Als privat markiert");
        onConfirmed();
        handleOpenChange(false);
      } else {
        toast.error(result.error || "Fehler beim Markieren");
      }
    } catch (error) {
      toast.error(`Fehler: ${String(error)}`);
    } finally {
      setIsDismissing(false);
    }
  };

  return (
    <Sheet open={!!appointment} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[90vh] max-w-2xl mx-auto">
        <SheetHeader>
          <SheetTitle>Termin bestätigen</SheetTitle>
        </SheetHeader>

        {appointment && (
          <div className="mt-4 space-y-4">
            {/* Appointment Info */}
            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">{appointment.subject}</p>
              <p className="text-sm text-muted-foreground">
                {appointment.startTime.toLocaleDateString("de-DE")} um{" "}
                {appointment.startTime.toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Loading State */}
            {isLoadingIncome ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Lade Daten...
                </span>
              </div>
            ) : (
              <>
                {/* Treatment Type */}
                <div className="space-y-2">
              <Label htmlFor="treatmentType">Behandlung</Label>
              <Select value={treatmentTypeId} onValueChange={handleTreatmentChange}>
                <SelectTrigger id="treatmentType" className="min-h-11">
                  <SelectValue placeholder="Behandlung wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {treatmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} (€{parseFloat(type.defaultPrice).toFixed(2).replace(".", ",")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                Betrag (€) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="min-h-11 text-lg"
                required
              />
            </div>

            {/* Customer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="customer">
                  Kunde <span className="text-red-500">*</span>
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setShowAddCustomer(true)}
                  className="text-xs"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1" />
                  Neuen Kunden anlegen
                </Button>
              </div>
              <Select value={customerId} onValueChange={setCustomerId} required>
                <SelectTrigger id="customer" className="min-h-11">
                  <SelectValue placeholder="Kunde wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            {!showCancelForm ? (
              /* Initial state: Show all three buttons in one row */
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleDismiss()}
                  disabled={isSubmitting || isDismissing || isCancelling}
                >
                  {isDismissing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Privat"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelClick}
                  disabled={isSubmitting || isDismissing}
                >
                  <Ban className="mr-1 h-3.5 w-3.5" />
                  Stornieren
                </Button>
                <Button
                  size="sm"
                  onClick={() => void handleSubmit()}
                  disabled={isSubmitting || isDismissing || !amount || !customerId}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Speichern"
                  )}
                </Button>
              </div>
            ) : (
              /* Cancellation form: Show reason selection and confirm buttons */
              <div className="space-y-3 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="cancelReason">
                    Stornierungsgrund <span className="text-red-500">*</span>
                  </Label>
                  <Select value={cancelReason} onValueChange={setCancelReason} required>
                    <SelectTrigger id="cancelReason" className="min-h-11">
                      <SelectValue placeholder="Grund auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abgesagt durch Kundin">
                        Abgesagt durch Kundin
                      </SelectItem>
                      <SelectItem value="Nicht erschienen">
                        Nicht erschienen
                      </SelectItem>
                      <SelectItem value="Abgesagt durch Sandra">
                        Abgesagt durch Sandra
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelAbort}
                    disabled={isCancelling}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => void handleCancelConfirm()}
                    disabled={isCancelling || !cancelReason}
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Stornieren...
                      </>
                    ) : (
                      "Stornierung bestätigen"
                    )}
                  </Button>
                </div>
              </div>
            )}
              </>
            )}
          </div>
        )}
      </SheetContent>

      {/* Quick Add Customer Dialog */}
      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Kunden anlegen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname *</Label>
                <Input
                  id="firstName"
                  value={newCustomerFirstName}
                  onChange={(e) => setNewCustomerFirstName(e.target.value)}
                  placeholder="Vorname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname *</Label>
                <Input
                  id="lastName"
                  value={newCustomerLastName}
                  onChange={(e) => setNewCustomerLastName(e.target.value)}
                  placeholder="Nachname"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
                placeholder="email@beispiel.de"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                placeholder="+49 123 456789"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddCustomer(false)}
                disabled={isCreatingCustomer}
              >
                Abbrechen
              </Button>
              <Button
                className="flex-1"
                onClick={() => void handleCreateCustomer()}
                disabled={isCreatingCustomer || !newCustomerFirstName || !newCustomerLastName}
              >
                {isCreatingCustomer ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird angelegt...
                  </>
                ) : (
                  "Kunde anlegen"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
