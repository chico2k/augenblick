"use client";

/**
 * Sync Logs Page (with React Query)
 * Shows Outlook calendar sync history and allows manual sync.
 */

import { RefreshCw, CheckCircle2, XCircle, Clock, Loader2, ChevronDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  getSyncLogsAction,
  triggerSyncAction,
} from "@/app/actions/sync.actions";
import type { SyncLog } from "@/lib/db/schema";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Format duration between two dates.
 */
function formatDuration(start: Date, end: Date | null): string {
  if (!end) return "laufend...";
  const ms = end.getTime() - start.getTime();
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

/**
 * Format date/time in German.
 */
function formatDateTime(date: Date): string {
  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get status badge variant and label.
 */
function getStatusBadge(status: SyncLog["status"]) {
  switch (status) {
    case "success":
      return {
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        label: "Erfolgreich",
        className: "bg-green-500 hover:bg-green-500/80 text-white",
      };
    case "error":
      return {
        icon: <XCircle className="h-3.5 w-3.5" />,
        label: "Fehler",
        className: "bg-red-500 hover:bg-red-500/80 text-white",
      };
    case "in_progress":
      return {
        icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
        label: "Läuft",
        className: "bg-blue-500 hover:bg-blue-500/80 text-white",
      };
    case "cancelled":
      return {
        icon: <XCircle className="h-3.5 w-3.5" />,
        label: "Abgebrochen",
        className: "bg-gray-500 hover:bg-gray-500/80 text-white",
      };
  }
}

/**
 * Sync Log Item Component
 */
function SyncLogItem({ log }: { log: SyncLog }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusBadge = getStatusBadge(log.status);

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Time and Status */}
      <div className="flex items-center gap-2 lg:flex-1 min-w-0">
        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <span className="font-medium text-sm">
            {formatDateTime(log.syncStartedAt)}
          </span>
          <Badge variant="default" className={statusBadge.className}>
            {statusBadge.icon}
            <span className="ml-1">{statusBadge.label}</span>
          </Badge>
          {log.message && (
            <span className="text-sm text-muted-foreground">
              {log.message}
            </span>
          )}

        </div>
      </div>

      {/* Right: Stats */}
      <div className="flex gap-4 text-sm lg:flex-shrink-0">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Importiert</span>
          <span className="font-medium text-green-600">
            {log.appointmentsImported}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Übersprungen</span>
          <span className="font-medium text-gray-600">
            {log.appointmentsSkipped}
          </span>
        </div>
        {log.appointmentsFailed > 0 && (
          <div className="flex flex-col">
            <span className="text-muted-foreground">Fehler</span>
            <span className="font-medium text-red-600">
              {log.appointmentsFailed}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-muted-foreground">Dauer</span>
          <span className="font-medium">
            {formatDuration(log.syncStartedAt, log.syncEndedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SyncPage() {
  const queryClient = useQueryClient();

  // Fetch sync logs with React Query
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sync-logs"],
    queryFn: async () => {
      const result = await getSyncLogsAction({ page: 1, limit: 50 });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data!;
    },
  });

  // Manual sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const result = await triggerSyncAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Synchronisierung erfolgreich");
      // Invalidate and refetch logs
      void queryClient.invalidateQueries({ queryKey: ["sync-logs"] });
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Synchronisieren");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>
            {error.message || "Fehler beim Laden der Sync-Logs"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Manual sync button */}
      <div className="flex justify-end">
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          {syncMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Synchronisiert...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Jetzt synchronisieren
            </>
          )}
        </Button>
      </div>

      {/* Sync History */}
      <div>
        {!data || data.items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Noch keine Synchronisierungen durchgeführt
          </p>
        ) : (
          <div className="space-y-4">
            {data.items.map((log) => (
              <SyncLogItem key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
