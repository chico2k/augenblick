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
    all: ['sync'] as const,
    status: () => ['sync', 'status'] as const,
    logs: (page: number, limit: number) =>
      ['sync', 'logs', { page, limit }] as const,
  },

  // Income
  income: {
    all: ['income'] as const,
    stats: () => [...queryKeys.income.all, 'stats'] as const,
    daily: (startDate: Date, endDate: Date) =>
      [...queryKeys.income.all, 'daily', { startDate: startDate.toISOString(), endDate: endDate.toISOString() }] as const,
    weekly: () => [...queryKeys.income.all, 'weekly'] as const,
    monthly: () => [...queryKeys.income.all, 'monthly'] as const,
  },

  // Outlook
  outlook: {
    all: ['outlook'] as const,
    lists: () => [...queryKeys.outlook.all, 'list'] as const,
    upcoming: (limit: number) => [...queryKeys.outlook.lists(), 'upcoming', { limit }] as const,
    pending: () => [...queryKeys.outlook.lists(), 'pending'] as const,
    allAppointments: () => [...queryKeys.outlook.lists(), 'all'] as const,
    syncStatus: () => [...queryKeys.outlook.all, 'syncStatus'] as const,
  },

  // Audit
  audit: {
    all: ['audit'] as const,
    forCustomer: (customerId: string, page: number, limit: number) =>
      [...queryKeys.audit.all, 'customer', customerId, { page, limit }] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    gdprStatus: (appointmentIds: string[]) =>
      [...queryKeys.dashboard.all, 'gdpr-status', { appointmentIds }] as const,
  },
} as const;
