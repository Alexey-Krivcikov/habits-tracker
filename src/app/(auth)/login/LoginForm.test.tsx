import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LoginForm } from "./LoginForm";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  mutation: {
    mutate: vi.fn(),
    error: null as Error | null,
    isPending: false,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@/features", async () => {
  const { loginSchema } = await import("@/features/auth/schemas/auth.schema");
  return {
    loginSchema,
    useLogin: () => mocks.mutation,
  };
});

const validValues = { email: "user@example.com", password: "password123" };

const renderForm = () =>
  render(
    <MantineProvider>
      <LoginForm />
    </MantineProvider>,
  );

describe("LoginForm", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.mutation.mutate.mockReset();
    mocks.mutation.error = null;
    mocks.mutation.isPending = false;
  });

  it("renders email, password fields and submit button", () => {
    renderForm();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByText("Некорректный email адрес")).toBeInTheDocument();
    expect(await screen.findByText("Пароль должен содержать минимум 8 символов")).toBeInTheDocument();
    expect(mocks.mutation.mutate).not.toHaveBeenCalled();
  });

  it("submits valid values and navigates on success", async () => {
    let onSuccess: (() => void) | undefined;
    mocks.mutation.mutate.mockImplementation((_values: unknown, options?: { onSuccess?: () => void }) => {
      onSuccess = options?.onSuccess;
    });
    renderForm();

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: validValues.email } });
    fireEvent.change(screen.getByLabelText("Пароль"), { target: { value: validValues.password } });
    fireEvent.click(screen.getByRole("button", { name: "Войти" }));

    await waitFor(() => expect(mocks.mutation.mutate).toHaveBeenCalledWith(validValues, expect.any(Object)));

    onSuccess?.();
    expect(mocks.push).toHaveBeenCalledWith("/entries/list");
  });

  it("shows an error alert when login fails", () => {
    mocks.mutation.error = new Error("Неверный email или пароль");
    renderForm();

    expect(screen.getByText("Ошибка авторизации: Неверный email или пароль")).toBeInTheDocument();
  });
});
