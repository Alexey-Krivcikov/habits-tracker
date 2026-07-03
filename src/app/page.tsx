"use client";

import { Box, Button, Card, Container, Flex, Group, Loader, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight, IconBrain, IconHeart, IconMessages, IconSparkles, IconStar } from "@tabler/icons-react";
import Link from "next/link";
import { useSession } from "@/features/auth/services";
import { EntryList, useFetchEntries } from "@/features/entries";
import styles from "./HomePage.module.scss";

const steps = [
  { icon: IconMessages, label: "Ситуация", desc: "Что произошло? Опишите обстоятельства.", color: "blue" },
  { icon: IconStar, label: "Достижение", desc: "Что вы сделали хорошо? Ваш успех.", color: "yellow" },
  { icon: IconHeart, label: "Эмоция", desc: "Что вы чувствовали? Отметьте эмоцию.", color: "red" },
  { icon: IconBrain, label: "Мысль", desc: "О чём вы думали? Запишите мысль.", color: "grape" },
];

export default function Home() {
  const { data: session, isPending } = useSession();
  const { data: entries = [] } = useFetchEntries();

  if (isPending) {
    return (
      <Container size="md">
        <Flex className={styles.centeredFlex}>
          <Loader />
        </Flex>
      </Container>
    );
  }

  if (session?.user) {
    const count = entries.length;

    return (
      <>
        <Box className={styles.heroSection}>
          <Container size="sm" py={80}>
            <Stack align="center" gap={0}>
              <IconSparkles size={32} stroke={1.5} className={styles.heroIcon} />

              <Title order={1} mt="md" className={styles.heroTitleAuthed}>
                С возвращением, {session.user.name}
              </Title>

              <div className={styles.heroUnderline} />

              <Text ta="center" size="lg" className={styles.heroDesc}>
                {count > 0
                  ? `Вы уже записали ${count} ${count === 1 ? "успех" : count < 5 ? "успеха" : "успехов"}. Продолжайте в том же духе!`
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

        {count > 0 && (
          <Container size="sm" py="xl">
            <Stack gap="md">
              <Title order={4}>Последние записи</Title>
              <EntryList />
            </Stack>
          </Container>
        )}
      </>
    );
  }

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
              Одна запись в день — и ваш взгляд на себя начинает меняться.
            </Text>

            <Button
              component={Link}
              href="/login"
              size="lg"
              mt="xl"
              rightSection={<IconArrowRight size={20} />}
              className={styles.amberButton}
            >
              Записать первый успех
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container size="sm" py="xl">
        <Stack gap="lg">
          <SimpleGrid cols={{ base: 2, xs: 4 }} spacing="md">
            {steps.map(({ icon: Icon, label, desc, color }) => (
              <Card key={label} className={styles.stepCard} padding="md" radius="md" withBorder>
                <Stack gap="xs" align="center" ta="center">
                  <Icon size={24} className={styles.stepIcon} style={{ color: `var(--mantine-color-${color}-6)` }} />
                  <Text size="sm" fw={600}>
                    {label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {desc}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>

          <Group justify="center" gap={6}>
            <div className={styles.stepDot} />
            <div className={styles.stepDot} />
            <div className={styles.stepDot} />
            <div className={styles.stepDot} />

            <Text size="sm" c="dimmed" ml={8}>
              4 шага КПТ-рефлексии
            </Text>
          </Group>

          <Card padding="xl" radius="md" withBorder mt="md">
            <Stack gap="lg">
              <Title order={4}>Как это работает</Title>

              {steps.map(({ icon: Icon, label, desc }, i) => (
                <Group key={label} gap="md" wrap="nowrap">
                  <Flex className={styles.iconBg}>
                    <Icon size={20} />
                  </Flex>

                  <div>
                    <Text size="sm" fw={600}>
                      {i + 1}. {label}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {desc}
                    </Text>
                  </div>
                </Group>
              ))}
            </Stack>
          </Card>

          <Flex align="center" justify="center" my="xl">
            <Button
              component={Link}
              href="/login"
              size="md"
              rightSection={<IconArrowRight size={18} className={styles.amberOutlineIcon} />}
              variant="outline"
              className={styles.amberOutline}
            >
              Войти и начать вести дневник
            </Button>
          </Flex>
        </Stack>
      </Container>
    </>
  );
}
