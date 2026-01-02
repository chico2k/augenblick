/**
 * Customer Hooks
 *
 * React Query hooks for customer data fetching.
 * Includes customer list and detail views with audit logs.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomersListAction,
  getCustomerDetailAction,
  createCustomerAction,
  updateCustomerAction,
  deleteCustomerAction,
} from '@/app/actions/customer.actions';
import { queryKeys } from '@/lib/query-keys';
import type { CustomerFormData } from '@/components/customers/customer-form';

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

/**
 * Mutation hook for creating a customer.
 * Invalidates cache on success.
 *
 * @returns Mutation object with mutate function and created customer ID
 *
 * @example
 * ```tsx
 * const createMutation = useCreateCustomer();
 *
 * createMutation.mutate(formData, {
 *   onSuccess: (data) => router.push(`/office/kunden/${data.id}`),
 *   onError: (error) => toast.error(error.message),
 * });
 * ```
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerFormData) => {
      const result = await createCustomerAction(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Fehler beim Erstellen des Kunden');
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate customers list to trigger refetch
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
    },
  });
}

/**
 * Mutation hook for updating a customer.
 * Invalidates cache on success.
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const updateMutation = useUpdateCustomer();
 *
 * updateMutation.mutate({ id: customerId, ...formData }, {
 *   onSuccess: () => router.push(`/office/kunden/${customerId}`),
 *   onError: (error) => toast.error(error.message),
 * });
 * ```
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerFormData & { id: string }) => {
      const result = await updateCustomerAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Fehler beim Aktualisieren des Kunden');
      }
      return result.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate both list and detail queries
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(variables.id) });
    },
  });
}

/**
 * Mutation hook for deleting a customer.
 * Invalidates cache on success.
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const deleteMutation = useDeleteCustomer();
 *
 * deleteMutation.mutate(customerId, {
 *   onSuccess: () => router.push('/office/kunden'),
 *   onError: (error) => toast.error(error.message),
 * });
 * ```
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCustomerAction({ id });
      if (!result.success) {
        throw new Error(result.error || 'Fehler beim Löschen des Kunden');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate customers list to trigger refetch
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
    },
  });
}
