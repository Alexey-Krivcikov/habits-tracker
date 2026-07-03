"use client";

import { Box, Button, Card, Container, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight, IconMessages, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { EntryList, useFetchEntries } from "@/features/entries";
import styles from "./EntriesPage.module.scss";

export default function EntriesListPage() {
  const { data: entries = [], isLoading } = useFetchEntries();

  if (isLoading) {
    return (
      <Container size="md">
        <Flex className={styles.centeredFlex}>
          <Loader />
        </Flex>
      </Container>
    );
  }

  const count = entries.length;

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

            <Button
              component={Link}
              href="/entries/new"
              size="lg"
              mt="xl"
              rightSection={<IconSparkles size={20} />}
              className={styles.amberButton}
            >
              {count > 0 ? "✍️ Новая запись" : "✍️ Записать первый успех"}
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container size="sm" py="xl">
        {count > 0 ? (
          <EntryList />
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

              <Button
                component={Link}
                href="/entries/new"
                size="md"
                rightSection={<IconArrowRight size={18} />}
                className={styles.amberButton}
              >
                Записать первый успех
              </Button>
            </Stack>
          </Card>
        )}
      </Container>
    </>
  );
}
