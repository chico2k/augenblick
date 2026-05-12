"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { ExpenseType } from "@/lib/db/schema";
import type { ExpenseEntryWithType } from "@/lib/services/expense.service";
import { deleteExpenseEntryAction } from "@/app/actions/expense.actions";
import { getTypeAccent } from "@/components/expenses/expense-type-color";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExpenseTableProps {
  entries: ExpenseEntryWithType[];
  expenseTypes: ExpenseType[];
}

function formatCurrency(amount: string | number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(typeof amount === "number" ? amount : parseFloat(amount));
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function ExpenseTable({ entries, expenseTypes }: ExpenseTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "expenseDate", desc: true },
  ]);
  const [entryToDelete, setEntryToDelete] =
    useState<ExpenseEntryWithType | null>(null);

  const filteredData = useMemo(() => {
    if (typeFilter === "all") return entries;
    if (typeFilter === "none") {
      return entries.filter((entry) => !entry.expenseType?.id);
    }
    return entries.filter((entry) => entry.expenseType?.id === typeFilter);
  }, [entries, typeFilter]);

  const handleDelete = () => {
    if (!entryToDelete) return;
    const id = entryToDelete.id;

    startTransition(async () => {
      const result = await deleteExpenseEntryAction(id);
      if (!result.success) {
        toast.error(result.error || "Ausgabe konnte nicht gelöscht werden");
        setEntryToDelete(null);
        return;
      }
      toast.success("Ausgabe gelöscht");
      setEntryToDelete(null);
      router.refresh();
    });
  };

  const columns = useMemo<ColumnDef<ExpenseEntryWithType>[]>(
    () => [
      {
        accessorKey: "expenseDate",
        accessorFn: (row) => new Date(row.expenseDate).getTime(),
        sortingFn: "basic",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Datum
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {formatDate(row.original.expenseDate)}
          </span>
        ),
      },
      {
        id: "type",
        accessorFn: (row) => row.expenseType?.name ?? "Ohne Typ",
        header: () => (
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Typ
          </span>
        ),
        cell: ({ row }) => {
          const accent = getTypeAccent(row.original.expenseType?.id);
          return (
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${accent.chip}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
                aria-hidden
              />
              {row.original.expenseType?.name ?? "Ohne Typ"}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        accessorFn: (row) => parseFloat(row.amount),
        sortingFn: "basic",
        header: ({ column }) => (
          <button
            type="button"
            className="flex w-full items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Betrag
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-right font-semibold tabular-nums">
            {formatCurrency(row.original.amount)}
          </div>
        ),
        meta: { className: "text-right" },
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              disabled={isPending}
              onClick={() => setEntryToDelete(row.original)}
              title="Ausgabe löschen"
              aria-label="Ausgabe löschen"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        meta: { className: "w-12" },
      },
    ],
    [isPending]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Suchen…"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-10 pl-9"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-10 w-full sm:w-[180px]">
              <SelectValue placeholder="Alle Typen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              {expenseTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
              <SelectItem value="none">Ohne Typ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted/30 hover:bg-muted/30"
                >
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as
                      | { className?: string }
                      | undefined;
                    return (
                      <TableHead key={header.id} className={meta?.className}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    Keine Ausgaben gefunden
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="group">
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as
                        | { className?: string }
                        | undefined;
                      return (
                        <TableCell key={cell.id} className={meta?.className}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {table.getPageCount() > 1 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground tabular-nums">
              Seite {table.getState().pagination.pageIndex + 1} von{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                Zurück
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Weiter
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={entryToDelete !== null}
        onOpenChange={(open) => !open && setEntryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ausgabe löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              {entryToDelete &&
                `${formatCurrency(entryToDelete.amount)} vom ${formatDate(
                  entryToDelete.expenseDate
                )} wird unwiderruflich entfernt.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
