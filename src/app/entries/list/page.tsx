"use client";

import { Box, Button, Card, Container, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight, IconMessages, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { EntryList, useFetchEntries } from "@/features/entries";
import styles from "./EntriesPage.module.css";

export default function EntriesListPage() {
  const { data: entries = [], isLoading } = useFetchEntries();

  if (isLoading) {
    return (
      <Container size="md">
        <Flex mih="calc(100dvh - 60px)" align="center" justify="center">
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
            <IconSparkles size={32} stroke={1.5} style={{ color: "#f0b429" }} />

            <Title order={1} ta="center" mt="md" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
              Дневник успеха
            </Title>

            <div className={styles.heroUnderline} />

            <Text ta="center" size="lg" c="dimmed" maw={540} lh={1.7}>
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
              styles={{
                root: {
                  background: "#f0b429",
                  color: "#000",
                  "&:hover": { background: "#d49420" },
                },
              }}
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
                <IconMessages size={28} stroke={1.5} style={{ color: "#f0b429" }} />
              </Flex>

              <Title order={4}>Ещё ни одного успеха</Title>

              <Text ta="center" size="sm" c="dimmed" maw={400}>
                Каждая запись помогает заметить то, что обычно ускользает. Начните прямо сейчас.
              </Text>

              <Button
                component={Link}
                href="/entries/new"
                size="md"
                rightSection={<IconArrowRight size={18} />}
                styles={{
                  root: {
                    background: "#f0b429",
                    color: "#000",
                    "&:hover": { background: "#d49420" },
                  },
                }}
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
