"use client";

import { Button, Container, Group, Loader, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/features/auth/services";
import { ThemeToggle } from "@/shared/ui";

export function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Container w="100%" maw="100%" h={60} px="xl">
      <Group h="100%" justify="space-between">
        <Group>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Button variant="subtle">📔 Главная</Button>
          </Link>

          {session?.user && (
            <Link href="/entries/list" style={{ textDecoration: "none" }}>
              <Button variant="subtle">📝 Дневник успеха</Button>
            </Link>
          )}
        </Group>

        <Group>
          <ThemeToggle />

          {isPending ? (
            <Loader size="sm" />
          ) : session?.user ? (
            <Group gap="sm">
              <Text size="sm" c="dimmed">
                {session.user.name}
              </Text>
              <Button variant="default" onClick={handleLogout}>
                Выйти
              </Button>
            </Group>
          ) : (
            <Button component={Link} href="/login" variant="default">
              Войти
            </Button>
          )}
        </Group>
      </Group>
    </Container>
  );
}
