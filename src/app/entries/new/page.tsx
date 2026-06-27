"use client";

import { Container, Paper } from "@mantine/core";
import { useRouter } from "next/navigation";
import { EntryForm } from "@/features/entries";

export default function NewEntryPage() {
  const router = useRouter();

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <EntryForm onSuccess={() => router.push("/entries/list")} />
      </Paper>
    </Container>
  );
}
