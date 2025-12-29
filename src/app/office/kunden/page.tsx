"use client";

/**
 * Customer List Page
 *
 * Displays a table of all customers with search and signature status filtering.
 * Uses React Query for client-side caching and optimized data fetching.
 */

import Link from "next/link";
import { Plus, AlertCircle } from "lucide-react";
import { useCustomersList } from "@/hooks/use-customers";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerTableSkeleton } from "@/components/customers/customer-table-skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function KundenPage() {
  const { data: customers = [], isLoading, isError, error } = useCustomersList();

  if (isLoading) {
    return <CustomerTableSkeleton rowCount={10} />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fehler</AlertTitle>
        <AlertDescription>
          {error?.message || "Fehler beim Laden der Kunden"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <CustomerTable
      data={customers}
      actionButton={
        <Link href="/office/kunden/neu">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Kunde
          </Button>
        </Link>
      }
    />
  );
}
