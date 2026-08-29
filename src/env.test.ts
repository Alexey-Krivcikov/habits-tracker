import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should parse valid environment variables", async () => {
    process.env.DATABASE_URL = "https://localhost:5432/db";
    process.env.BETTER_AUTH_SECRET = "my-secret-1234567890-1234567890-12";
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    const { env } = await import("./env");

    expect(env.DATABASE_URL).toBe("https://localhost:5432/db");
    expect(env.BETTER_AUTH_SECRET).toBe("my-secret-1234567890-1234567890-12");
    expect(env.NEXT_PUBLIC_APP_URL).toBe("https://example.com");
  });

  it("should throw when DATABASE_URL is missing", async () => {
    process.env.DATABASE_URL = "";
    process.env.BETTER_AUTH_SECRET = "my-secret-1234567890-1234567890-12";
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    await expect(import("./env")).rejects.toThrow("Invalid environment variables");
  });

  it("should throw when DATABASE_URL is not a URL", async () => {
    process.env.DATABASE_URL = "not-a-url";
    process.env.BETTER_AUTH_SECRET = "my-secret-1234567890-1234567890-12";
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    await expect(import("./env")).rejects.toThrow("Invalid environment variables");
  });

  it("should throw when BETTER_AUTH_SECRET is missing", async () => {
    process.env.DATABASE_URL = "https://localhost:5432/db";
    process.env.BETTER_AUTH_SECRET = "";
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    await expect(import("./env")).rejects.toThrow("Invalid environment variables");
  });

  it("should throw when BETTER_AUTH_SECRET is too short", async () => {
    process.env.DATABASE_URL = "https://localhost:5432/db";
    process.env.BETTER_AUTH_SECRET = "short";
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";

    await expect(import("./env")).rejects.toThrow("Invalid environment variables");
  });

  it("should throw when NEXT_PUBLIC_APP_URL is missing", async () => {
    process.env.DATABASE_URL = "https://localhost:5432/db";
    process.env.BETTER_AUTH_SECRET = "my-secret-1234567890-1234567890-12";
    process.env.NEXT_PUBLIC_APP_URL = "";

    await expect(import("./env")).rejects.toThrow("Invalid environment variables");
  });
});
