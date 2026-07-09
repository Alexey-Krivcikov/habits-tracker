"use client";

import { useQuery } from "@tanstack/react-query";
import type { Entry } from "@/features";
import { getEntries } from "../services/entries.service";

export function useFetchEntries(initialData?: Entry[]) {
  return useQuery({
    queryKey: ["entries"],
    queryFn: () => getEntries(),
    initialData,
  });
}
