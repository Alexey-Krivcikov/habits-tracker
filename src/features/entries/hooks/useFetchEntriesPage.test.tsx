import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchEntriesPage } from "./useFetchEntriesPage";

const mocks = vi.hoisted(() => {
  const getEntriesPaginated = vi.fn();
  return { getEntriesPaginated };
});

vi.mock("../services/entries.service", () => ({
  getEntriesPaginated: mocks.getEntriesPaginated,
}));

const entry = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  createdAt: new Date("2026-08-14T09:00:00.000Z"),
  userId: "user-1",
  situation: "Ситуация",
  thought: "Мысль",
  emotion: "Эмоция",
  achievement: "Достижение",
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: 0 } } })}>
    {children}
  </QueryClientProvider>
);

describe("useFetchEntriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the entries page and total from the service", async () => {
    mocks.getEntriesPaginated.mockResolvedValue({ entries: [entry], total: 1 });

    const { result } = renderHook(() => useFetchEntriesPage(1, 12), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual({ entries: [entry], total: 1 }));
    expect(mocks.getEntriesPaginated).toHaveBeenCalledWith(1, 12);
  });

  it("starts with the provided initial data", async () => {
    mocks.getEntriesPaginated.mockResolvedValue({ entries: [entry], total: 1 });

    const { result } = renderHook(() => useFetchEntriesPage(1, 12, { entries: [entry], total: 1 }), { wrapper });

    expect(result.current.data).toEqual({ entries: [entry], total: 1 });
    await waitFor(() => expect(mocks.getEntriesPaginated).toHaveBeenCalled());
  });

  it("keeps previous data while fetching the next page", async () => {
    mocks.getEntriesPaginated
      .mockResolvedValueOnce({ entries: [entry], total: 2 })
      .mockResolvedValue({ entries: [entry, entry], total: 2 });

    const { result, rerender } = renderHook(({ page }) => useFetchEntriesPage(page, 12), {
      initialProps: { page: 1 },
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toEqual({ entries: [entry], total: 2 }));

    await act(async () => {
      rerender({ page: 2 });
    });

    expect(result.current.data).toEqual({ entries: [entry], total: 2 });
    expect(mocks.getEntriesPaginated).toHaveBeenCalledWith(2, 12);
  });
});
