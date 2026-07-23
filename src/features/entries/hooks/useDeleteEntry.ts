"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api";
import { deleteEntry } from "../services/entries.service";

export function useDeleteEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.entries.delete,
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
      notifications.show({
        color: "green",
        title: "Удалено",
        message: "Запись удалена",
      });
    },
    onError: (err) => {
      notifications.show({
        color: "orange",
        title: "Ошибка",
        message: err instanceof Error ? err.message : "Не удалось удалить запись",
      });
    },
  });
}
