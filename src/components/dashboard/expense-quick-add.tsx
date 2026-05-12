"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ExpenseEntryDialog } from "@/components/expenses/expense-entry-dialog";
import { Button } from "@/components/ui/button";
import { useExpenseTypes } from "@/hooks/use-expenses";

export function ExpenseQuickAdd() {
  const [open, setOpen] = useState(false);
  const { data: expenseTypes = [] } = useExpenseTypes();

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Neue Ausgabe
      </Button>

      <ExpenseEntryDialog
        open={open}
        onOpenChange={setOpen}
        expenseTypes={expenseTypes}
      />
    </>
  );
}
