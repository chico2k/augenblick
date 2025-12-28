"use client";

/**
 * Sync Status Component
 * Shows "Letzter Sync: vor X Minuten" and sync button.
 */

import { useState } from "react";
import { RefreshCw, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { syncOutlookAction } from "@/app/actions/outlook.actions";

interface SyncStatusProps {
  lastSyncAt: Date | null;
  lastSyncStatus: "success" | "error" | "in_progress" | null;
  isConfigured: boolean;
  onSyncComplete?: () => void;
}

/**
 * Format relative time in German.
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "gerade eben";
  if (diffMins < 60) return `vor ${diffMins} ${diffMins === 1 ? "Minute" : "Minuten"}`;
  if (diffHours < 24) return `vor ${diffHours} ${diffHours === 1 ? "Stunde" : "Stunden"}`;
  return `vor ${diffDays} ${diffDays === 1 ? "Tag" : "Tagen"}`;
}

export function SyncStatus({
  lastSyncAt,
  lastSyncStatus,
  isConfigured,
  onSyncComplete,
}: SyncStatusProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncOutlookAction();
      if (result.success && result.data) {
        toast.success(
          `Sync abgeschlossen: ${result.data.imported} neue, ${result.data.updated} aktualisierte Termine`
        );
        onSyncComplete?.();
      } else {
        toast.error(result.error || "Sync fehlgeschlagen");
      }
    } catch (error) {
      toast.error(`Fehler: ${String(error)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span>Outlook nicht konfiguriert</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {lastSyncStatus === "success" && <Check className="h-4 w-4 text-green-500" />}
        {lastSyncStatus === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
        {lastSyncStatus === "in_progress" && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
        <span>
          {lastSyncAt
            ? `Letzter Sync: ${formatRelativeTime(lastSyncAt)}`
            : "Noch nie synchronisiert"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => void handleSync()}
        disabled={isSyncing}
        className="min-h-11 min-w-11"
      >
        {isSyncing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        <span className="ml-2 hidden sm:inline">Sync</span>
      </Button>
    </div>
  );
}
