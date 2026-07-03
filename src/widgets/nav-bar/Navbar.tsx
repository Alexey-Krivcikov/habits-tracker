"use client";

import { Box, Burger, Button, Container, Divider, Drawer, Group, Loader, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/features/auth/services";
import { ThemeToggle } from "@/shared/ui";
import styles from "./Navbar.module.scss";

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
      <Container className={styles.navbarContainer}>
        <Group className={styles.navbarInner}>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />

            <Box visibleFrom="sm">
              <Link href="/" className={styles.navLink}>
                <Button variant="subtle">📔 Дневник успеха</Button>
              </Link>
            </Box>

            {session?.user && (
              <Box visibleFrom="sm">
                <Link href="/entries/list" className={styles.navLink}>
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
                <Text className={styles.userName}>{session.user.name}</Text>

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
        <Stack className={styles.drawerStack}>
          <Link href="/" className={styles.navLink} onClick={close}>
            <Button variant="subtle" className={styles.drawerButton}>
              📔 Главная
            </Button>
          </Link>

          {session?.user && (
            <Link href="/entries/list" className={styles.navLink} onClick={close}>
              <Button variant="subtle" className={styles.drawerButton}>
                📝 Мои записи
              </Button>
            </Link>
          )}
        </Stack>

        <Divider className={styles.drawerDivider} />

        {session?.user ? (
          <Stack gap="xs">
            <Text className={styles.drawerUser}>{session.user.name}</Text>

            <Button variant="default" className={styles.drawerButton} onClick={handleLogout}>
              Выйти
            </Button>
          </Stack>
        ) : (
          <Button component={Link} href="/login" variant="default" className={styles.drawerButton} onClick={close}>
            Войти
          </Button>
        )}
      </Drawer>
    </>
  );
}
