import { Badge, Card, Container, Group, Stack, Text } from "@mantine/core";
import { IconArrowLeft, IconBrain, IconHeart, IconMessages, IconStar } from "@tabler/icons-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getEntryById } from "@/features/entries/services/entries.service";
import { auth } from "@/server/auth";
import { EntryActions } from "./EntryActions";
import styles from "./EntryDetail.module.scss";

const fieldMeta = [
  { key: "situation" as const, label: "Ситуация", icon: IconMessages },
  { key: "achievement" as const, label: "Достижение", icon: IconStar },
  { key: "emotion" as const, label: "Эмоция", icon: IconHeart },
  { key: "thought" as const, label: "Мысль", icon: IconBrain },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { title: "Запись" };
  const { id } = await params;
  const entry = await getEntryById(id);
  return { title: `Запись от ${new Date(entry.createdAt).toLocaleDateString("ru-RU")}` };
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const entry = await getEntryById(id);

  const date = new Date(entry.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Container size="sm" py="xl">
      <Stack className={styles.pageStack}>
        <Link href="/entries/list" className={styles.backLink}>
          <IconArrowLeft size={16} />
          <Text component="span" size="sm">
            К списку записей
          </Text>
        </Link>

        <Group className={styles.headerGroup}>
          <Badge variant="light" color="gray" size="lg">
            {date}
          </Badge>
        </Group>

        <Card className={styles.detailCard}>
          <Stack className={styles.fieldsStack}>
            {fieldMeta.map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <Group className={styles.fieldGroup}>
                  <Icon size={18} />
                  <Text className={styles.fieldLabel}>{label}</Text>
                </Group>
                <Text className={styles.fieldValue}>{entry[key]}</Text>
              </div>
            ))}
          </Stack>
        </Card>

        <EntryActions id={entry.id} />
      </Stack>
    </Container>
  );
}
