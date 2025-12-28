/**
 * Query Key Factory
 *
 * Hierarchical query keys for React Query cache management.
 * Enables precise cache invalidation and TypeScript autocomplete.
 */

export const queryKeys = {
  // Treatments
  treatments: {
    all: ['treatments'] as const,
    lists: () => [...queryKeys.treatments.all, 'list'] as const,
    list: (filters?: { isActive?: boolean }) =>
      [...queryKeys.treatments.lists(), { filters }] as const,
    detail: (id: string) => [...queryKeys.treatments.all, 'detail', id] as const,
  },

  // Customers
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters?: { search?: string }) =>
      [...queryKeys.customers.lists(), { filters }] as const,
    detail: (id: string) => [...queryKeys.customers.all, 'detail', id] as const,
  },

  // Appointments
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    pending: () => [...queryKeys.appointments.all, 'pending'] as const,
    stats: () => [...queryKeys.appointments.all, 'stats'] as const,
  },

  // GDPR
  gdpr: {
    all: ['gdpr'] as const,
    versions: () => [...queryKeys.gdpr.all, 'versions'] as const,
    version: (id: string) => [...queryKeys.gdpr.all, 'version', id] as const,
  },

  // Sync Status
  sync: {
    status: () => ['sync', 'status'] as const,
  },
} as const;
