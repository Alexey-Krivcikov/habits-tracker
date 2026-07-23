"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EntryFormValues } from "@/features";
import { queryKeys } from "@/shared/api";
import { updateEntry } from "../services/entries.service";

export function useUpdateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.entries.update,
    mutationFn: ({ id, data }: { id: string; data: EntryFormValues }) => updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
      notifications.show({
        color: "green",
        title: "Обновлено",
        message: "Запись обновлена",
      });
    },
  });
}
