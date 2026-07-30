import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Entry } from "@/features";
import { EntryCard } from "@/features";

const mockEntry: Entry = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  userId: "user-1",
  situation: "Проснулся вовремя",
  achievement: "Сделал зарядку 15 минут",
  emotion: "Бодрость и лёгкость",
  thought: "Надо продолжать в том же духе",
  createdAt: new Date("2026-07-28T12:00:00Z"),
};

describe("EntryCard", () => {
  it("renders all four entry fields", () => {
    render(
      <MantineProvider>
        <EntryCard entry={mockEntry} onDelete={vi.fn()} />
      </MantineProvider>,
    );

    expect(screen.getByText("Проснулся вовремя")).toBeInTheDocument();
    expect(screen.getByText("Сделал зарядку 15 минут")).toBeInTheDocument();
    expect(screen.getByText("Бодрость и лёгкость")).toBeInTheDocument();
    expect(screen.getByText("Надо продолжать в том же духе")).toBeInTheDocument();
  });

  it("renders the date in Russian locale", () => {
    render(
      <MantineProvider>
        <EntryCard entry={mockEntry} onDelete={vi.fn()} />
      </MantineProvider>,
    );

    expect(screen.getByText(/28 июля 2026/i)).toBeInTheDocument();
  });

  it("links to the entry detail page", () => {
    render(
      <MantineProvider>
        <EntryCard entry={mockEntry} onDelete={vi.fn()} />
      </MantineProvider>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/entries/${mockEntry.id}`);
  });

  it("calls onDelete with entry id when delete button is clicked", () => {
    const onDelete = vi.fn();

    render(
      <MantineProvider>
        <EntryCard entry={mockEntry} onDelete={onDelete} />
      </MantineProvider>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onDelete).toHaveBeenCalledWith(mockEntry.id);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
