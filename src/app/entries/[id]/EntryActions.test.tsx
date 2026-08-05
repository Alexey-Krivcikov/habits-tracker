import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EntryActions } from "./EntryActions";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  deleteMutation: {
    mutateAsync: vi.fn(),
    isPending: false,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("@/features", () => ({
  useDeleteEntry: () => mocks.deleteMutation,
}));

const entryId = "550e8400-e29b-41d4-a716-446655440000";

const renderActions = () =>
  render(
    <MantineProvider>
      <EntryActions id={entryId} />
    </MantineProvider>,
  );

describe("EntryActions", () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.deleteMutation.mutateAsync.mockReset();
    mocks.deleteMutation.isPending = false;
  });

  it("renders edit link and delete button", () => {
    renderActions();

    expect(screen.getByRole("link", { name: "Редактировать" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Удалить" })).toBeInTheDocument();
  });

  it("renders an edit link pointing to the edit page", () => {
    renderActions();

    const editLink = screen.getByRole("link", { name: "Редактировать" });
    expect(editLink).toHaveAttribute("href", `/entries/${entryId}/edit`);
  });

  it("deletes the entry and navigates to the list on success", async () => {
    mocks.deleteMutation.mutateAsync.mockResolvedValue(undefined);
    renderActions();

    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));

    await waitFor(() => expect(mocks.deleteMutation.mutateAsync).toHaveBeenCalledWith(entryId));
    expect(mocks.push).toHaveBeenCalledWith("/entries/list");
  });
});
