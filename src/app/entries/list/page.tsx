import { Box, Button, Card, Container, Flex, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight, IconMessages, IconSparkles } from "@tabler/icons-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PaginatedEntryList } from "@/features/entries/components/PaginatedEntryList";
import { getEntriesPaginated } from "@/features/entries/services/entries.service";
import { auth } from "@/server/auth";
import styles from "./EntriesPage.module.scss";

export const metadata: Metadata = {
  title: "Мои записи",
  description: "Список ваших записей в дневнике успеха.",
};

export default async function EntriesListPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const { entries, total } = await getEntriesPaginated(1, 12);
  const count = total;

  return (
    <>
      <Box className={styles.heroSection}>
        <Container size="sm" py={80}>
          <Stack align="center" gap={0}>
            <IconSparkles size={32} stroke={1.5} className={styles.heroIcon} />

            <Title order={1} mt="md" className={styles.heroTitle}>
              Дневник успеха
            </Title>

            <div className={styles.heroUnderline} />

            <Text ta="center" size="lg" className={styles.heroDesc}>
              {count > 0
                ? `${count} ${count === 1 ? "запись" : count < 5 ? "записи" : "записей"} · Продолжайте замечать свои успехи`
                : "Пока нет записей. Сделайте первую — начните замечать свои успехи."}
            </Text>

            <Link href="/entries/new">
              <Button size="lg" mt="xl" rightSection={<IconSparkles size={20} />} className={styles.amberButton}>
                {count > 0 ? "✍️ Новая запись" : "✍️ Записать первый успех"}
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      <Container size="xl" py="xl">
        {count > 0 ? (
          <PaginatedEntryList initialEntries={entries} total={total} pageSize={12} />
        ) : (
          <Card padding="xl" radius="md" withBorder>
            <Stack align="center" gap="md" py="xl">
              <Flex className={styles.iconBg}>
                <IconMessages size={28} className={styles.emptyIcon} />
              </Flex>

              <Title order={4}>Ещё ни одного успеха</Title>

              <Text ta="center" size="sm" c="dimmed" className={styles.emptyDesc}>
                Каждая запись помогает заметить то, что обычно ускользает. Начните прямо сейчас.
              </Text>

              <Link href="/entries/new">
                <Button size="md" rightSection={<IconArrowRight size={18} />} className={styles.amberButton}>
                  Записать первый успех
                </Button>
              </Link>
            </Stack>
          </Card>
        )}
      </Container>
    </>
  );
}
