/**
 * Customer Hooks
 *
 * React Query hooks for customer data fetching.
 * Includes customer list and detail views with audit logs.
 */

import { useQuery } from '@tanstack/react-query';
import {
  getCustomersListAction,
  getCustomerDetailAction,
} from '@/app/actions/customer.actions';
import { queryKeys } from '@/lib/query-keys';

/**
 * Query hook for fetching customers list.
 *
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of items per page (default: 1000)
 * @returns Query result with customers array
 *
 * @example
 * ```tsx
 * const { data: customers = [], isLoading } = useCustomersList();
 * ```
 */
export function useCustomersList(page = 1, limit = 1000) {
  return useQuery({
    queryKey: queryKeys.customers.lists(),
    queryFn: async () => {
      const result = await getCustomersListAction({ page, limit });
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch customers');
      }
      return result.data;
    },
  });
}

/**
 * Query hook for fetching customer detail with audit logs.
 *
 * @param id - Customer ID
 * @returns Query result with customer data and audit entries
 *
 * @example
 * ```tsx
 * const { data, isLoading, isError } = useCustomerDetail(customerId);
 * if (data) {
 *   const { customer, auditEntries } = data;
 * }
 * ```
 */
export function useCustomerDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: async () => {
      const result = await getCustomerDetailAction(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch customer detail');
      }
      return result.data;
    },
  });
}
