import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

Object.assign(process.env, {
  NODE_ENV: "test",
  DATABASE_URL: "https://localhost:5432/test",
  BETTER_AUTH_SECRET: "test-secret-1234567890-1234567890-12",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(document, "fonts", {
  writable: true,
  value: {
    addEventListener: () => {},
    removeEventListener: () => {},
  },
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});
