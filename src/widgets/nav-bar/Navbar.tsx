"use client";

import { Box, Burger, Button, Container, Divider, Drawer, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/features/auth/services";
import { ThemeToggle } from "@/shared/ui";
import styles from "./Navbar.module.scss";

interface NavbarProps {
  session: {
    user: {
      name: string;
    } | null;
  } | null;
}

export function Navbar({ session }: NavbarProps) {
  const router = useRouter();
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
                <Button variant="subtle" className={styles.navButton}>
                  📔 Дневник успеха
                </Button>
              </Link>
            </Box>

            {session?.user && (
              <Box visibleFrom="sm">
                <Link href="/entries/list" className={styles.navLink}>
                  <Button variant="subtle" className={styles.navButton}>
                    📝 Мои записи
                  </Button>
                </Link>
              </Box>
            )}
          </Group>

          <Group>
            <ThemeToggle />

            {session?.user ? (
              <Group gap="sm" visibleFrom="sm">
                <Text className={styles.userName}>{session.user.name}</Text>

                <Button variant="default" className={styles.defaultButton} onClick={handleLogout}>
                  Выйти
                </Button>
              </Group>
            ) : (
              <Button component={Link} href="/login" variant="default" className={styles.defaultButton}>
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
