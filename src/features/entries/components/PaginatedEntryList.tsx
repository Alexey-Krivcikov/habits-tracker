"use client";

import { Alert, Loader, Pagination, Text } from "@mantine/core";
import { useState } from "react";
import { type Entry, EntryCard, useDeleteEntry, useFetchEntriesPage } from "@/features";
import styles from "./EntryList.module.scss";
import pageStyles from "./PaginatedEntryList.module.scss";

interface PaginatedEntryListProps {
  initialEntries: Entry[];
  total: number;
  pageSize?: number;
}

export function PaginatedEntryList({ initialEntries, total, pageSize = 12 }: PaginatedEntryListProps) {
  const [page, setPage] = useState(1);
  const deleteEntryMutation = useDeleteEntry();
  const { data, isLoading, isFetching } = useFetchEntriesPage(
    page,
    pageSize,
    page === 1 ? { entries: initialEntries, total } : undefined,
  );

  const entries = data?.entries ?? initialEntries;
  const totalPages = Math.ceil((data?.total ?? total) / pageSize);

  const handleDelete = (id: string) => {
    deleteEntryMutation.mutate(id);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!entries.length && page === 1) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Пока нет записей. Создайте первую!
      </Text>
    );
  }

  return (
    <>
      {deleteEntryMutation.error && (
        <Alert color="red" mb="md">
          {deleteEntryMutation.error.message}
        </Alert>
      )}

      <div className={styles.grid}>
        {entries.map((entry) => (
          <div key={entry.id} className={styles.cardWrapper}>
            <EntryCard
              entry={entry}
              onDelete={handleDelete}
              isDeleting={deleteEntryMutation.isPending && deleteEntryMutation.variables === entry.id}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={pageStyles.paginationWrapper}>
          <Pagination total={totalPages} value={page} onChange={setPage} disabled={isFetching} />
        </div>
      )}
    </>
  );
}
