"use client";

import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import type { Entry } from "@/features";

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function EntryCard({ entry, onDelete, isDeleting }: EntryCardProps) {
  const date = new Date(entry.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed">
          {date}
        </Text>

        <ActionIcon variant="subtle" color="red" loading={isDeleting} onClick={() => onDelete(entry.id)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>

      <Stack gap="sm">
        <div>
          <Text size="sm" c="dimmed">
            Ситуация
          </Text>
          <Text>{entry.situation}</Text>
        </div>

        <div>
          <Text size="sm" c="dimmed">
            Достижение
          </Text>
          <Text>{entry.achievement}</Text>
        </div>

        <div>
          <Text size="sm" c="dimmed">
            Эмоция
          </Text>
          <Text>{entry.emotion}</Text>
        </div>

        <div>
          <Text size="sm" c="dimmed">
            Мысль
          </Text>
          <Text>{entry.thought}</Text>
        </div>
      </Stack>
    </Card>
  );
}
