"use client";

import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EntryFormValues } from "@/features";
import { createEntry } from "../services/entries.service";

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["entries", "create"],
    mutationFn: (data: EntryFormValues) => createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      notifications.show({
        color: "green",
        title: "Сохранено",
        message: "Запись создана",
      });
    },
  });
}
