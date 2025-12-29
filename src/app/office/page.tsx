"use client";

/**
 * Office Dashboard Page
 * Client component that displays income chart and appointment cards.
 * Uses React Query for client-side caching and optimized data fetching.
 */

import { useMemo } from "react";
import {
  useDailyIncome,
  useUpcomingAppointments,
  usePendingAppointments,
  useGdprStatusForAppointments,
} from "@/hooks/use-dashboard";
import { useActiveTreatments } from "@/hooks/use-treatments";
import { useCustomersList } from "@/hooks/use-customers";
import { IncomeChart } from "@/components/euer/IncomeChart";
import { PendingAppointmentsCard } from "@/components/dashboard/PendingAppointmentsCard";
import { UpcomingAppointmentsCard } from "@/components/dashboard/UpcomingAppointmentsCard";

export default function OfficePage() {
  // Calculate date range for income chart (last 90 days)
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 90);
    return { startDate: start, endDate: end };
  }, []);

  // Phase 1: Independent queries
  const { data: dailyIncome = [], isLoading: loadingIncome } =
    useDailyIncome(startDate, endDate);

  const { data: upcomingAppointments = [], isLoading: loadingUpcoming } =
    useUpcomingAppointments(5);

  const { data: pendingAppointments = [], isLoading: loadingPending } =
    usePendingAppointments();

  const { data: treatmentTypes = [] } = useActiveTreatments();
  const { data: customers = [] } = useCustomersList();

  // Phase 2: Dependent query (only when we have appointments)
  const appointmentIds = useMemo(
    () => upcomingAppointments.map((a) => a.id),
    [upcomingAppointments]
  );

  const { data: gdprStatus } = useGdprStatusForAppointments(appointmentIds);

  // Derive appointmentsNeedingGdpr Set
  const appointmentsNeedingGdpr = useMemo(() => {
    if (!gdprStatus) return new Set<string>();
    return new Set(gdprStatus.appointmentsNeedingGdpr);
  }, [gdprStatus]);

  const isLoading = loadingIncome || loadingUpcoming || loadingPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-[400px] animate-pulse bg-muted rounded-lg" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
          <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Income Chart */}
      <IncomeChart data={dailyIncome} />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Appointments */}
        <PendingAppointmentsCard
          appointments={pendingAppointments}
          treatmentTypes={treatmentTypes}
          customers={customers}
        />

        {/* Upcoming Appointments */}
        <UpcomingAppointmentsCard
          appointments={upcomingAppointments}
          treatmentTypes={treatmentTypes}
          customers={customers}
          appointmentsNeedingGdpr={appointmentsNeedingGdpr}
        />
      </div>
    </div>
  );
}
