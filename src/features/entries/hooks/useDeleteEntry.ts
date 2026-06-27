"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEntry } from "../services/entries.service";

export function useDeleteEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["entries", "delete"],
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] }),
  });
}
