"use client";

import { Button, Group } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteEntry } from "@/features";
import styles from "./EntryDetail.module.scss";

export function EntryActions({ id }: { id: string }) {
  const router = useRouter();
  const deleteMutation = useDeleteEntry();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/entries/list");
  };

  return (
    <Group className={styles.actionsGroup}>
      <Button
        component={Link}
        href={`/entries/${id}/edit`}
        variant="outline"
        leftSection={<IconPencil size={16} />}
        className={styles.outlineButton}
      >
        Редактировать
      </Button>

      <Button
        color="red"
        variant="outline"
        loading={deleteMutation.isPending}
        onClick={handleDelete}
        leftSection={<IconTrash size={16} />}
        className={styles.outlineButton}
      >
        Удалить
      </Button>
    </Group>
  );
}
