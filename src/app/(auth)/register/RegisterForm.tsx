"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { type RegisterFormValues, registerSchema, useRegister } from "@/features";
import styles from "../login/AuthPage.module.scss";

export function RegisterForm() {
  const router = useRouter();
  const mutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => router.push("/entries/list"),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
      <Stack p="xl" className={styles.formStack}>
        {mutation.error && <Alert color="red">Ошибка регистрации: {mutation.error.message}</Alert>}

        <TextInput label="Имя" placeholder="Ваше имя" {...register("name")} error={errors.name?.message} />

        <TextInput label="Email" placeholder="you@example.com" {...register("email")} error={errors.email?.message} />

        <PasswordInput
          label="Пароль"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button type="submit" className={styles.amberButton} loading={mutation.isPending}>
          Создать аккаунт
        </Button>

        <Stack className={styles.toggleGroup} gap={4}>
          <Text className={styles.toggleText}>Уже есть аккаунт?</Text>
          <Link href="/login" className={styles.toggleLink}>
            Войти
          </Link>
        </Stack>
      </Stack>
    </form>
  );
}
