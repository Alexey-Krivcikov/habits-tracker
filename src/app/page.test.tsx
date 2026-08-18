import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home, { generateMetadata } from "./page";

const mocks = vi.hoisted(() => {
  const getSession = vi.fn();
  const getEntries = vi.fn();
  return { getSession, getEntries };
});

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/server/auth", () => ({
  auth: { api: { getSession: mocks.getSession } },
}));

vi.mock("@/features/entries/services/entries.service", () => ({
  getEntries: mocks.getEntries,
}));

vi.mock("@/features/entries", () => ({
  EntryList: () => <div>EntryList stub</div>,
}));

const renderPage = async () => render(<MantineProvider>{await Home()}</MantineProvider>);

const authenticate = (user?: { id: string; name: string }) =>
  mocks.getSession.mockResolvedValue({ user: user ?? { id: "user-1", name: "Иван" } });
const unauthenticate = () => mocks.getSession.mockResolvedValue(null);

const entry = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  userId: "user-1",
  situation: "Ситуация",
  thought: "Мысль",
  emotion: "Эмоция",
  achievement: "Достижение",
};

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the guest landing page for unauthenticated users", async () => {
    unauthenticate();

    await renderPage();

    expect(screen.getByRole("heading", { name: "Дневник успеха" })).toBeInTheDocument();
    expect(screen.getByText(/Одна запись в день/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Записать первый успех" })).toHaveAttribute("href", "/login");
    expect(screen.getByText("Ситуация")).toBeInTheDocument();
    expect(screen.getByText("Достижение")).toBeInTheDocument();
    expect(mocks.getEntries).not.toHaveBeenCalled();
  });

  it("welcomes the authenticated user by name", async () => {
    authenticate();
    mocks.getEntries.mockResolvedValue([entry]);

    await renderPage();

    expect(screen.getByRole("heading", { name: "С возвращением, Иван" })).toBeInTheDocument();
    expect(screen.getByText(/Вы уже записали 1 успех/)).toBeInTheDocument();
    expect(screen.getByText("EntryList stub")).toBeInTheDocument();
  });

  it("shows an empty state for an authenticated user without entries", async () => {
    authenticate();
    mocks.getEntries.mockResolvedValue([]);

    await renderPage();

    expect(screen.getByText(/Пока нет записей/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "✍️ Записать первый успех" })).toBeInTheDocument();
    expect(screen.queryByText("EntryList stub")).not.toBeInTheDocument();
  });

  it("generateMetadata describes the experience for a guest", async () => {
    unauthenticate();

    const metadata = await generateMetadata();

    expect(metadata.description).toContain("Одна запись в день");
  });

  it("generateMetadata describes the experience for an authenticated user", async () => {
    authenticate();

    const metadata = await generateMetadata();

    expect(metadata.description).toContain("Продолжайте записывать свои успехи");
  });
});
