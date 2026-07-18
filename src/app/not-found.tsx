import { Box, Button, Container, Stack, Text, Title } from "@mantine/core";
import { IconError404, IconHome } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./NotFound.module.scss";

export const metadata: Metadata = {
  title: "Страница не найдена",
};

export default function NotFound() {
  return (
    <Box className={styles.wrapper}>
      <Container size="xs" py={80}>
        <Stack align="center" gap={0}>
          <IconError404 size={64} stroke={1.2} className={styles.icon} />

          <Title order={1} mt="lg" className={styles.title}>
            Страница не найдена
          </Title>

          <div className={styles.underline} />

          <Text ta="center" size="lg" c="dimmed" className={styles.desc}>
            Такой страницы не существует или она была перемещена.
          </Text>

          <Link href="/">
            <Button size="lg" mt="xl" rightSection={<IconHome size={20} />} className={styles.button}>
              На главную
            </Button>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
