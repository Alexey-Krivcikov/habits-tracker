"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Flex, Group, Loader, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
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
      <Flex align="center" justify="center" flex="1 0 0">
        <Loader />
      </Flex>
    );
  }

  if (session?.user) {
    return null;
  }

  return (
    <Flex align="center" justify="center" flex="1 0 0">
      <Paper shadow="md" p="xl" radius="md" w={420}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Title ta="center">{mode === "register" ? "Создание аккаунта" : "С возвращением"}</Title>

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

            <Button type="submit" loading={loginMutation.isPending || registerMutation.isPending} fullWidth>
              {mode === "register" ? "Зарегистрироваться" : "Войти"}
            </Button>

            <Group justify="center">
              <Text size="sm">{mode === "register" ? "Уже есть аккаунт?" : "Нет аккаунта?"}</Text>

              <Button variant="subtle" size="xs" onClick={() => setMode(mode === "register" ? "login" : "register")}>
                {mode === "register" ? "Войти" : "Регистрация"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Flex>
  );
}
