import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditEntryPage from "./page";

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

vi.mock("@/features/entries", () => ({
  EntryForm: (props: { entryId: string; defaultValues: Record<string, string>; redirectTo: string }) => (
    <div>
      EntryForm stub (id: {props.entryId}, redirect: {props.redirectTo})
    </div>
  ),
}));

const id = "123e4567-e89b-12d3-a456-426614174000";

const renderPage = async () =>
  render(<MantineProvider>{await EditEntryPage({ params: Promise.resolve({ id }) })}</MantineProvider>);

const authenticate = () => mocks.getSession.mockResolvedValue({ user: { id: "user-1", name: "Иван" } });
const unauthenticate = () => mocks.getSession.mockResolvedValue(null);

const entry = {
  id,
  userId: "user-1",
  situation: "Проснулся в 6 утра",
  achievement: "Пробежал 5 км",
  emotion: "Гордость",
  thought: "Я могу больше, чем думал",
  createdAt: "2026-08-14T09:00:00.000Z",
};

describe("EditEntryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login when the user is not authenticated", async () => {
    unauthenticate();

    await expect(EditEntryPage({ params: Promise.resolve({ id }) })).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
    expect(mocks.getEntryById).not.toHaveBeenCalled();
  });

  it("renders a back link and the edit form pre-filled with the entry values", async () => {
    authenticate();
    mocks.getEntryById.mockResolvedValue(entry);

    await renderPage();

    expect(screen.getByRole("link", { name: /Назад к записи/ })).toHaveAttribute("href", `/entries/${id}`);
    expect(screen.getByRole("heading", { name: "Редактировать запись" })).toBeInTheDocument();
    expect(screen.getByText(/EntryForm stub/)).toHaveTextContent(`id: ${id}`);
    expect(screen.getByText(/EntryForm stub/)).toHaveTextContent(`redirect: /entries/${id}`);
  });
});
