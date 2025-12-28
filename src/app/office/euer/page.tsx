/**
 * EÜR Dashboard Page
 * Main entry point for the EÜR module.
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { incomeService } from "@/lib/services/income.service";
import { outlookService } from "@/lib/services/outlook.service";
import { treatmentService } from "@/lib/services/treatment.service";
import { customerService } from "@/lib/services/customer.service";
import { isOkResult } from "@/lib/services/types";
import { Dashboard } from "@/components/euer/Dashboard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for dashboard.
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
      <Skeleton className="h-[60px]" />
      <Skeleton className="h-[300px]" />
      <Skeleton className="h-[200px]" />
    </div>
  );
}

/**
 * Fetch all dashboard data.
 */
async function getDashboardData() {
  // Get stats
  const weeklyResult = await incomeService.getWeeklyTotal();
  const monthlyResult = await incomeService.getMonthlyTotal();

  const stats = {
    weeklyTotal: isOkResult(weeklyResult) ? weeklyResult.value.totalAmount : 0,
    monthlyTotal: isOkResult(monthlyResult) ? monthlyResult.value.totalAmount : 0,
    weeklyCount: isOkResult(weeklyResult) ? weeklyResult.value.count : 0,
    monthlyCount: isOkResult(monthlyResult) ? monthlyResult.value.count : 0,
  };

  // Get all appointments
  const allAppointmentsResult = await outlookService.getAll();
  const allAppointments = isOkResult(allAppointmentsResult) ? allAppointmentsResult.value : [];

  // Count pending appointments
  const pendingCount = allAppointments.filter(a => a.status === 'pending').length;

  // Get treatment types
  const treatmentsResult = await treatmentService.getActive();
  const treatmentTypes = isOkResult(treatmentsResult) ? treatmentsResult.value : [];

  // Get customers for selection
  const customersResult = await customerService.list({ page: 1, limit: 100 });
  const customers = isOkResult(customersResult) ? customersResult.value.items : [];

  // Get sync status
  const syncStatusResult = await outlookService.getSyncStatus();
  const syncStatus = isOkResult(syncStatusResult) ? syncStatusResult.value : null;

  // Check if Outlook is configured
  const isOutlookConfigured = outlookService.isConfigured();

  return {
    stats,
    allAppointments,
    pendingCount,
    treatmentTypes,
    customers,
    syncStatus,
    isOutlookConfigured,
  };
}

export default async function EuerDashboardPage() {
  // Auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const data = await getDashboardData();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard
        initialStats={data.stats}
        initialAllAppointments={data.allAppointments}
        initialPendingCount={data.pendingCount}
        treatmentTypes={data.treatmentTypes}
        customers={data.customers}
        syncStatus={data.syncStatus}
        isOutlookConfigured={data.isOutlookConfigured}
      />
    </Suspense>
  );
}
