"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Flex, Group, Loader, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  type LoginFormValues,
  loginSchema,
  type RegisterFormValues,
  registerSchema,
  useLogin,
  useRegister,
} from "@/features";
import { useSession } from "@/features/auth/services";
import styles from "./AuthPage.module.scss";

export default function AuthPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = useSession();
  const [mode, setMode] = useState<"login" | "register">("register");

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const error = loginMutation.error?.message ?? registerMutation.error?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues | LoginFormValues>({
    resolver: zodResolver(mode === "register" ? registerSchema : loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isSessionPending && session?.user) {
      router.replace("/entries/list");
    }
  }, [session, isSessionPending, router]);

  const onLoginSuccess = () => router.push("/entries/list");
  const onRegisterSuccess = () => router.push("/entries/list");

  const onSubmit = (values: RegisterFormValues | LoginFormValues) => {
    if (mode === "register") {
      registerMutation.mutate({ ...values, name: values.email.split("@")[0] }, { onSuccess: onRegisterSuccess });
      return;
    }

    loginMutation.mutate(values, { onSuccess: onLoginSuccess });
  };

  if (isSessionPending) {
    return (
      <Flex className={styles.centeredFlex}>
        <Loader />
      </Flex>
    );
  }

  if (session?.user) {
    return null;
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

        <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
          <Stack p="xl" className={styles.formStack}>
            {error && <Alert color="red">Ошибка авторизации: {error}</Alert>}

            {mode === "register" && (
              <TextInput
                label="Имя"
                placeholder="Ваше имя"
                {...register("name")}
                error={"name" in errors ? errors.name?.message : undefined}
              />
            )}

            <TextInput
              label="Email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <PasswordInput
              label="Пароль"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              className={styles.amberButton}
              loading={loginMutation.isPending || registerMutation.isPending}
            >
              {mode === "register" ? "Создать аккаунт" : "Войти"}
            </Button>

            <Group className={styles.toggleGroup}>
              <Text className={styles.toggleText}>{mode === "register" ? "Уже есть аккаунт?" : "Нет аккаунта?"}</Text>

              <button
                type="button"
                className={styles.toggleLink}
                onClick={() => setMode(mode === "register" ? "login" : "register")}
              >
                {mode === "register" ? "Войти" : "Создать аккаунт"}
              </button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
