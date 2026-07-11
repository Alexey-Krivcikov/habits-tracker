import { Box, Stack, Text, Title } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import styles from "./AuthPage.module.scss";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Войти",
  description: "Войдите в свой дневник успеха.",
};

export default async function AuthPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/entries/list");
  }

  return (
    <Box className={styles.heroSection}>
      <Stack className={styles.preambleStack}>
        <IconSparkles size={28} className={styles.preambleIcon} />

        <Title order={2} mt="sm" className={styles.preambleTitle}>
          Дневник успеха
        </Title>

        <div className={styles.preambleUnderline} />

        <Text className={styles.preambleDesc}>Войдите в свой дневник успеха</Text>

        <LoginForm />
      </Stack>
    </Box>
  );
}
