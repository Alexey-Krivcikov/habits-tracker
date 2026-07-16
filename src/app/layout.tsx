import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { auth } from "@/server/auth";
import { MantineProvider, QueryProvider } from "@/shared/providers";
import { Navbar } from "@/widgets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Дневник успеха",
    template: "%s — Дневник успеха",
  },
  description: "Записывайте свои успехи и достижения на основе КПТ-рефлексии.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ColorSchemeScript defaultColorScheme="dark" />
        <MantineProvider>
          <Notifications position="bottom-left" />
          <QueryProvider>
            <Navbar session={session} />
            {children}
          </QueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
