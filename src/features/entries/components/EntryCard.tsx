"use client";

import { ActionIcon, Badge, Card, Group, Stack, Text } from "@mantine/core";
import { IconBrain, IconHeart, IconMessages, IconStar, IconTrash } from "@tabler/icons-react";
import type { Entry } from "@/features";
import styles from "./EntryCard.module.scss";

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const fieldMeta = [
  { key: "situation" as const, label: "Ситуация", icon: IconMessages },
  { key: "achievement" as const, label: "Достижение", icon: IconStar },
  { key: "emotion" as const, label: "Эмоция", icon: IconHeart },
  { key: "thought" as const, label: "Мысль", icon: IconBrain },
];

export function EntryCard({ entry, onDelete, isDeleting }: EntryCardProps) {
  const date = new Date(entry.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className={styles.card}>
      <Group className={styles.cardHeader}>
        <Badge variant="light" color="gray" size="sm">
          {date}
        </Badge>

        <ActionIcon variant="subtle" color="red" loading={isDeleting} onClick={() => onDelete(entry.id)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>

      <Stack className={styles.fieldsStack}>
        {fieldMeta.map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <Group className={styles.fieldGroup}>
              <Icon size={14} />
              <Text className={styles.fieldLabel}>{label}</Text>
            </Group>
            <Text className={styles.fieldValue}>{entry[key]}</Text>
          </div>
        ))}
      </Stack>
    </Card>
  );
}
