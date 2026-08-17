import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterPage from "./page";

const mocks = vi.hoisted(() => {
  const getSession = vi.fn();
  const redirect = vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  });
  return { getSession, redirect };
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

vi.mock("./RegisterForm", () => ({
  RegisterForm: () => <form aria-label="Форма регистрации" />,
}));

const renderPage = async () => render(<MantineProvider>{await RegisterPage()}</MantineProvider>);

const authenticate = () => mocks.getSession.mockResolvedValue({ user: { id: "user-1", name: "Иван" } });
const unauthenticate = () => mocks.getSession.mockResolvedValue(null);

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /entries/list when the user is already authenticated", async () => {
    authenticate();

    await expect(RegisterPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith("/entries/list");
  });

  it("renders the page title and the register form for unauthenticated users", async () => {
    unauthenticate();

    await renderPage();

    expect(screen.getByRole("heading", { name: "Дневник успеха" })).toBeInTheDocument();
    expect(screen.getByText(/Создайте дневник успеха/)).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Форма регистрации" })).toBeInTheDocument();
  });
});
