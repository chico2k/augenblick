"use client";

import { useState } from "react";
import { Loader2, Check, Pencil, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn, formatDate } from "../../lib/utils";
import { setActiveVersionAction } from "../../app/actions/gdpr.actions";
import { GdprVersionForm } from "./gdpr-version-form";

/**
 * GDPR version data type matching the GdprVersion from schema.
 */
export interface GdprVersionData {
  id: string;
  version: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
}

interface GdprVersionListProps {
  /** List of GDPR versions to display */
  versions: GdprVersionData[];
  /** Optional action button to display in the toolbar */
  actionButton?: React.ReactNode;
  /** Optional className for styling */
  className?: string;
}

/**
 * GDPR version list component displaying versions with activate button.
 *
 * Features:
 * - List of all GDPR versions
 * - Active version highlighted with green badge
 * - Activate button for inactive versions
 * - Loading state during activation
 * - German labels
 */
export function GdprVersionList({ versions, actionButton, className }: GdprVersionListProps) {
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /**
   * Handle activating a GDPR version.
   */
  const handleActivate = async (versionId: string) => {
    setActivatingId(versionId);

    try {
      const result = await setActiveVersionAction({ id: versionId });

      if (result.success) {
        toast.success("Datenschutzversion aktiviert");
      } else {
        toast.error(result.error || "Fehler beim Aktivieren der Version");
      }
    } catch (error) {
      toast.error(`Fehler: ${String(error)}`);
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Action button toolbar */}
      {actionButton && (
        <div className="flex justify-end">
          {actionButton}
        </div>
      )}

      {/* Version list */}
      {versions.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Keine Datenschutzversionen vorhanden.
        </p>
      ) : (
        <div className="space-y-4">
          {versions.map((version) => {
            const isActivating = activatingId === version.id;
            const isEditing = editingId === version.id;
            const isExpanded = expandedId === version.id;

            return (
              <Collapsible
                key={version.id}
                open={isEditing}
                onOpenChange={(open) => setEditingId(open ? version.id : null)}
              >
                <div
                  className={cn(
                    "rounded-lg border",
                    version.isActive && "border-green-500 bg-green-50 dark:bg-green-950/20"
                  )}
                >
                  {/* Version header */}
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Version info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.title}</span>
                        {version.isActive && (
                          <Badge
                            variant="default"
                            className="bg-green-500 hover:bg-green-500/80"
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Aktiv
                          </Badge>
                        )}
                      </div>

                      {/* Collapsible details */}
                      <Collapsible
                        open={isExpanded}
                        onOpenChange={(open) => setExpandedId(open ? version.id : null)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Version {version.version}
                          </span>
                          <CollapsibleTrigger asChild>
                            <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                              <ChevronDown className={cn(
                                "h-3 w-3 transition-transform",
                                isExpanded && "rotate-180"
                              )} />
                              Details
                            </button>
                          </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="mt-1">
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div>Erstellt: {formatDate(version.createdAt)}</div>
                            <div className="line-clamp-2">
                              {version.content.substring(0, 150)}...
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 self-start sm:self-center">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          {isEditing ? 'Abbrechen' : 'Bearbeiten'}
                        </Button>
                      </CollapsibleTrigger>

                      {!version.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleActivate(version.id)}
                          disabled={isActivating}
                        >
                          {isActivating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Wird aktiviert...
                            </>
                          ) : (
                            "Aktivieren"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Edit form (collapsible) */}
                  <CollapsibleContent>
                    <div className="border-t p-4">
                      <GdprVersionForm
                        versionId={version.id}
                        defaultValues={{
                          title: version.title,
                          content: version.content,
                          isActive: version.isActive,
                        }}
                        onSuccess={() => setEditingId(null)}
                        onCancel={() => setEditingId(null)}
                      />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}
