"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import type { OutlookAppointment } from "@/lib/db/schema";

interface AppointmentsTableProps {
  appointments: OutlookAppointment[];
  onConfirm: (appointmentId: string) => void;
  onDismiss: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
  onRevert: (appointmentId: string) => void;
  onUncancel: (appointmentId: string) => void;
}

export function AppointmentsTable({
  appointments,
  onConfirm,
  onDismiss,
  onCancel,
  onRevert,
  onUncancel,
}: AppointmentsTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const columns = getColumns(onConfirm, onDismiss, onCancel, onRevert, onUncancel, loadingId, setLoadingId);

  return <DataTable columns={columns} data={appointments} />;
}
