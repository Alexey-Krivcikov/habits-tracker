"use client";

import { Alert, Loader, Stack, Text } from "@mantine/core";
import { EntryCard, useDeleteEntry, useFetchEntries } from "@/features";

export function EntryList() {
  const { data: entries, isLoading, error } = useFetchEntries();
  const deleteEntryMutation = useDeleteEntry();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Alert color="red">Ошибка загрузки записей: {error.message}</Alert>;
  }

  if (!entries?.length) {
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
    <Stack gap="md">
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          onDelete={handleDelete}
          isDeleting={deleteEntryMutation.isPending && deleteEntryMutation.variables === entry.id}
        />
      ))}
    </Stack>
  );
}
