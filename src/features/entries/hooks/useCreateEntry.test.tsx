import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "@/tests/utils";
import { useCreateEntry } from "./useCreateEntry";

const mocks = vi.hoisted(() => {
  const createEntry = vi.fn();
  const show = vi.fn();
  return { createEntry, show };
});

vi.mock("@mantine/notifications", () => ({
  notifications: { show: mocks.show },
}));

vi.mock("../services/entries.service", () => ({
  createEntry: mocks.createEntry,
}));

const formValues = {
  situation: "Проснулся в 6 утра",
  thought: "Я могу больше, чем думал",
  emotion: "Гордость",
  achievement: "Пробежал 5 км",
};

const createdEntry = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  createdAt: new Date("2026-08-14T09:00:00.000Z"),
  userId: "user-1",
  ...formValues,
};

describe("useCreateEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the service and shows a success notification on success", async () => {
    mocks.createEntry.mockResolvedValue(createdEntry);

    const { result } = renderHook(() => useCreateEntry(), { wrapper });

    act(() => {
      result.current.mutate(formValues);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocks.createEntry).toHaveBeenCalledWith(formValues);
    expect(mocks.show).toHaveBeenCalledWith(expect.objectContaining({ title: "Сохранено", message: "Запись создана" }));
  });

  it("exposes the error when the service call fails", async () => {
    mocks.createEntry.mockRejectedValue(new Error("Нет доступа"));

    const { result } = renderHook(() => useCreateEntry(), { wrapper });

    act(() => {
      result.current.mutate(formValues);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(mocks.show).not.toHaveBeenCalled();
  });
});
