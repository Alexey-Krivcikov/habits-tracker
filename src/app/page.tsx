"use client";

import { Button, Stack, Text, Title, useMantineColorScheme } from "@mantine/core";

export default function Home() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Stack align="center" justify="center" h="100vh">
      <Title>Success Journal</Title>

      <Text c="dimmed">Mantine is working 🚀</Text>

      <Button onClick={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}>Click me</Button>
    </Stack>
  );
}
