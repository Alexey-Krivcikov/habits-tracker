"use client";

import { Box, Button, Container, Stack, Text, Title } from "@mantine/core";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import styles from "./ErrorPage.module.scss";

// biome-ignore lint/correctness/noUnusedFunctionParameters: required by Next.js error contract
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Box className={styles.wrapper}>
      <Container size="xs" py={80}>
        <Stack align="center" gap={0}>
          <IconAlertTriangle size={64} stroke={1.2} className={styles.icon} />

          <Title order={1} mt="lg" className={styles.title}>
            Что-то пошло не так
          </Title>

          <div className={styles.underline} />

          <Text ta="center" size="lg" c="dimmed" className={styles.desc}>
            Произошла непредвиденная ошибка. Попробуйте обновить страницу.
          </Text>

          <Button size="lg" mt="xl" rightSection={<IconRefresh size={20} />} className={styles.button} onClick={reset}>
            Попробовать снова
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
