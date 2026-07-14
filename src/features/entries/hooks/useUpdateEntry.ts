"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EntryFormValues } from "@/features";
import { updateEntry } from "../services/entries.service";

export function useUpdateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["entries", "update"],
    mutationFn: ({ id, data }: { id: string; data: EntryFormValues }) => updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      notifications.show({
        color: "green",
        title: "Обновлено",
        message: "Запись обновлена",
      });
    },
  });
}
