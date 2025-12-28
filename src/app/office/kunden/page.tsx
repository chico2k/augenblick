import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { customerService } from "@/lib/services/customer.service";
import { isErrResult } from "@/lib/services/types";
import { CustomerTable, type CustomerTableData } from "@/components/customers/customer-table";
import { CustomerTableSkeleton } from "@/components/customers/customer-table-skeleton";
import { Button } from "@/components/ui/button";

/**
 * Fetches customers with signature status from the database.
 */
async function getCustomers(): Promise<CustomerTableData[]> {
  const result = await customerService.list({ page: 1, limit: 1000 });

  if (isErrResult(result)) {
    // Return empty array on error - table will show "Keine Kunden gefunden"
    return [];
  }

  return result.value.items;
}

/**
 * Server component that fetches and displays customer data.
 */
async function CustomerListContent({
  actionButton,
}: {
  actionButton?: React.ReactNode;
}) {
  const customers = await getCustomers();
  return <CustomerTable data={customers} actionButton={actionButton} />;
}

/**
 * Customer List Page
 *
 * Displays a table of all customers with search and signature status filtering.
 * Uses master layout pattern: breadcrumb in header, toolbar with filters and action button.
 */
export default function KundenPage() {
  return (
    <Suspense fallback={<CustomerTableSkeleton rowCount={10} />}>
      <CustomerListContent
        actionButton={
          <Link href="/office/kunden/neu">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Kunde
            </Button>
          </Link>
        }
      />
    </Suspense>
  );
}
