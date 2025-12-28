"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

/**
 * Customer data type with signature status.
 * Matches the CustomerWithSignatureStatus from customer.service.ts
 */
export interface CustomerTableData {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  isRegularCustomer: boolean;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  hasSignedCurrentVersion: boolean;
  lastSignedAt: Date | null;
  lastSignedVersionId: string | null;
}

type SignatureStatusFilter = "all" | "signed" | "unsigned";

interface CustomerTableProps {
  /** Customer data to display */
  data: CustomerTableData[];
  /** Optional initial search value */
  initialSearch?: string;
  /** Optional initial filter value */
  initialFilter?: SignatureStatusFilter;
  /** Optional action button to display in the toolbar */
  actionButton?: React.ReactNode;
}

/**
 * Customer table component with TanStack Table, search, and signature status filtering.
 *
 * Features:
 * - Global search by name, phone, email
 * - Filter by signature status (all, signed, unsigned)
 * - Clickable rows to navigate to customer detail
 * - Mobile-responsive with hidden columns on smaller screens
 * - German labels
 */
export function CustomerTable({
  data,
  initialSearch = "",
  initialFilter = "all",
  actionButton,
}: CustomerTableProps) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState(initialSearch);
  const [signatureFilter, setSignatureFilter] = useState<SignatureStatusFilter>(initialFilter);

  // Define columns for the table
  const columns = useMemo<ColumnDef<CustomerTableData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => {
          const firstName = row.original.firstName;
          const lastName = row.original.lastName;
          const phone = row.original.phone;
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {firstName} {lastName}
              </span>
              {/* Show phone on mobile */}
              {phone && (
                <span className="text-sm text-muted-foreground sm:hidden">
                  {phone}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "Telefon",
        cell: ({ row }) => row.original.phone || "-",
        meta: {
          className: "hidden sm:table-cell",
        },
      },
      {
        accessorKey: "email",
        header: "E-Mail",
        cell: ({ row }) => row.original.email || "-",
        meta: {
          className: "hidden md:table-cell",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const isRegular = row.original.isRegularCustomer;
          return (
            <div className="flex items-center gap-2">
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                className={cn(
                  status === "active"
                    ? "bg-green-600 hover:bg-green-600/80"
                    : "bg-gray-500 hover:bg-gray-500/80 text-white"
                )}
              >
                {status === "active" ? "Aktiv" : "Inaktiv"}
              </Badge>
              {isRegular && (
                <Badge variant="outline" className="bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200">
                  Stamm
                </Badge>
              )}
            </div>
          );
        },
        meta: {
          className: "hidden md:table-cell",
        },
      },
      {
        accessorKey: "hasSignedCurrentVersion",
        header: "DSGVO",
        cell: ({ row }) => {
          const hasSigned = row.original.hasSignedCurrentVersion;
          return (
            <Badge
              variant={hasSigned ? "default" : "secondary"}
              className={cn(
                hasSigned
                  ? "bg-green-500 hover:bg-green-500/80"
                  : "bg-orange-500 hover:bg-orange-500/80 text-white"
              )}
            >
              {hasSigned ? "OK" : "Fehlt"}
            </Badge>
          );
        },
      },
    ],
    []
  );

  // Filter data by signature status (before passing to table)
  const filteredBySignature = useMemo(() => {
    if (signatureFilter === "all") {
      return data;
    }
    return data.filter((customer) =>
      signatureFilter === "signed"
        ? customer.hasSignedCurrentVersion
        : !customer.hasSignedCurrentVersion
    );
  }, [data, signatureFilter]);

  // Create the table instance
  const table = useReactTable({
    data: filteredBySignature,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  // Handle row click to navigate to customer detail
  const handleRowClick = (customerId: string) => {
    router.push(`/office/kunden/${customerId}`);
  };

  return (
    <div className="space-y-4">
      {/* Search, filter, and action controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: Search and filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search input */}
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Signature status filter */}
          <Select
            value={signatureFilter}
            onValueChange={(value: SignatureStatusFilter) => setSignatureFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kunden</SelectItem>
              <SelectItem value="signed">Mit Unterschrift</SelectItem>
              <SelectItem value="unsigned">Ohne Unterschrift</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right side: Action button */}
        {actionButton}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { className?: string }
                    | undefined;
                  return (
                    <TableHead
                      key={header.id}
                      className={meta?.className}
                    >
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
                  className="h-24 text-center"
                >
                  Keine Kunden gefunden
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleRowClick(row.original.id)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as
                        | { className?: string }
                        | undefined;
                      return (
                        <TableCell
                          key={cell.id}
                          className={meta?.className}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Result count */}
        <div className="text-sm text-muted-foreground">
          {table.getRowModel().rows.length > 0 ? (
            <>
              Zeige {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} bis{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              von {table.getFilteredRowModel().rows.length} Kunden
            </>
          ) : (
            "Keine Kunden"
          )}
        </div>

        {/* Pagination buttons */}
        {table.getPageCount() > 1 && (
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
            <div className="text-sm text-muted-foreground">
              Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Weiter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
