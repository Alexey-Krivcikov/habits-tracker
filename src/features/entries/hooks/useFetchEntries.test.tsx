import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "@/tests/utils";
import { useFetchEntries } from "./useFetchEntries";

const mocks = vi.hoisted(() => {
  const getEntries = vi.fn();
  return { getEntries };
});

vi.mock("../services/entries.service", () => ({
  getEntries: mocks.getEntries,
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

describe("useFetchEntries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with the provided initial data", async () => {
    mocks.getEntries.mockResolvedValue([entry]);

    const { result } = renderHook(() => useFetchEntries([entry]), { wrapper });

    expect(result.current.data).toEqual([entry]);
    await waitFor(() => expect(mocks.getEntries).toHaveBeenCalled());
  });

  it("fetches entries from the service when no initial data is given", async () => {
    mocks.getEntries.mockResolvedValue([entry]);

    const { result } = renderHook(() => useFetchEntries(), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual([entry]));
    expect(mocks.getEntries).toHaveBeenCalledTimes(1);
  });

  it("reports a query error when the service call fails", async () => {
    mocks.getEntries.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useFetchEntries(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
