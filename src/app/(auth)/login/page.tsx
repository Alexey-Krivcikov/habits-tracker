"use client";

import { Alert, Button, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { signIn, signUp } from "@/auth/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("register");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // biome-ignore lint/suspicious/noImplicitAnyLet: for test
      let res;

      if (mode === "register") {
        res = await signUp.email({
          email,
          password,
          name: "Alex",
        });
      } else {
        res = await signIn.email({
          email,
          password,
        });
      }

      if (res.error) {
        setError(res.error.message || "Something went wrong");
        return;
      }

      console.log("SUCCESS:", res.data);
      // biome-ignore lint/suspicious/noExplicitAny: for test
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper shadow="md" p="xl" radius="md" w={360}>
        <Stack gap="md">
          <Title order={2} ta="center">
            {mode === "register" ? "Create account" : "Welcome back"}
          </Title>

          {error && (
            <Alert color="red" title="Auth error">
              {error}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error?.toLowerCase().includes("email") ? error : undefined}
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error?.toLowerCase().includes("password") ? error : undefined}
          />

          <Button onClick={handleSubmit} loading={loading} fullWidth>
            {mode === "register" ? "Sign up" : "Sign in"}
          </Button>

          <Group justify="center">
            <Text size="sm">{mode === "register" ? "Already have an account?" : "Don't have an account?"}</Text>

            <Button variant="subtle" size="xs" onClick={() => setMode(mode === "register" ? "login" : "register")}>
              {mode === "register" ? "Login" : "Register"}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
}
