"use client";

import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <Container size="md">
      <Stack mih="calc(100dvh - 60px)" align="center" justify="center" gap="xl">
        <Title order={1} ta="center">
          Дневник успеха
        </Title>

        <Text size="lg" c="dimmed" ta="center" maw={600}>
          Записывайте свои достижения, эмоции и мысли каждый день. Формируйте здоровую самооценку через практику
          дневника успеха.
        </Text>

        <Group>
          <Button component={Link} href="/login" size="md">
            Начать
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
