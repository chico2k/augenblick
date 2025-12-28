import { IncomeChart } from "@/components/euer/IncomeChart";
import { PendingAppointmentsCard } from "@/components/dashboard/PendingAppointmentsCard";
import { UpcomingAppointmentsCard } from "@/components/dashboard/UpcomingAppointmentsCard";
import { incomeService } from "@/lib/services/income.service";
import { outlookService } from "@/lib/services/outlook.service";
import { treatmentService } from "@/lib/services/treatment.service";
import { customerService } from "@/lib/services/customer.service";
import { isOkResult } from "@/lib/services/types";
import { db } from "@/lib/db";
import { signatures, incomeEntries } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export default async function OfficePage() {
  // Get daily income data for chart (last 90 days)
  const now = new Date();
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(now.getDate() - 90);
  const dailyIncomeResult = await incomeService.getDailyTotals(ninetyDaysAgo, now);
  const dailyIncomeData = isOkResult(dailyIncomeResult) ? dailyIncomeResult.value : [];

  // Get upcoming appointments
  const upcomingResult = await outlookService.getUpcoming(5);
  const upcomingAppointments = isOkResult(upcomingResult) ? upcomingResult.value : [];

  // Get pending appointments (need to be confirmed)
  const pendingResult = await outlookService.getPending();
  const pendingAppointments = isOkResult(pendingResult) ? pendingResult.value.slice(0, 5) : [];

  // Get treatment types for confirmation sheet
  const treatmentsResult = await treatmentService.getActive();
  const treatmentTypes = isOkResult(treatmentsResult) ? treatmentsResult.value : [];

  // Get customers for confirmation sheet
  const customersResult = await customerService.list({ page: 1, limit: 100 });
  const customers = isOkResult(customersResult) ? customersResult.value.items : [];

  // Check which appointments have customers without GDPR signatures
  const appointmentCustomerMap = new Map<string, string>(); // appointmentId -> customerId
  const customersWithoutGdpr = new Set<string>();

  // Get customer IDs from income entries for upcoming appointments
  for (const appointment of upcomingAppointments) {
    const incomeResult = await db
      .select({ customerId: incomeEntries.customerId })
      .from(incomeEntries)
      .where(and(
        eq(incomeEntries.appointmentId, appointment.id),
        isNull(incomeEntries.deletedAt)
      ))
      .limit(1);

    if (incomeResult.length > 0 && incomeResult[0]!.customerId) {
      const customerId = incomeResult[0]!.customerId;
      appointmentCustomerMap.set(appointment.id, customerId);

      // Check if customer has GDPR signature
      const signatureResult = await db
        .select({ id: signatures.id })
        .from(signatures)
        .where(eq(signatures.customerId, customerId))
        .limit(1);

      if (signatureResult.length === 0) {
        customersWithoutGdpr.add(customerId);
      }
    }
  }

  // Create a set of appointment IDs that need GDPR warning
  const appointmentsNeedingGdpr = new Set<string>();
  for (const [appointmentId, customerId] of appointmentCustomerMap) {
    if (customersWithoutGdpr.has(customerId)) {
      appointmentsNeedingGdpr.add(appointmentId);
    }
  }

  return (
    <div className="space-y-6">
      {/* Income Chart */}
      <IncomeChart data={dailyIncomeData} />

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
