"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Flex, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type LoginFormValues, loginSchema, type RegisterFormValues, useLogin, useRegister } from "@/features";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("register");

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const error = loginMutation.error?.message ?? registerMutation.error?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues | LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterFormValues | LoginFormValues) => {
    if (mode === "register") {
      registerMutation.mutate({
        ...values,
        name: "Alex",
      });
      return;
    }

    loginMutation.mutate(values);
  };

  return (
    <Flex align="center" justify="center" flex="1 0 0">
      <Paper shadow="md" p="xl" radius="md" w={360}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Title ta="center">{mode === "register" ? "Создание аккаунта" : "С возвращением"}</Title>

            {error && <Alert color="red">Ошибка авторизации: {error}</Alert>}

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
