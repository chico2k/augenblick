"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  Clock,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { OutlookAppointment } from "@/lib/db/schema";

type DateRangeFilter = {
  from?: string;
  to?: string;
};

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

function SortableHeader<TValue>({
  column,
  title,
}: {
  column: Column<OutlookAppointment, TValue>;
  title: string;
}) {
  const sortDirection = column.getIsSorted();
  const SortIcon =
    sortDirection === "asc"
      ? ArrowUp
      : sortDirection === "desc"
      ? ArrowDown
      : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      className="-ml-3 h-8 px-3"
      onClick={() => column.toggleSorting(sortDirection === "asc")}
    >
      {title}
      <SortIcon className="ml-2 h-3.5 w-3.5" />
    </Button>
  );
}

function AppointmentActionButton({
  label,
  tooltip,
  icon,
  variant = "outline",
  className,
  disabled,
  onClick,
}: {
  label: string;
  tooltip: string;
  icon: ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="sm"
          className={cn("min-w-24 h-8 px-3 text-xs", className)}
          onClick={onClick}
          disabled={disabled}
          aria-label={tooltip}
        >
          {icon}
          <span>{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
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
      id: "state",
      accessorFn: (row) => (row.cancelled ? "cancelled" : row.status),
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status;
        const cancelled = row.original.cancelled;

        // Show cancelled status with higher priority
        if (cancelled) {
          return (
            <div className="flex flex-col gap-1">
              <Badge variant="destructive">Storniert</Badge>
              {row.original.cancelledReason && (
                <span className="text-muted-foreground text-xs">
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
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "subject",
      header: ({ column }) => <SortableHeader column={column} title="Termin" />,
      cell: ({ row }) => (
        <div className="max-w-[360px] truncate font-medium">
          {row.original.subject}
        </div>
      ),
      filterFn: "includesString",
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "startTime",
      header: ({ column }) => <SortableHeader column={column} title="Datum" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="text-muted-foreground h-3.5 w-3.5" />
          <span>{formatDate(row.original.startTime)}</span>
        </div>
      ),
      filterFn: (row, _id, value: DateRangeFilter | undefined) => {
        if (!value?.from && !value?.to) return true;

        const startTime = row.original.startTime.getTime();
        const fromTime = value.from
          ? new Date(`${value.from}T00:00:00`).getTime()
          : null;
        const toTime = value.to
          ? new Date(`${value.to}T23:59:59.999`).getTime()
          : null;

        return (
          (fromTime === null || startTime >= fromTime) &&
          (toTime === null || startTime <= toTime)
        );
      },
      sortingFn: "datetime",
    },
    {
      id: "time",
      accessorFn: (row) => row.startTime,
      header: ({ column }) => (
        <SortableHeader column={column} title="Uhrzeit" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm">
          <Clock className="text-muted-foreground h-3.5 w-3.5" />
          <span>
            {formatTime(row.original.startTime)} -{" "}
            {formatTime(row.original.endTime)}
          </span>
        </div>
      ),
      sortingFn: "datetime",
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aktionen</div>,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const isLoading = loadingId === row.original.id;
        const status = row.original.status;
        const cancelled = row.original.cancelled;

        // For cancelled appointments: show Uncancel button
        if (cancelled) {
          return (
            <TooltipProvider delayDuration={200}>
              <div className="flex justify-end">
                <AppointmentActionButton
                  label="Wiederherstellen"
                  tooltip="Stornierung rückgängig machen"
                  icon={<RotateCcw />}
                  disabled={isLoading}
                  onClick={() => {
                    setLoadingId(row.original.id);
                    try {
                      onUncancel(row.original.id);
                    } finally {
                      setLoadingId(null);
                    }
                  }}
                />
              </div>
            </TooltipProvider>
          );
        }

        // For pending appointments: show Dismiss and Confirm buttons
        if (status === "pending") {
          return (
            <div className="flex justify-end">
              <TooltipProvider delayDuration={200}>
                <div className="bg-background inline-flex items-center gap-2 rounded-md border p-1 shadow-sm">
                  <AppointmentActionButton
                    label="Privat"
                    tooltip="Als privaten Termin markieren"
                    icon={<X />}
                    variant="outline"
                    className="text-muted-foreground hover:border-input hover:text-foreground border-transparent shadow-none"
                    disabled={isLoading}
                    onClick={() => {
                      setLoadingId(row.original.id);
                      try {
                        onDismiss(row.original.id);
                      } finally {
                        setLoadingId(null);
                      }
                    }}
                  />
                  <AppointmentActionButton
                    label="Verarbeiten"
                    tooltip="Einnahme aus diesem Termin erfassen"
                    icon={<Check />}
                    variant="default"
                    disabled={isLoading}
                    onClick={() => {
                      setLoadingId(row.original.id);
                      try {
                        onConfirm(row.original.id);
                      } finally {
                        setLoadingId(null);
                      }
                    }}
                  />
                </div>
              </TooltipProvider>
            </div>
          );
        }

        // For confirmed appointments: show Revert button
        if (status === "confirmed") {
          return (
            <TooltipProvider delayDuration={200}>
              <div className="flex justify-end">
                <AppointmentActionButton
                  label="Rückgängig"
                  tooltip="Zurück zu offenen Terminen"
                  icon={<RotateCcw />}
                  disabled={isLoading}
                  onClick={() => {
                    setLoadingId(row.original.id);
                    try {
                      onRevert(row.original.id);
                    } finally {
                      setLoadingId(null);
                    }
                  }}
                />
              </div>
            </TooltipProvider>
          );
        }

        // For dismissed appointments: show Revert button
        if (status === "dismissed") {
          return (
            <TooltipProvider delayDuration={200}>
              <div className="flex justify-end">
                <AppointmentActionButton
                  label="Rückgängig"
                  tooltip="Zurück zu offenen Terminen"
                  icon={<RotateCcw />}
                  disabled={isLoading}
                  onClick={() => {
                    setLoadingId(row.original.id);
                    try {
                      onRevert(row.original.id);
                    } finally {
                      setLoadingId(null);
                    }
                  }}
                />
              </div>
            </TooltipProvider>
          );
        }

        return <span className="text-muted-foreground text-sm">-</span>;
      },
    },
  ];
}
