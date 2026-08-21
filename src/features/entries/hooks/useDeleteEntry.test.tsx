import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteEntry } from "./useDeleteEntry";

const mocks = vi.hoisted(() => {
  const deleteEntry = vi.fn();
  const show = vi.fn();
  return { deleteEntry, show };
});

vi.mock("@mantine/notifications", () => ({
  notifications: { show: mocks.show },
}));

vi.mock("../services/entries.service", () => ({
  deleteEntry: mocks.deleteEntry,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe("useDeleteEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the service and shows a success notification on success", async () => {
    mocks.deleteEntry.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteEntry(), { wrapper });

    act(() => {
      result.current.mutate("123e4567-e89b-12d3-a456-426614174000");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocks.deleteEntry).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000");
    expect(mocks.show).toHaveBeenCalledWith(expect.objectContaining({ title: "Удалено", message: "Запись удалена" }));
  });

  it("shows an error notification and exposes the error on failure", async () => {
    mocks.deleteEntry.mockRejectedValue(new Error("Нет доступа"));

    const { result } = renderHook(() => useDeleteEntry(), { wrapper });

    act(() => {
      result.current.mutate("123e4567-e89b-12d3-a456-426614174000");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mocks.show).toHaveBeenCalledWith(expect.objectContaining({ title: "Ошибка", message: "Нет доступа" }));
  });
});
