"use client";

import { useQuery } from "@tanstack/react-query";
import type { Entry } from "@/features";
import { queryKeys } from "@/shared/api";
import { getEntries } from "../services/entries.service";

export function useFetchEntries(initialData?: Entry[]) {
  return useQuery({
    queryKey: queryKeys.entries.all,
    queryFn: () => getEntries(),
    initialData,
  });
}
