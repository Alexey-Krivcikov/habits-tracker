"use client";

import { Button, Container, Group, Loader, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useSession } from "@/features/auth/services";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Container size="md">
        <Stack mih="calc(100dvh - 60px)" align="center" justify="center">
          <Loader />
        </Stack>
      </Container>
    );
  }

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
          <Button component={Link} href={session?.user ? "/entries/list" : "/login"} size="md">
            {session?.user ? "Перейти к записям" : "Начать"}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
