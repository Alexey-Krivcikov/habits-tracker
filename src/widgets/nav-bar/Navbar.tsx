"use client";

import { Button, Container, Group } from "@mantine/core";
import Link from "next/link";
import { ThemeToggle } from "@/shared/ui";

export function Navbar() {
  return (
    <Container size="lg" h={60}>
      <Group h="100%" justify="space-between">
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="subtle">📔 Дневник успеха</Button>
        </Link>

        <Group>
          <ThemeToggle />

          <Button component={Link} href="/auth" variant="default">
            Войти
          </Button>
        </Group>
      </Group>
    </Container>
  );
}
