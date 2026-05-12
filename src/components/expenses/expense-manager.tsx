"use client";

import { useState } from "react";
import { Tags } from "lucide-react";
import type { ExpenseType } from "@/lib/db/schema";
import type { ExpenseEntryWithType } from "@/lib/services/expense.service";
import { ExpenseChart } from "@/components/expenses/expense-chart";
import { ExpenseEntryDialog } from "@/components/expenses/expense-entry-dialog";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { ExpenseTypesDialog } from "@/components/expenses/expense-types-dialog";
import { Button } from "@/components/ui/button";

interface ExpenseManagerProps {
  expenseTypes: ExpenseType[];
  entries: ExpenseEntryWithType[];
}

export function ExpenseManager({
  expenseTypes,
  entries,
}: ExpenseManagerProps) {
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [typesDialogOpen, setTypesDialogOpen] = useState(false);

  const hasTypes = expenseTypes.length > 0;

  const openEntryDialog = () => {
    if (!hasTypes) {
      setTypesDialogOpen(true);
      return;
    }
    setEntryDialogOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Ausgaben</h1>
          <p className="text-sm text-muted-foreground">
            Buchhaltung und Belege — gruppiert nach Monat.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setTypesDialogOpen(true)}
          >
            Ausgaben Typen
          </Button>
          <Button onClick={openEntryDialog}>Neue Ausgabe</Button>
        </div>
      </div>

      <ExpenseChart entries={entries} expenseTypes={expenseTypes} />

      {!hasTypes && entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card">
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
              <Tags className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                Zuerst Typen anlegen
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {`Jede Ausgabe braucht einen Typ. Lege Kategorien wie „Material", „Werbung" oder „Miete" an, um loszulegen.`}
              </p>
            </div>
            <Button
              onClick={() => setTypesDialogOpen(true)}
              className="mt-2"
            >
              Neuer Ausgaben Typ
            </Button>
          </div>
        </div>
      ) : (
        <ExpenseTable entries={entries} expenseTypes={expenseTypes} />
      )}

      <ExpenseEntryDialog
        open={entryDialogOpen}
        onOpenChange={setEntryDialogOpen}
        expenseTypes={expenseTypes}
      />

      <ExpenseTypesDialog
        open={typesDialogOpen}
        onOpenChange={setTypesDialogOpen}
        expenseTypes={expenseTypes}
      />
    </div>
  );
}
