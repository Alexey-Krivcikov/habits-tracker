import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EntriesListPage from "./page";

const mocks = vi.hoisted(() => {
  const getSession = vi.fn();
  const getEntriesPaginated = vi.fn();
  const redirect = vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  });
  return { getSession, getEntriesPaginated, redirect };
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
  getEntriesPaginated: mocks.getEntriesPaginated,
}));

vi.mock("@/features/entries/components/PaginatedEntryList", () => ({
  PaginatedEntryList: () => <div>PaginatedEntryList stub</div>,
}));

const renderPage = async () => render(<MantineProvider>{await EntriesListPage()}</MantineProvider>);

const authenticate = () => mocks.getSession.mockResolvedValue({ user: { id: "user-1", name: "Иван" } });
const unauthenticate = () => mocks.getSession.mockResolvedValue(null);

describe("EntriesListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login when the user is not authenticated", async () => {
    unauthenticate();

    await expect(EntriesListPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
    expect(mocks.getEntriesPaginated).not.toHaveBeenCalled();
  });

  it("renders the hero title and a count of entries", async () => {
    authenticate();
    mocks.getEntriesPaginated.mockResolvedValue({ entries: [entry()], total: 1 });

    await renderPage();

    expect(screen.getByRole("heading", { name: "Дневник успеха" })).toBeInTheDocument();
    expect(screen.getByText(/1 запись/)).toBeInTheDocument();
    expect(screen.getByText("PaginatedEntryList stub")).toBeInTheDocument();
  });

  it("renders an empty state when there are no entries", async () => {
    authenticate();
    mocks.getEntriesPaginated.mockResolvedValue({ entries: [], total: 0 });

    await renderPage();

    expect(screen.getByText(/Пока нет записей/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ещё ни одного успеха" })).toBeInTheDocument();
    expect(screen.queryByText("PaginatedEntryList stub")).not.toBeInTheDocument();
  });
});

let counter = 0;
function entry() {
  counter += 1;
  return {
    id: `entry-${counter}`,
    userId: "user-1",
    situation: "Ситуация",
    thought: "Мысль",
    emotion: "Эмоция",
    achievement: "Достижение",
  };
}
