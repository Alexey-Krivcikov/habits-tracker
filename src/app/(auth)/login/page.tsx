"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type AuthFormValues, authSchema } from "@/auth/schemas";
import { useLogin, useRegister } from "@/shared/api/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("register");

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: AuthFormValues) => {
    if (mode === "register") {
      registerMutation.mutate({
        ...values,
        name: "Alex",
      });
      return;
    }

    loginMutation.mutate(values);
  };

  const error = loginMutation.error?.message ?? registerMutation.error?.message;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper shadow="md" p="xl" radius="md" w={360}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Title ta="center">{mode === "register" ? "Create account" : "Welcome back"}</Title>

            {error && <Alert color="red">{error}</Alert>}

            <TextInput
              label="Email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <PasswordInput
              label="Password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button type="submit" loading={loginMutation.isPending || registerMutation.isPending} fullWidth>
              {mode === "register" ? "Sign up" : "Sign in"}
            </Button>

            <Group justify="center">
              <Text size="sm">{mode === "register" ? "Already have an account?" : "Don't have an account?"}</Text>

              <Button variant="subtle" size="xs" onClick={() => setMode(mode === "register" ? "login" : "register")}>
                {mode === "register" ? "Login" : "Register"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
