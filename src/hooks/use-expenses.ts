import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpenseTypeAction,
  listExpenseTypesAction,
} from "@/app/actions/expense.actions";
import { queryKeys } from "@/lib/query-keys";

export function useExpenseTypes() {
  return useQuery({
    queryKey: queryKeys.expenses.types(),
    queryFn: async () => {
      const result = await listExpenseTypesAction();
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch expense types");
      }
      return result.data;
    },
  });
}

export function useCreateExpenseType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name: string }) => {
      const result = await createExpenseTypeAction(input);
      if (!result.success) {
        throw new Error(result.error || "Failed to create expense type");
      }
      return result;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.types(),
      });
    },
  });
}
