import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EntryForm } from "./EntryForm";

const mocks = vi.hoisted(() => {
  const push = vi.fn();
  const mutateAsync = vi.fn();
  return {
    push,
    mutateAsync,
    mockCreateMutation: { mutateAsync, isPending: false, error: null as Error | null },
    mockUpdateMutation: { mutateAsync, isPending: false, error: null as Error | null },
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@/features", async () => {
  const { entrySchema } = await import("@/features/entries/schemas/entry.schema");
  return {
    entrySchema,
    useCreateEntry: () => mocks.mockCreateMutation,
    useUpdateEntry: () => mocks.mockUpdateMutation,
  };
});

const validValues = {
  situation: "Проснулся в 6 утра и не нажал на снуз",
  achievement: "Успел сделать зарядку до завтрака",
  emotion: "Чувствовал гордость за себя",
  thought: "Дисциплина — это привычка",
};

const renderForm = (props?: React.ComponentProps<typeof EntryForm>) => {
  render(
    <MantineProvider>
      <EntryForm {...props} />
    </MantineProvider>,
  );
};

describe("EntryForm", () => {
  beforeEach(() => {
    mocks.mutateAsync.mockReset();
    mocks.push.mockReset();
    mocks.mockCreateMutation.error = null;
    mocks.mockUpdateMutation.error = null;
  });

  it("renders all four textareas with labels", () => {
    renderForm();

    expect(screen.getByLabelText("Ситуация")).toBeInTheDocument();
    expect(screen.getByLabelText("Достижение")).toBeInTheDocument();
    expect(screen.getByLabelText("Эмоция")).toBeInTheDocument();
    expect(screen.getByLabelText("Мысль")).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Сохранить запись" }));

    expect(await screen.findByText("Опишите ситуацию подробнее (минимум 10 символов)")).toBeInTheDocument();
    expect(await screen.findByText("Опишите достижение подробнее (минимум 10 символов)")).toBeInTheDocument();
    expect(await screen.findByText("Укажите эмоцию")).toBeInTheDocument();
    expect(await screen.findByText("Опишите мысль подробнее (минимум 10 символов)")).toBeInTheDocument();
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it("submits valid values in create mode", async () => {
    mocks.mutateAsync.mockResolvedValue(undefined);
    renderForm();

    fireEvent.change(screen.getByLabelText("Ситуация"), { target: { value: validValues.situation } });
    fireEvent.change(screen.getByLabelText("Достижение"), { target: { value: validValues.achievement } });
    fireEvent.change(screen.getByLabelText("Эмоция"), { target: { value: validValues.emotion } });
    fireEvent.change(screen.getByLabelText("Мысль"), { target: { value: validValues.thought } });
    fireEvent.click(screen.getByRole("button", { name: "Сохранить запись" }));

    await waitFor(() => expect(mocks.mutateAsync).toHaveBeenCalledWith(validValues));
    expect(mocks.push).toHaveBeenCalledWith("/entries/list");
  });

  it("calls update mutation with id and navigates in edit mode", async () => {
    mocks.mutateAsync.mockResolvedValue(undefined);
    const entryId = "550e8400-e29b-41d4-a716-446655440000";

    renderForm({ entryId, defaultValues: validValues });

    fireEvent.click(screen.getByRole("button", { name: "Сохранить изменения" }));

    await waitFor(() => expect(mocks.mutateAsync).toHaveBeenCalledWith({ id: entryId, data: validValues }));
    expect(mocks.push).toHaveBeenCalledWith("/entries/list");
  });

  it("shows mutation error alert", () => {
    mocks.mockCreateMutation.error = new Error("Не удалось сохранить");

    renderForm();

    expect(screen.getByText("Не удалось сохранить")).toBeInTheDocument();
  });
});
