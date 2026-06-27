"use client";

import { Button, Container, Group, Title } from "@mantine/core";
import Link from "next/link";
import { EntryList } from "@/features/entries";

export default function EntriesListPage() {
  return (
    <Container size="sm" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Дневник успеха</Title>

        <Button component={Link} href="/entries/new">
          Новая запись
        </Button>
      </Group>

      <EntryList />
    </Container>
  );
}
