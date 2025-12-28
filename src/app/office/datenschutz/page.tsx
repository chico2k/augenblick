import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { gdprService } from "@/lib/services/gdpr.service";
import { isErrResult } from "@/lib/services/types";
import {
  GdprVersionList,
  type GdprVersionData,
} from "@/components/gdpr/gdpr-version-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/**
 * Page metadata for GDPR management.
 */
export const metadata = {
  title: "Datenschutzversionen",
  description: "Verwalten Sie Ihre Datenschutzversionen.",
};

/**
 * Loading skeleton for the GDPR version list.
 */
function GdprVersionListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Action button skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Version list skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Fetches all GDPR versions from the database.
 */
async function getGdprVersions(): Promise<GdprVersionData[]> {
  const result = await gdprService.list({ page: 1, limit: 100 });

  if (isErrResult(result)) {
    // Return empty array on error - list will show empty state
    return [];
  }

  return result.value.items;
}

/**
 * Server component that fetches and displays GDPR versions.
 */
async function GdprVersionListContent({
  actionButton,
}: {
  actionButton?: React.ReactNode;
}) {
  const versions = await getGdprVersions();
  return <GdprVersionList versions={versions} actionButton={actionButton} />;
}

/**
 * GDPR Management Page
 *
 * Displays a list of all GDPR versions with the ability to:
 * - View all versions with active status badge
 * - Activate a version
 * - Create new GDPR versions
 * Uses master layout pattern: breadcrumb in header, action button in toolbar.
 */
export default function DatenschutzPage() {
  return (
    <Suspense fallback={<GdprVersionListSkeleton />}>
      <GdprVersionListContent
        actionButton={
          <Link href="/office/datenschutz/neu">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neue Version
            </Button>
          </Link>
        }
      />
    </Suspense>
  );
}
