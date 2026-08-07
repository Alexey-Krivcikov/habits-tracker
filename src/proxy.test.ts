import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import middleware from "./proxy";

const mocks = vi.hoisted(() => {
  const next = vi.fn(() => ({ type: "next" as const }));
  const redirect = vi.fn((url: string | URL) => ({ type: "redirect" as const, url: url.toString() }));
  return { next, redirect };
});

vi.mock("next/server", () => ({
  NextResponse: {
    next: mocks.next,
    redirect: mocks.redirect,
  },
}));

type MiddlewareRequest = Parameters<typeof middleware>[0];

const createRequest = (pathname: string, cookie?: string) =>
  ({
    nextUrl: { pathname },
    url: `http://localhost:3000${pathname}`,
    headers: new Headers(cookie ? { cookie } : {}),
  }) as unknown as MiddlewareRequest;

describe("proxy middleware", () => {
  beforeEach(() => {
    mocks.next.mockClear();
    mocks.redirect.mockClear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string | URL, init?: { headers?: Record<string, string> }) => ({
        json: async () => {
          const cookie = init?.headers?.cookie ?? "";
          return cookie ? { user: { id: "user-1" } } : { user: null };
        },
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("passes through public routes without calling the session API", async () => {
    const result = await middleware(createRequest("/"));

    expect(result).toEqual({ type: "next" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated users from protected routes to /login", async () => {
    const result = await middleware(createRequest("/entries"));

    expect(result).toEqual({ type: "redirect", url: "http://localhost:3000/login" });
  });

  it("allows authenticated users through protected routes", async () => {
    const result = await middleware(createRequest("/entries", "session_token=abc"));

    expect(result).toEqual({ type: "next" });
  });

  it("redirects authenticated users away from auth pages to /entries/list", async () => {
    const result = await middleware(createRequest("/login", "session_token=abc"));

    expect(result).toEqual({ type: "redirect", url: "http://localhost:3000/entries/list" });
  });

  it("allows unauthenticated users to view auth pages", async () => {
    const result = await middleware(createRequest("/register"));

    expect(result).toEqual({ type: "next" });
  });

  it("passes the request cookie to the session API", async () => {
    await middleware(createRequest("/entries", "session_token=abc"));

    expect(fetch).toHaveBeenCalledWith(
      new URL("http://localhost:3000/api/auth/get-session"),
      expect.objectContaining({ headers: { cookie: "session_token=abc" } }),
    );
  });
});
