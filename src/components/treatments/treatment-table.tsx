"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

/**
 * Treatment data type for the table.
 */
export interface TreatmentTableData {
  id: string;
  name: string;
  description: string | null;
  defaultPrice: string;
  isActive: boolean;
  sortOrder: string;
  createdAt: Date;
}

interface TreatmentTableProps {
  /** Treatment data to display */
  data: TreatmentTableData[];
  /** Optional action button to display in the toolbar */
  actionButton?: React.ReactNode;
  /** Callback when delete button is clicked */
  onDelete?: (id: string) => void;
}

/**
 * Format currency in German format.
 */
function formatCurrency(amount: string): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(parseFloat(amount));
}

/**
 * Treatment table component with TanStack Table and search.
 */
export function TreatmentTable({
  data,
  actionButton,
  onDelete,
}: TreatmentTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  // Define columns for the table
  const columns = useMemo<ColumnDef<TreatmentTableData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Behandlungsart",
        cell: ({ row }) => {
          const name = row.original.name;
          const description = row.original.description;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{name}</span>
              {description && (
                <span className="text-sm text-muted-foreground">
                  {description}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "defaultPrice",
        header: "Preis",
        cell: ({ row }) => (
          <span className="font-medium text-fuchsia-700">
            {formatCurrency(row.original.defaultPrice)}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={cn(
                isActive
                  ? "bg-green-600 hover:bg-green-600/80"
                  : "bg-gray-500 hover:bg-gray-500/80 text-white"
              )}
            >
              {isActive ? "Aktiv" : "Inaktiv"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(row.original.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Behandlungsart suchen..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 min-h-11"
          />
        </div>
        {actionButton}
      </div>

      {/* Table */}
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
                  className="h-24 text-center text-muted-foreground"
                >
                  {globalFilter
                    ? "Keine Behandlungsarten gefunden"
                    : "Noch keine Behandlungsarten angelegt"}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-default"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta && typeof cell.column.columnDef.meta === 'object' && 'className' in cell.column.columnDef.meta
                          ? String(cell.column.columnDef.meta.className)
                          : undefined
                      )}
                    >
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

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Seite {table.getState().pagination.pageIndex + 1} von{" "}
            {table.getPageCount()}
          </div>
          <div className="flex gap-2">
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
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
