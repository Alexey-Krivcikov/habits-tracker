import { Container, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconPencil } from "@tabler/icons-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EntryForm } from "@/features/entries";
import { getEntryById } from "@/features/entries/services/entries.service";
import { auth } from "@/server/auth";
import styles from "./EntryEdit.module.scss";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { title: "Редактировать" };
  const { id } = await params;
  const entry = await getEntryById(id);
  return { title: `Редактировать — ${new Date(entry.createdAt).toLocaleDateString("ru-RU")}` };
}

export default async function EditEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const entry = await getEntryById(id);

  return (
    <Container size="xl" py="xl">
      <Stack className={styles.stack} gap="lg">
        <Link href={`/entries/${id}`} className={styles.backLink}>
          <IconArrowLeft size={16} />
          <Text component="span" size="sm">
            Назад к записи
          </Text>
        </Link>

        <Group className={styles.headerGroup}>
          <IconPencil size={22} />
          <Title order={2}>Редактировать запись</Title>
        </Group>

        <EntryForm
          entryId={id}
          defaultValues={{
            situation: entry.situation,
            achievement: entry.achievement,
            emotion: entry.emotion,
            thought: entry.thought,
          }}
          redirectTo={`/entries/${id}`}
        />
      </Stack>
    </Container>
  );
}
