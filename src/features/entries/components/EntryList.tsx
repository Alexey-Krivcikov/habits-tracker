"use client";

import { Alert, Loader, Text } from "@mantine/core";
import { EntryCard, useDeleteEntry, useFetchEntries } from "@/features";
import styles from "./EntryList.module.scss";

export function EntryList({ limit }: { limit?: number }) {
  const { data: entries, isLoading, error } = useFetchEntries();
  const deleteEntryMutation = useDeleteEntry();
  const displayed = limit ? (entries ?? []).slice(0, limit) : (entries ?? []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Alert color="red">Ошибка загрузки записей: {error.message}</Alert>;
  }

  if (!displayed.length) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Пока нет записей. Создайте первую!
      </Text>
    );
  }

  const handleDelete = (id: string) => {
    deleteEntryMutation.mutate(id);
  };

  return (
    <div className={styles.grid}>
      {displayed.map((entry) => (
        <div key={entry.id} className={styles.cardWrapper}>
          <EntryCard
            entry={entry}
            onDelete={handleDelete}
            isDeleting={deleteEntryMutation.isPending && deleteEntryMutation.variables === entry.id}
          />
        </div>
      ))}
    </div>
  );
}
