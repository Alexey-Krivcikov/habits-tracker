"use client";

import { Button, Container, Group } from "@mantine/core";
import Link from "next/link";
import { ThemeToggle } from "@/shared/ui";

export function Navbar() {
  return (
    <Container w="100%" maw="100%" h={60} px="xl">
      <Group h="100%" justify="space-between">
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="subtle">📔 Главная</Button>
        </Link>
        <Link href="/entries/list" style={{ textDecoration: "none" }}>
          <Button variant="subtle">📝 Дневник успеха</Button>
        </Link>

        <Group>
          <ThemeToggle />

          <Button component={Link} href="/login" variant="default">
            Войти
          </Button>
        </Group>
      </Group>
    </Container>
  );
}
