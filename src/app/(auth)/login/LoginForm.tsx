"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Group, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type LoginFormValues,
  loginSchema,
  type RegisterFormValues,
  registerSchema,
  useLogin,
  useRegister,
} from "@/features";
import styles from "./AuthPage.module.scss";

export function LoginForm() {
  const router = useRouter();
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
    defaultValues: { email: "", password: "" },
  });

  const onSuccess = () => router.push("/entries/list");

  const onSubmit = (values: RegisterFormValues | LoginFormValues) => {
    if (mode === "register") {
      registerMutation.mutate({ ...values, name: values.email.split("@")[0] }, { onSuccess });
      return;
    }

    loginMutation.mutate(values, { onSuccess });
  };

  return (
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

        <TextInput label="Email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />

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
  );
}
