import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { db, drizzleState } from "@/tests/mocks/drizzle";
import {
  createEntry,
  deleteEntry,
  getEntries,
  getEntriesPaginated,
  getEntryById,
  updateEntry,
} from "./entries.service";

const mocks = vi.hoisted(() => {
  const getSession = vi.fn();
  const notFound = vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  });
  return { getSession, notFound };
});

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
}));

vi.mock("@/server/auth", () => ({
  auth: { api: { getSession: mocks.getSession } },
}));

vi.mock("@/server/db", async () => {
  const { db: mockDb } = await import("@/tests/mocks/drizzle");
  return { db: mockDb };
});

vi.mock("@/server/db/schema", () => ({
  successEntries: { id: "successEntries", userId: "successEntries.userId" },
}));

const user = { id: "user-1" };
const formValues = { situation: "С", thought: "Т", emotion: "Э", achievement: "Д" };

const authenticate = () => mocks.getSession.mockResolvedValue({ user });
const unauthenticate = () => mocks.getSession.mockResolvedValue(null);

describe("entries.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    drizzleState.rows = [];
    drizzleState.total = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("createEntry throws Unauthorized when the user is not logged in", async () => {
    unauthenticate();

    await expect(createEntry(formValues)).rejects.toThrow("Unauthorized");
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("createEntry inserts the data with the current user id", async () => {
    authenticate();
    drizzleState.rows = [newEntry()];

    const result = await createEntry(formValues);

    const chain = db.insert.mock.results[0].value as { values: ReturnType<typeof vi.fn> };
    expect(chain.values).toHaveBeenCalledWith({ ...formValues, userId: user.id });
    expect(result).toHaveProperty("id");
  });

  it("getEntries throws Unauthorized when the user is not logged in", async () => {
    unauthenticate();

    await expect(getEntries()).rejects.toThrow("Unauthorized");
  });

  it("getEntries orders the current user's entries", async () => {
    authenticate();

    await getEntries();

    const query = db.select.mock.results[0].value;
    expect(query.from).toHaveBeenCalled();
    expect(query.orderBy).toHaveBeenCalled();
  });

  it("getEntriesPaginated returns entries and total count", async () => {
    authenticate();
    drizzleState.rows = [newEntry(), newEntry()];
    drizzleState.total = 2;

    const result = await getEntriesPaginated(2);

    expect(result.entries).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it("getEntryById calls notFound for a non-uuid id without checking the session", async () => {
    unauthenticate();

    await expect(getEntryById("not-a-uuid")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.notFound).toHaveBeenCalledTimes(1);
    expect(mocks.getSession).not.toHaveBeenCalled();
  });

  it("getEntryById calls notFound when the entry does not exist", async () => {
    authenticate();

    await expect(getEntryById(validUuid())).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.notFound).toHaveBeenCalledTimes(1);
  });

  it("getEntryById returns the matching entry", async () => {
    authenticate();
    const entry = newEntry();
    drizzleState.rows = [entry];

    const result = await getEntryById(validUuid());

    expect(result).toEqual(entry);
  });

  it("updateEntry updates the entry and returns it", async () => {
    authenticate();
    const entry = newEntry();
    drizzleState.rows = [entry];

    const result = await updateEntry(validUuid(), formValues);

    expect(result).toEqual(entry);
    expect(db.update).toHaveBeenCalled();
  });

  it("deleteEntry deletes the entry for the current user", async () => {
    authenticate();

    await deleteEntry(validUuid());

    expect(db.delete).toHaveBeenCalled();
  });
});

let counter = 0;
function newEntry() {
  counter += 1;
  return { id: `entry-${counter}`, userId: user.id, ...formValues };
}

function validUuid() {
  return "123e4567-e89b-12d3-a456-426614174000";
}
