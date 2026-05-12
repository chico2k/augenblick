import { ExpenseManager } from "@/components/expenses/expense-manager";
import { expenseService } from "@/lib/services/expense.service";
import { isErrResult } from "@/lib/services/types";

export default async function AusgabenPage() {
  const [typesResult, entriesResult] = await Promise.all([
    expenseService.listTypes(),
    expenseService.listEntries(1000),
  ]);

  const expenseTypes = isErrResult(typesResult) ? [] : typesResult.value;
  const entries = isErrResult(entriesResult) ? [] : entriesResult.value;

  return <ExpenseManager expenseTypes={expenseTypes} entries={entries} />;
}
