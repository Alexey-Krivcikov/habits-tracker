"use client";

import { Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { EntryForm } from "@/features/entries";

export default function NewEntryPage() {
  const router = useRouter();

  return (
    <Container size="sm" py="xl">
      <Stack gap="xs" mb="xl">
        <Group gap="sm">
          <IconSparkles size={28} stroke={1.5} />
          <Title order={2}>Новая запись</Title>
        </Group>

        <Text c="dimmed" size="sm">
          Запишите свой успех — ситуацию, достижение, эмоцию и мысль. Это поможет закрепить позитивный опыт.
        </Text>
      </Stack>

      <Paper shadow="md" p="xl" radius="md" withBorder>
        <EntryForm onSuccess={() => router.push("/entries/list")} />
      </Paper>
    </Container>
  );
}
