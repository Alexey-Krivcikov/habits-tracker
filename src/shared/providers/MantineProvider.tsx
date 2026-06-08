"use client";

import { MantineProvider } from "@mantine/core";

export function MantineProviders({ children }: { children: React.ReactNode }) {
  return <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>;
}
