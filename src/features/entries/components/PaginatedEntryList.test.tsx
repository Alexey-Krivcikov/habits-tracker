import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Entry } from "@/features/entries/types/entry.types";
import { PaginatedEntryList } from "./PaginatedEntryList";

const mocks = vi.hoisted(() => ({
  fetchPageResult: {
    data: null as { entries: Entry[]; total: number } | null,
    isLoading: false,
    isFetching: false,
  },
  deleteMutation: {
    mutate: vi.fn(),
    isPending: false,
    variables: null as string | null,
    error: null as Error | null,
  },
  useFetchEntriesPage: vi.fn(),
}));

vi.mock("@/features", async () => {
  const { EntryCard } = await import("./EntryCard");
  return {
    EntryCard,
    useFetchEntriesPage: mocks.useFetchEntriesPage,
    useDeleteEntry: () => mocks.deleteMutation,
  };
});

const makeEntry = (id: string, situation: string): Entry => ({
  id,
  userId: "user-1",
  situation,
  achievement: "Достижение",
  emotion: "Эмоция",
  thought: "Мысль",
  createdAt: new Date("2026-07-28T12:00:00Z"),
});

const mockEntries = [
  makeEntry("550e8400-e29b-41d4-a716-446655440000", "Запись первая"),
  makeEntry("660e8400-e29b-41d4-a716-446655440001", "Запись вторая"),
  makeEntry("770e8400-e29b-41d4-a716-446655440002", "Запись третья"),
];

const renderList = (props: Partial<React.ComponentProps<typeof PaginatedEntryList>> = {}) =>
  render(
    <MantineProvider>
      <PaginatedEntryList
        initialEntries={props.initialEntries ?? []}
        total={props.total ?? 0}
        pageSize={props.pageSize}
      />
    </MantineProvider>,
  );

describe("PaginatedEntryList", () => {
  beforeEach(() => {
    mocks.fetchPageResult.data = null;
    mocks.fetchPageResult.isLoading = false;
    mocks.fetchPageResult.isFetching = false;
    mocks.deleteMutation.mutate.mockReset();
    mocks.deleteMutation.isPending = false;
    mocks.deleteMutation.variables = null;
    mocks.deleteMutation.error = null;
    mocks.useFetchEntriesPage.mockReset();
    mocks.useFetchEntriesPage.mockReturnValue(mocks.fetchPageResult);
  });

  it("renders initial entries before fetching", () => {
    renderList({ initialEntries: mockEntries, total: 3 });

    expect(screen.getByText("Запись первая")).toBeInTheDocument();
    expect(screen.getByText("Запись вторая")).toBeInTheDocument();
    expect(screen.getByText("Запись третья")).toBeInTheDocument();
  });

  it("renders a loader while loading", () => {
    mocks.fetchPageResult.isLoading = true;
    const { container } = renderList({ initialEntries: mockEntries, total: 3 });

    expect(container.querySelector(".mantine-Loader-root")).toBeInTheDocument();
  });

  it("renders empty state when there are no entries", () => {
    renderList({ initialEntries: [], total: 0 });

    expect(screen.getByText("Пока нет записей. Создайте первую!")).toBeInTheDocument();
  });

  it("shows pagination controls when there is more than one page", () => {
    renderList({ initialEntries: mockEntries, total: 3, pageSize: 1 });

    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("fetches the next page when a page is selected", () => {
    renderList({ initialEntries: mockEntries, total: 3, pageSize: 1 });

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(mocks.useFetchEntriesPage).toHaveBeenCalledWith(2, 1, undefined);
  });

  it("calls delete mutation with entry id when delete button is clicked", () => {
    renderList({ initialEntries: mockEntries, total: 3 });

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(mocks.deleteMutation.mutate).toHaveBeenCalledWith(mockEntries[0].id);
  });

  it("shows delete mutation error alert", () => {
    mocks.deleteMutation.error = new Error("Не удалось удалить");
    renderList({ initialEntries: mockEntries, total: 3 });

    expect(screen.getByText("Не удалось удалить")).toBeInTheDocument();
  });
});
