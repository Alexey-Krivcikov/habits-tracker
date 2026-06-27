"use client";

import { useQuery } from "@tanstack/react-query";
import { getEntries } from "../services/entries.service";

export function useFetchEntries() {
  return useQuery({
    queryKey: ["entries"],
    queryFn: () => getEntries(),
  });
}
