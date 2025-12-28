"use client";

/**
 * Audit Log Component
 * Collapsible component that displays customer change history.
 */

import { useState } from "react";
import { ChevronDown, ChevronRight, User, Clock, History } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";

/**
 * Type for audit log action
 */
type AuditAction = "create" | "update" | "delete";

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  id: string;
  customerId: string;
  action: string;
  changes: Record<string, unknown> | null;
  actorId: string | null;
  actorName: string | null;
  createdAt: Date;
}

interface AuditLogProps {
  /** Array of audit log entries to display */
  entries: AuditLogEntry[];
  /** Whether the component starts expanded (default: false) */
  defaultOpen?: boolean;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Get German label for audit action
 */
function getActionLabel(action: string): string {
  const labels: Record<AuditAction, string> = {
    create: "Erstellt",
    update: "Aktualisiert",
    delete: "Gelöscht",
  };
  return labels[action as AuditAction] ?? action;
}

/**
 * Get badge variant for audit action
 */
function getActionVariant(
  action: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (action) {
    case "create":
      return "default";
    case "update":
      return "secondary";
    case "delete":
      return "destructive";
    default:
      return "outline";
  }
}

/**
 * Get German field name for display
 */
function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail",
    phone: "Telefon",
    notes: "Notizen",
  };
  return labels[field] ?? field;
}

/**
 * Format a change value for display
 */
function formatChangeValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "(leer)";
  }
  if (typeof value === "string" && value.length > 50) {
    return value.substring(0, 50) + "...";
  }
  return String(value);
}

/**
 * Component to display a single change (field: old -> new)
 */
function ChangeDetail({
  field,
  change,
}: {
  field: string;
  change: { from?: unknown; to?: unknown };
}) {
  return (
    <div className="text-sm">
      <span className="font-medium text-muted-foreground">
        {getFieldLabel(field)}:
      </span>{" "}
      <span className="line-through text-muted-foreground/60">
        {formatChangeValue(change.from)}
      </span>{" "}
      <span className="text-foreground">&rarr;</span>{" "}
      <span className="font-medium">{formatChangeValue(change.to)}</span>
    </div>
  );
}

/**
 * Component to display a single audit log entry
 */
function AuditLogEntryItem({ entry }: { entry: AuditLogEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChanges =
    entry.changes &&
    typeof entry.changes === "object" &&
    Object.keys(entry.changes).length > 0;

  return (
    <div className="border-b border-border/50 py-3 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        {/* Action and timestamp */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant={getActionVariant(entry.action)} className="text-xs">
              {getActionLabel(entry.action)}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(entry.createdAt)}</span>
          </div>
        </div>

        {/* Actor info */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{entry.actorName ?? "System"}</span>
        </div>
      </div>

      {/* Changes details for update actions */}
      {hasChanges && entry.action === "update" && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-auto px-2 py-1 text-xs"
            >
              {isExpanded ? (
                <ChevronDown className="mr-1 h-3 w-3" />
              ) : (
                <ChevronRight className="mr-1 h-3 w-3" />
              )}
              Änderungen anzeigen
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1 rounded-md bg-muted/50 p-3">
            {Object.entries(entry.changes!).map(([field, change]) => (
              <ChangeDetail
                key={field}
                field={field}
                change={change as { from?: unknown; to?: unknown }}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

/**
 * AuditLog Component
 *
 * A collapsible component that displays the change history of a customer.
 * Shows create, update, and delete actions with timestamps, actor information,
 * and detailed field changes for updates.
 *
 * Features:
 * - Collapsible card to save space
 * - Color-coded action badges (green for create, gray for update, red for delete)
 * - German labels for all UI elements
 * - Expandable change details for update actions
 * - Actor name display (or "System" for automated changes)
 *
 * @param entries - Array of audit log entries
 * @param defaultOpen - Whether the component starts expanded (default: false)
 * @param className - Optional additional CSS classes
 */
export function AuditLog({
  entries,
  defaultOpen = false,
  className,
}: AuditLogProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (entries.length === 0) {
    return null;
  }

  return (
    <Card className={cn(className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between p-0 hover:bg-transparent"
            >
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5" />
                Änderungsverlauf
                <Badge variant="secondary" className="ml-2 text-xs">
                  {entries.length}
                </Badge>
              </CardTitle>
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <AuditLogEntryItem key={entry.id} entry={entry} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
