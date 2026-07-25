import { Box, Stack, Text, Title } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import styles from "../login/AuthPage.module.scss";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация",
  description: "Создайте дневник успеха.",
};

export default async function RegisterPage() {
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

        <Text className={styles.preambleDesc}>Создайте дневник успеха</Text>

        <RegisterForm />
      </Stack>
    </Box>
  );
}
