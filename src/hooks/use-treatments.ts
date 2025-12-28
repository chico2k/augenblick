/**
 * Treatment Hooks
 *
 * React Query hooks for treatments data fetching and mutations.
 * Includes optimistic updates for instant UI feedback.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTreatmentsAction,
  deleteTreatmentAction,
} from '@/app/actions/treatment.actions';
import { queryKeys } from '@/lib/query-keys';
import type { TreatmentTableData } from '@/components/treatments/treatment-table';

/**
 * Query hook for fetching treatments list.
 *
 * @returns Query result with treatments data and loading state
 *
 * @example
 * ```tsx
 * const { data: treatments = [], isLoading } = useTreatments();
 * ```
 */
export function useTreatments() {
  return useQuery({
    queryKey: queryKeys.treatments.lists(),
    queryFn: async () => {
      const result = await getTreatmentsAction();
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch treatments');
      }
      return result.data as TreatmentTableData[];
    },
  });
}

/**
 * Mutation hook for deleting a treatment.
 * Implements optimistic updates with automatic rollback on error.
 *
 * @returns Mutation object with mutate function
 *
 * @example
 * ```tsx
 * const deleteMutation = useDeleteTreatment();
 *
 * deleteMutation.mutate(treatmentId, {
 *   onSuccess: () => toast.success("Deleted"),
 *   onError: (error) => toast.error(error.message),
 * });
 * ```
 */
export function useDeleteTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTreatmentAction(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete treatment');
      }
      return result;
    },
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: queryKeys.treatments.lists() });

      // Snapshot previous value for rollback
      const previousTreatments = queryClient.getQueryData<TreatmentTableData[]>(
        queryKeys.treatments.lists()
      );

      // Optimistically remove treatment from cache
      queryClient.setQueryData<TreatmentTableData[]>(
        queryKeys.treatments.lists(),
        (old) => old?.filter((t) => t.id !== deletedId) ?? []
      );

      return { previousTreatments };
    },
    onError: (_err, _deletedId, context) => {
      // Rollback to previous state on error
      if (context?.previousTreatments) {
        queryClient.setQueryData(
          queryKeys.treatments.lists(),
          context.previousTreatments
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure cache consistency
      void queryClient.invalidateQueries({ queryKey: queryKeys.treatments.lists() });
    },
  });
}
