"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, Check, X, RotateCcw, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OutlookAppointment } from "@/lib/db/schema";

/**
 * Format date in German.
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format time in German.
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getColumns(
  onConfirm: (appointmentId: string) => void,
  onDismiss: (appointmentId: string) => void,
  onCancel: (appointmentId: string) => void,
  onRevert: (appointmentId: string) => void,
  onUncancel: (appointmentId: string) => void,
  loadingId: string | null,
  setLoadingId: (id: string | null) => void
): ColumnDef<OutlookAppointment>[] {
  return [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const cancelled = row.original.cancelled;

        // Show cancelled status with higher priority
        if (cancelled) {
          return (
            <div className="flex flex-col gap-1">
              <Badge variant="destructive">Storniert</Badge>
              {row.original.cancelledReason && (
                <span className="text-xs text-muted-foreground">
                  {row.original.cancelledReason}
                </span>
              )}
            </div>
          );
        }

        const statusConfig = {
          pending: { label: "Offen", variant: "outline" as const },
          confirmed: { label: "Bestätigt", variant: "default" as const },
          dismissed: { label: "Privat", variant: "secondary" as const },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
      filterFn: (row, id, value) => {
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: "subject",
      header: "Termin",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.subject}</div>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Datum",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{formatDate(row.original.startTime)}</span>
        </div>
      ),
    },
    {
      id: "time",
      header: "Uhrzeit",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            {formatTime(row.original.startTime)} - {formatTime(row.original.endTime)}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aktionen",
      cell: ({ row }) => {
        const isLoading = loadingId === row.original.id;
        const status = row.original.status;
        const cancelled = row.original.cancelled;

        // For cancelled appointments: show Uncancel button
        if (cancelled) {
          return (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setLoadingId(row.original.id);
                try {
                  onUncancel(row.original.id);
                } finally {
                  setLoadingId(null);
                }
              }}
              disabled={isLoading}
              title="Stornierung rückgängig machen"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="ml-1 hidden lg:inline text-xs">Wiederherstellen</span>
            </Button>
          );
        }

        // For pending appointments: show Dismiss and Confirm buttons
        if (status === "pending") {
          return (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setLoadingId(row.original.id);
                  try {
                    onDismiss(row.original.id);
                  } finally {
                    setLoadingId(null);
                  }
                }}
                disabled={isLoading}
                title="Als privaten Termin markieren"
              >
                <X className="h-3.5 w-3.5" />
                <span className="ml-1 hidden lg:inline text-xs">Privat</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setLoadingId(row.original.id);
                  try {
                    onConfirm(row.original.id);
                  } finally {
                    setLoadingId(null);
                  }
                }}
                disabled={isLoading}
                title="Einnahme verarbeiten"
              >
                <Check className="h-3.5 w-3.5" />
                <span className="ml-1 hidden lg:inline text-xs">Verarbeiten</span>
              </Button>
            </div>
          );
        }

        // For confirmed appointments: show Revert button
        if (status === "confirmed") {
          return (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setLoadingId(row.original.id);
                try {
                  onRevert(row.original.id);
                } finally {
                  setLoadingId(null);
                }
              }}
              disabled={isLoading}
              title="Zurück zu offenen Terminen"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="ml-1 hidden lg:inline text-xs">Rückgängig</span>
            </Button>
          );
        }

        // For dismissed appointments: show Revert button
        if (status === "dismissed") {
          return (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setLoadingId(row.original.id);
                try {
                  onRevert(row.original.id);
                } finally {
                  setLoadingId(null);
                }
              }}
              disabled={isLoading}
              title="Zurück zu offenen Terminen"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="ml-1 hidden lg:inline text-xs">Rückgängig</span>
            </Button>
          );
        }

        return <span className="text-muted-foreground text-sm">-</span>;
      },
    },
  ];
}
