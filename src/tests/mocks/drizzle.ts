import { vi } from "vitest";

export const drizzleState = { rows: [] as unknown[], total: 0 };

export type QueryChain = {
  from: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  offset: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
  then?: (resolve: (value: unknown) => unknown, reject?: (reason?: unknown) => unknown) => Promise<unknown>;
};

function makeChain(): QueryChain {
  let queried = false;
  const chain: QueryChain = {
    from: vi.fn(() => chain),
    values: vi.fn(() => chain),
    set: vi.fn(() => chain),
    where: vi.fn(() => chain),
    orderBy: vi.fn(() => {
      queried = true;
      return chain;
    }),
    limit: vi.fn(() => {
      queried = true;
      return chain;
    }),
    offset: vi.fn(() => {
      queried = true;
      return chain;
    }),
    returning: vi.fn(() => {
      queried = true;
      return chain;
    }),
  };
  // biome-ignore lint/complexity/useLiteralKeys: dynamic thenable key
  // biome-ignore lint/suspicious/noThenProperty: a thenable is required for a query chain mock
  chain["then"] = (resolve: (value: unknown) => unknown, reject?: (reason?: unknown) => unknown) =>
    Promise.resolve(queried ? drizzleState.rows : [{ value: drizzleState.total }]).then(resolve, reject);
  return chain;
}

export const db = {
  select: vi.fn(() => makeChain()),
  insert: vi.fn(() => makeChain()),
  update: vi.fn(() => makeChain()),
  delete: vi.fn(() => makeChain()),
};
