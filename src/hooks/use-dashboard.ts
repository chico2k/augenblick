/**
 * Dashboard Hooks
 *
 * React Query hooks for dashboard data fetching.
 * Includes income stats, appointments, and GDPR status checks.
 */

import { useQuery } from '@tanstack/react-query';
import {
  getDailyIncomeAction,
  getUpcomingAppointmentsAction,
  getPendingAppointmentsAction,
  getGdprStatusForAppointmentsAction,
} from '@/app/actions/dashboard.actions';
import { queryKeys } from '@/lib/query-keys';

/**
 * Query hook for fetching daily income data.
 *
 * @param startDate - Start date for the income range
 * @param endDate - End date for the income range
 * @returns Query result with daily income data
 *
 * @example
 * ```tsx
 * const { data: dailyIncome = [], isLoading } = useDailyIncome(
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export function useDailyIncome(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: queryKeys.income.daily(startDate, endDate),
    queryFn: async () => {
      const result = await getDailyIncomeAction(
        startDate.toISOString(),
        endDate.toISOString()
      );
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch daily income');
      }
      return result.data;
    },
  });
}

/**
 * Query hook for fetching upcoming appointments.
 *
 * @param limit - Maximum number of appointments to fetch (default: 5)
 * @returns Query result with upcoming appointments
 *
 * @example
 * ```tsx
 * const { data: upcomingAppointments = [], isLoading } = useUpcomingAppointments(5);
 * ```
 */
export function useUpcomingAppointments(limit = 5) {
  return useQuery({
    queryKey: queryKeys.outlook.upcoming(limit),
    queryFn: async () => {
      const result = await getUpcomingAppointmentsAction(limit);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch upcoming appointments');
      }
      return result.data;
    },
  });
}

/**
 * Query hook for fetching pending appointments.
 *
 * @returns Query result with pending appointments
 *
 * @example
 * ```tsx
 * const { data: pendingAppointments = [], isLoading } = usePendingAppointments();
 * ```
 */
export function usePendingAppointments() {
  return useQuery({
    queryKey: queryKeys.outlook.pending(),
    queryFn: async () => {
      const result = await getPendingAppointmentsAction();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch pending appointments');
      }
      return result.data;
    },
  });
}

/**
 * Query hook for checking GDPR signature status for appointments.
 * This hook performs an optimized single-query check for multiple appointments.
 *
 * @param appointmentIds - Array of appointment IDs to check
 * @returns Query result with GDPR status information
 *
 * @example
 * ```tsx
 * const { data: gdprStatus } = useGdprStatusForAppointments(['apt-1', 'apt-2']);
 * const appointmentsNeedingGdpr = new Set(gdprStatus?.appointmentsNeedingGdpr ?? []);
 * ```
 */
export function useGdprStatusForAppointments(appointmentIds: string[]) {
  return useQuery({
    queryKey: queryKeys.dashboard.gdprStatus(appointmentIds),
    queryFn: async () => {
      const result = await getGdprStatusForAppointmentsAction(appointmentIds);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch GDPR status');
      }
      return result.data;
    },
    enabled: appointmentIds.length > 0,
  });
}
