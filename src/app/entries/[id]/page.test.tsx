import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EntryPage from "./page";

const mocks = vi.hoisted(() => {
  const getSession = vi.fn();
  const getEntryById = vi.fn();
  const redirect = vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  });
  return { getSession, getEntryById, redirect };
});

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/server/auth", () => ({
  auth: { api: { getSession: mocks.getSession } },
}));

vi.mock("@/features/entries/services/entries.service", () => ({
  getEntryById: mocks.getEntryById,
}));

vi.mock("./EntryActions", () => ({
  EntryActions: () => <div>EntryActions stub</div>,
}));

const renderPage = async () =>
  render(
    <MantineProvider>
      {await EntryPage({ params: Promise.resolve({ id: "123e4567-e89b-12d3-a456-426614174000" }) })}
    </MantineProvider>,
  );

const authenticate = () => mocks.getSession.mockResolvedValue({ user: { id: "user-1", name: "Иван" } });
const unauthenticate = () => mocks.getSession.mockResolvedValue(null);

const entry = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  userId: "user-1",
  situation: "Проснулся в 6 утра",
  achievement: "Пробежал 5 км",
  emotion: "Гордость",
  thought: "Я могу больше, чем думал",
  createdAt: "2026-08-14T09:00:00.000Z",
};

describe("EntryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login when the user is not authenticated", async () => {
    unauthenticate();

    await expect(
      EntryPage({ params: Promise.resolve({ id: "123e4567-e89b-12d3-a456-426614174000" }) }),
    ).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
    expect(mocks.getEntryById).not.toHaveBeenCalled();
  });

  it("renders the entry fields and actions", async () => {
    authenticate();
    mocks.getEntryById.mockResolvedValue(entry);

    await renderPage();

    expect(screen.getByRole("link", { name: /К списку записей/ })).toBeInTheDocument();
    expect(screen.getByText("Ситуация")).toBeInTheDocument();
    expect(screen.getByText("Проснулся в 6 утра")).toBeInTheDocument();
    expect(screen.getByText("Достижение")).toBeInTheDocument();
    expect(screen.getByText("Пробежал 5 км")).toBeInTheDocument();
    expect(screen.getByText("Эмоция")).toBeInTheDocument();
    expect(screen.getByText("Гордость")).toBeInTheDocument();
    expect(screen.getByText("Мысль")).toBeInTheDocument();
    expect(screen.getByText("Я могу больше, чем думал")).toBeInTheDocument();
    expect(screen.getByText("EntryActions stub")).toBeInTheDocument();
  });
});
