import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Entry } from "@/features/entries/types/entry.types";
import { EntryList } from "./EntryList";

const mocks = vi.hoisted(() => ({
  fetchResult: {
    data: null as Entry[] | null,
    isLoading: false,
    error: null as Error | null,
  },
  deleteMutation: {
    mutate: vi.fn(),
    isPending: false,
    variables: null as string | null,
  },
}));

vi.mock("@/features", async () => {
  const { EntryCard } = await import("./EntryCard");
  return {
    EntryCard,
    useFetchEntries: () => mocks.fetchResult,
    useDeleteEntry: () => mocks.deleteMutation,
  };
});

const mockEntries: Entry[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    userId: "user-1",
    situation: "Проснулся вовремя",
    achievement: "Сделал зарядку",
    emotion: "Бодрость",
    thought: "Надо продолжать",
    createdAt: new Date("2026-07-28T12:00:00Z"),
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    userId: "user-1",
    situation: "Дошёл до цели",
    achievement: "Написал отчёт",
    emotion: "Гордость",
    thought: "Усилия окупились",
    createdAt: new Date("2026-07-27T12:00:00Z"),
  },
];

const renderList = (props?: React.ComponentProps<typeof EntryList>) =>
  render(
    <MantineProvider>
      <EntryList {...props} />
    </MantineProvider>,
  );

describe("EntryList", () => {
  beforeEach(() => {
    mocks.fetchResult.data = null;
    mocks.fetchResult.isLoading = false;
    mocks.fetchResult.error = null;
    mocks.deleteMutation.mutate.mockReset();
    mocks.deleteMutation.isPending = false;
    mocks.deleteMutation.variables = null;
  });

  it("renders a loader while loading", () => {
    mocks.fetchResult.isLoading = true;
    const { container } = renderList();

    expect(container.querySelector(".mantine-Loader-root")).toBeInTheDocument();
  });

  it("renders an error alert when fetch fails", () => {
    mocks.fetchResult.error = new Error("Сеть недоступна");
    renderList();

    expect(screen.getByText(/Ошибка загрузки записей: Сеть недоступна/i)).toBeInTheDocument();
  });

  it("renders empty state message when there are no entries", () => {
    mocks.fetchResult.data = [];
    renderList();

    expect(screen.getByText("Пока нет записей. Создайте первую!")).toBeInTheDocument();
  });

  it("renders all entries", () => {
    mocks.fetchResult.data = mockEntries;
    renderList();

    expect(screen.getByText("Проснулся вовремя")).toBeInTheDocument();
    expect(screen.getByText("Дошёл до цели")).toBeInTheDocument();
  });

  it("renders only the first `limit` entries when limit is set", () => {
    mocks.fetchResult.data = mockEntries;
    renderList({ limit: 1 });

    expect(screen.getByText("Проснулся вовремя")).toBeInTheDocument();
    expect(screen.queryByText("Дошёл до цели")).not.toBeInTheDocument();
  });

  it("calls delete mutation with entry id when delete button is clicked", () => {
    mocks.fetchResult.data = mockEntries;
    renderList();

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(mocks.deleteMutation.mutate).toHaveBeenCalledWith(mockEntries[0].id);
  });
});
