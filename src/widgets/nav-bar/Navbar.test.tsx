import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Navbar } from "./Navbar";

type Session = { user: { name: string } | null } | null;

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@/features/auth/services", () => ({
  signOut: mocks.signOut,
}));

const renderNavbar = (session: Session = null) =>
  render(
    <MantineProvider>
      <Navbar session={session} />
    </MantineProvider>,
  );

describe("Navbar", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.signOut.mockReset();
  });

  it("shows a login button when the user is not authenticated", () => {
    renderNavbar(null);

    expect(screen.getByRole("link", { name: /Войти/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Выйти" })).not.toBeInTheDocument();
  });

  it("shows the user name, logout button and entries link when authenticated", () => {
    renderNavbar({ user: { name: "Иван" } });

    expect(screen.getByText("Иван")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Выйти" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Мои записи/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Войти/ })).not.toBeInTheDocument();
  });

  it("does not show the entries link when logged out", () => {
    renderNavbar(null);

    expect(screen.queryByRole("link", { name: /Мои записи/ })).not.toBeInTheDocument();
  });

  it("signs out and navigates home on logout", async () => {
    mocks.signOut.mockResolvedValue(undefined);
    renderNavbar({ user: { name: "Иван" } });

    fireEvent.click(screen.getByRole("button", { name: "Выйти" }));

    await waitFor(() => expect(mocks.signOut).toHaveBeenCalled());
    expect(mocks.push).toHaveBeenCalledWith("/");
  });

  it("opens the mobile drawer when the burger is clicked", async () => {
    const { container } = renderNavbar({ user: { name: "Иван" } });

    const burger = container.querySelector(".mantine-Burger-root");
    if (!burger) throw new Error("Burger button not found");
    fireEvent.click(burger);

    expect(await screen.findByText("📔 Главная")).toBeInTheDocument();
  });
});
