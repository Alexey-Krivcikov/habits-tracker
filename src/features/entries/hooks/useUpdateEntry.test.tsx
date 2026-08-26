import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "@/tests/utils";
import { useUpdateEntry } from "./useUpdateEntry";

const mocks = vi.hoisted(() => {
  const updateEntry = vi.fn();
  const show = vi.fn();
  return { updateEntry, show };
});

vi.mock("@mantine/notifications", () => ({
  notifications: { show: mocks.show },
}));

vi.mock("../services/entries.service", () => ({
  updateEntry: mocks.updateEntry,
}));

const formValues = {
  situation: "Проснулся в 6 утра",
  thought: "Я могу больше, чем думал",
  emotion: "Гордость",
  achievement: "Пробежал 5 км",
};

const id = "123e4567-e89b-12d3-a456-426614174000";

const updatedEntry = {
  id,
  createdAt: new Date("2026-08-14T09:00:00.000Z"),
  userId: "user-1",
  ...formValues,
};

describe("useUpdateEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the service and shows a success notification on success", async () => {
    mocks.updateEntry.mockResolvedValue(updatedEntry);

    const { result } = renderHook(() => useUpdateEntry(), { wrapper });

    act(() => {
      result.current.mutate({ id, data: formValues });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mocks.updateEntry).toHaveBeenCalledWith(id, formValues);
    expect(mocks.show).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Обновлено", message: "Запись обновлена" }),
    );
  });

  it("exposes the error when the service call fails", async () => {
    mocks.updateEntry.mockRejectedValue(new Error("Нет доступа"));

    const { result } = renderHook(() => useUpdateEntry(), { wrapper });

    act(() => {
      result.current.mutate({ id, data: formValues });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(mocks.show).not.toHaveBeenCalled();
  });
});
