/**
 * Query Utilities
 *
 * Shared utilities for React Query mutations and optimistic updates.
 * Provides reusable patterns for consistent cache management.
 */

import type { QueryClient } from '@tanstack/react-query';

/**
 * Invalidate all related queries after a successful mutation.
 *
 * @param queryClient - The QueryClient instance
 * @param keys - Array of query keys to invalidate
 *
 * @example
 * ```ts
 * await invalidateRelatedQueries(queryClient, [
 *   queryKeys.treatments.all,
 *   queryKeys.appointments.lists()
 * ]);
 * ```
 */
export function invalidateRelatedQueries(
  queryClient: QueryClient,
  keys: readonly unknown[][]
) {
  return Promise.all(
    keys.map((key) => queryClient.invalidateQueries({ queryKey: key }))
  );
}

/**
 * Create an optimistic update for a query.
 * Returns previous data for rollback on error.
 *
 * @param queryClient - The QueryClient instance
 * @param queryKey - The query key to update
 * @param updater - Function that receives old data and returns new data
 * @returns Object containing previous data for rollback
 *
 * @example
 * ```ts
 * const { previousData } = createOptimisticUpdate(
 *   queryClient,
 *   queryKeys.treatments.lists(),
 *   (old) => old?.filter((t) => t.id !== deletedId) ?? []
 * );
 * ```
 */
export function createOptimisticUpdate<TData>(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  updater: (old: TData | undefined) => TData
) {
  const previousData = queryClient.getQueryData<TData>(queryKey);
  queryClient.setQueryData<TData>(queryKey, updater);
  return { previousData };
}

/**
 * Rollback an optimistic update to previous state.
 *
 * @param queryClient - The QueryClient instance
 * @param queryKey - The query key to rollback
 * @param previousData - Previous data to restore
 *
 * @example
 * ```ts
 * rollbackOptimisticUpdate(
 *   queryClient,
 *   queryKeys.treatments.lists(),
 *   context?.previousData
 * );
 * ```
 */
export function rollbackOptimisticUpdate<TData>(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  previousData: TData | undefined
) {
  queryClient.setQueryData(queryKey, previousData);
}
