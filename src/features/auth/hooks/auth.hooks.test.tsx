import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLogin, useRegister } from "./auth.hooks";

const mocks = vi.hoisted(() => {
  const signInEmail = vi.fn();
  const signUpEmail = vi.fn();
  return { signInEmail, signUpEmail };
});

vi.mock("@/features/auth/services", () => ({
  signIn: { email: mocks.signInEmail },
  signUp: { email: mocks.signUpEmail },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data on success", async () => {
    const user = { id: "user-1", email: "a@b.c" };
    mocks.signInEmail.mockResolvedValue({ data: user, error: null });

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutate({ email: "a@b.c", password: "password123" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(user);
    expect(mocks.signInEmail).toHaveBeenCalledWith({ email: "a@b.c", password: "password123" });
  });

  it("throws when the service returns an error", async () => {
    mocks.signInEmail.mockResolvedValue({ data: null, error: { message: "Неверный пароль" } });

    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      result.current.mutate({ email: "a@b.c", password: "wrong" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("Неверный пароль");
  });
});

describe("useRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns data on success", async () => {
    const user = { id: "user-1", email: "a@b.c" };
    mocks.signUpEmail.mockResolvedValue({ data: user, error: null });

    const { result } = renderHook(() => useRegister(), { wrapper });

    act(() => {
      result.current.mutate({ name: "Иван", email: "a@b.c", password: "password123" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(user);
  });

  it("throws when the service returns an error", async () => {
    mocks.signUpEmail.mockResolvedValue({ data: null, error: { message: "Email уже занят" } });

    const { result } = renderHook(() => useRegister(), { wrapper });

    act(() => {
      result.current.mutate({ name: "Иван", email: "a@b.c", password: "password123" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe("Email уже занят");
  });
});
