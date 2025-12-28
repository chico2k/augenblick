"use client";

/**
 * EÜR Dashboard Component
 * Main dashboard showing stats, pending appointments, and recent income.
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileDown, Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppointmentsTable } from "./appointments-table";
import { ConfirmationSheet } from "./ConfirmationSheet";
import {
  dismissAppointmentAction,
  revertToPendingAction,
  cancelAppointmentAction,
  uncancelAppointmentAction
} from "@/app/actions/outlook.actions";
import type {
  OutlookAppointment,
  TreatmentType,
  Customer,
  SyncStatus as SyncStatusType,
} from "@/lib/db/schema";

interface DashboardProps {
  initialStats: {
    weeklyTotal: number;
    monthlyTotal: number;
    weeklyCount: number;
    monthlyCount: number;
  };
  initialAllAppointments: OutlookAppointment[];
  initialPendingCount: number;
  treatmentTypes: TreatmentType[];
  customers: Customer[];
  syncStatus: SyncStatusType | null;
  isOutlookConfigured: boolean;
}

/**
 * Format currency in German format.
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function Dashboard({
  initialStats,
  initialAllAppointments,
  initialPendingCount,
  treatmentTypes,
  customers,
  syncStatus,
  isOutlookConfigured,
}: DashboardProps) {
  const router = useRouter();
  const [stats, setStats] = useState(initialStats);
  const [allAppointments, setAllAppointments] = useState(initialAllAppointments);
  const [pendingCount, setPendingCount] = useState(initialPendingCount);
  const [selectedAppointment, setSelectedAppointment] = useState<OutlookAppointment | null>(null);

  const handleConfirmAppointment = (appointmentId: string) => {
    const appointment = allAppointments.find((a) => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
    }
  };

  const handleDismissAppointment = async (appointmentId: string) => {
    const result = await dismissAppointmentAction(appointmentId);
    if (result.success) {
      // Update the appointment status in the list
      setAllAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: 'dismissed' as const } : a))
      );
      // Update pending count
      setPendingCount((prev) => Math.max(0, prev - 1));
      toast.success("Termin als privat markiert");
    } else {
      toast.error(result.error || "Fehler beim Ablehnen");
    }
  };

  const handleRevertAppointment = async (appointmentId: string) => {
    const result = await revertToPendingAction(appointmentId);
    if (result.success) {
      // Update the appointment status in the list
      setAllAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: 'pending' as const, confirmedAt: null } : a))
      );
      // Update pending count (increment for reverted appointments)
      setPendingCount((prev) => prev + 1);
      toast.success("Termin wiederhergestellt");
      router.refresh();
    } else {
      toast.error(result.error || "Fehler beim Wiederherstellen");
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    // TODO: Add dialog for cancellation reason
    const reason = prompt("Grund für Stornierung (optional):");

    const result = await cancelAppointmentAction(appointmentId, reason || undefined);
    if (result.success) {
      // Update the appointment in the list
      setAllAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, cancelled: true, cancelledReason: reason || null, cancelledAt: new Date() } : a))
      );
      toast.success("Termin storniert");
      router.refresh();
    } else {
      toast.error(result.error || "Fehler beim Stornieren");
    }
  };

  const handleUncancelAppointment = async (appointmentId: string) => {
    const result = await uncancelAppointmentAction(appointmentId);
    if (result.success) {
      // Update the appointment in the list
      setAllAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, cancelled: false, cancelledReason: null, cancelledAt: null } : a))
      );
      toast.success("Stornierung rückgängig gemacht");
      router.refresh();
    } else {
      toast.error(result.error || "Fehler beim Wiederherstellen");
    }
  };

  const handleConfirmed = useCallback(() => {
    // Update appointment status and refresh data
    if (selectedAppointment) {
      setAllAppointments((prev) =>
        prev.map((a) => (a.id === selectedAppointment.id ? { ...a, status: 'confirmed' as const } : a))
      );
      setPendingCount((prev) => Math.max(0, prev - 1));
    }
    setSelectedAppointment(null);
    router.refresh();
  }, [selectedAppointment, router]);

  const handleSyncComplete = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Appointments */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Termine</h2>
          {pendingCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-primary px-2.5 py-0.5 text-sm font-medium text-primary-foreground">
              {pendingCount}
            </span>
          )}
        </div>
        <AppointmentsTable
          appointments={allAppointments}
          onConfirm={handleConfirmAppointment}
          onDismiss={(id) => void handleDismissAppointment(id)}
          onCancel={(id) => void handleCancelAppointment(id)}
          onRevert={(id) => void handleRevertAppointment(id)}
          onUncancel={(id) => void handleUncancelAppointment(id)}
        />
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => router.push("/office/export")}
          title="Export"
        >
          <FileDown className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => router.push("/office/behandlungen")}
          title="Behandlungen verwalten"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Confirmation Sheet */}
      <ConfirmationSheet
        appointment={selectedAppointment}
        treatmentTypes={treatmentTypes}
        customers={customers}
        onClose={() => setSelectedAppointment(null)}
        onConfirmed={handleConfirmed}
      />
    </div>
  );
}
