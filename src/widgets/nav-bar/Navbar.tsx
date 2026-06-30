"use client";

import { Box, Burger, Button, Container, Divider, Drawer, Group, Loader, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/features/auth/services";
import { ThemeToggle } from "@/shared/ui";

export function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleLogout = async () => {
    await signOut();
    close();
    router.push("/");
  };

  return (
    <>
      <Container w="100%" maw="100%" h={60} px="xl">
        <Group h="100%" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />

            <Box visibleFrom="sm">
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button variant="subtle">📔 Дневник успеха</Button>
              </Link>
            </Box>

            {session?.user && (
              <Box visibleFrom="sm">
                <Link href="/entries/list" style={{ textDecoration: "none" }}>
                  <Button variant="subtle">📝 Мои записи</Button>
                </Link>
              </Box>
            )}
          </Group>

          <Group>
            <ThemeToggle />

            {isPending ? (
              <Loader size="sm" />
            ) : session?.user ? (
              <Group gap="sm" visibleFrom="sm">
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

      <Drawer opened={opened} onClose={close} size="xs" padding="md" withCloseButton={false}>
        <Stack gap="xs">
          <Link href="/" style={{ textDecoration: "none" }} onClick={close}>
            <Button variant="subtle" fullWidth justify="flex-start">
              📔 Главная
            </Button>
          </Link>

          {session?.user && (
            <Link href="/entries/list" style={{ textDecoration: "none" }} onClick={close}>
              <Button variant="subtle" fullWidth justify="flex-start">
                📝 Мои записи
              </Button>
            </Link>
          )}
        </Stack>

        <Divider my="md" />

        {session?.user ? (
          <Stack gap="xs">
            <Text size="sm" c="dimmed" px="sm">
              {session.user.name}
            </Text>

            <Button variant="default" fullWidth onClick={handleLogout}>
              Выйти
            </Button>
          </Stack>
        ) : (
          <Button component={Link} href="/login" variant="default" fullWidth onClick={close}>
            Войти
          </Button>
        )}
      </Drawer>
    </>
  );
}
