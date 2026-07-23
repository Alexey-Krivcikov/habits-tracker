"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Entry } from "@/features";
import { queryKeys } from "@/shared/api";
import { getEntriesPaginated } from "../services/entries.service";

interface PaginatedResult {
  entries: Entry[];
  total: number;
}

export function useFetchEntriesPage(page: number, pageSize: number, initialData?: PaginatedResult) {
  return useQuery({
    queryKey: queryKeys.entries.paginated(page, pageSize),
    queryFn: () => getEntriesPaginated(page, pageSize),
    initialData,
    placeholderData: keepPreviousData,
  });
}
