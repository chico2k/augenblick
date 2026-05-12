"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import type { OutlookAppointment } from "@/lib/db/schema";

interface DataTableProps<TValue> {
  columns: ColumnDef<OutlookAppointment, TValue>[];
  data: OutlookAppointment[];
}

type DateRangeFilter = {
  from?: string;
  to?: string;
};

const defaultColumnFilters: ColumnFiltersState = [
  { id: "state", value: "pending" },
];

export function DataTable<TValue>({ columns, data }: DataTableProps<TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startTime", desc: false },
  ]);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(defaultColumnFilters);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const statusFilter = table.getColumn("state")?.getFilterValue() as
    | string
    | undefined;
  const subjectFilter =
    (table.getColumn("subject")?.getFilterValue() as string | undefined) ?? "";
  const dateRange =
    (table.getColumn("startTime")?.getFilterValue() as
      | DateRangeFilter
      | undefined) ?? {};
  const filteredCount = table.getFilteredRowModel().rows.length;
  const totalCount = table.getPreFilteredRowModel().rows.length;

  const handleStatusFilterChange = (value: string) => {
    table
      .getColumn("state")
      ?.setFilterValue(value === "all" ? undefined : value);
  };

  const handleDateRangeChange = (partialRange: DateRangeFilter) => {
    const nextRange = { ...dateRange, ...partialRange };

    if (!nextRange.from && !nextRange.to) {
      table.getColumn("startTime")?.setFilterValue(undefined);
      return;
    }

    table.getColumn("startTime")?.setFilterValue(nextRange);
  };

  const resetFilters = () => {
    setColumnFilters(defaultColumnFilters);
    setSorting([{ id: "startTime", desc: false }]);
    table.setPageIndex(0);
  };

  if (data.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        Keine Termine
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/20 grid gap-3 rounded-md border p-3 md:grid-cols-[minmax(180px,1.3fr)_160px_repeat(2,minmax(140px,1fr))_auto] md:items-end">
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Termin
          </label>
          <Input
            placeholder="Termin suchen..."
            value={subjectFilter}
            onChange={(event) =>
              table.getColumn("subject")?.setFilterValue(event.target.value)
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Status
          </label>
          <Select
            value={statusFilter ?? "all"}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Offen</SelectItem>
              <SelectItem value="confirmed">Bestätigt</SelectItem>
              <SelectItem value="dismissed">Privat</SelectItem>
              <SelectItem value="cancelled">Storniert</SelectItem>
              <SelectItem value="all">Alle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Von
          </label>
          <Input
            type="date"
            value={dateRange.from ?? ""}
            onChange={(event) =>
              handleDateRangeChange({ from: event.target.value || undefined })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Bis
          </label>
          <Input
            type="date"
            value={dateRange.to ?? ""}
            onChange={(event) =>
              handleDateRangeChange({ to: event.target.value || undefined })
            }
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
          className="md:self-end"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Zurücksetzen
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  Keine Termine gefunden
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          {filteredCount} von {totalCount} Terminen
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / Seite</SelectItem>
              <SelectItem value="25">25 / Seite</SelectItem>
              <SelectItem value="50">50 / Seite</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Zurück
            </Button>
            <span className="min-w-24 text-center">
              Seite {table.getState().pagination.pageIndex + 1} von{" "}
              {table.getPageCount() || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Weiter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
