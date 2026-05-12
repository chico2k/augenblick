"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ExpenseType } from "@/lib/db/schema";
import {
  createExpenseTypeAction,
  deleteExpenseTypeAction,
} from "@/app/actions/expense.actions";
import { getTypeAccent } from "@/components/expenses/expense-type-color";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface ExpenseTypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseTypes: ExpenseType[];
}

export function ExpenseTypesDialog({
  open,
  onOpenChange,
  expenseTypes,
}: ExpenseTypesDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [typeName, setTypeName] = useState("");
  const [typeToDelete, setTypeToDelete] = useState<ExpenseType | null>(null);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = typeName.trim();
    if (!name) return;

    startTransition(async () => {
      const result = await createExpenseTypeAction({ name });
      if (!result.success) {
        toast.error(result.error || "Ausgabentyp konnte nicht gespeichert werden");
        return;
      }
      setTypeName("");
      toast.success("Ausgabentyp gespeichert");
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!typeToDelete) return;
    const id = typeToDelete.id;

    startTransition(async () => {
      const result = await deleteExpenseTypeAction(id);
      if (!result.success) {
        toast.error(result.error || "Ausgabentyp konnte nicht gelöscht werden");
        setTypeToDelete(null);
        return;
      }
      toast.success("Ausgabentyp gelöscht");
      setTypeToDelete(null);
      router.refresh();
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl tracking-tight">
              <Tags className="h-5 w-5 text-primary" />
              Ausgabentypen
            </DialogTitle>
            <DialogDescription>
              Verwalte die Kategorien, mit denen du Ausgaben einordnest.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="flex gap-2 pt-2">
            <Input
              value={typeName}
              onChange={(event) => setTypeName(event.target.value)}
              placeholder="z.B. Material, Werbung, Miete…"
              className="h-11"
              maxLength={80}
              required
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 shrink-0"
              disabled={isPending || !typeName.trim()}
              title="Typ hinzufügen"
              aria-label="Typ hinzufügen"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          <div className="-mx-6 mt-1 max-h-[340px] overflow-y-auto border-t">
            {expenseTypes.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Tags className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Noch keine Typen angelegt
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {expenseTypes.map((type) => {
                  const accent = getTypeAccent(type.id);
                  return (
                    <li
                      key={type.id}
                      className="group flex items-center gap-3 px-6 py-3 transition-colors hover:bg-muted/40"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${accent.dot}`}
                        aria-hidden
                      />
                      <span className="flex-1 text-sm font-medium">
                        {type.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                        disabled={isPending}
                        onClick={() => setTypeToDelete(type)}
                        title="Typ löschen"
                        aria-label={`${type.name} löschen`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={typeToDelete !== null}
        onOpenChange={(open) => !open && setTypeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Typ löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              {`„${typeToDelete?.name ?? ""}" wird entfernt. Bestehende Ausgaben mit diesem Typ behalten ihren Betrag und ihr Datum, werden aber als „Ohne Typ" angezeigt.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
