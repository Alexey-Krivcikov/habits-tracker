import "@testing-library/jest-dom/vitest";

Object.assign(process.env, {
  NODE_ENV: "test",
  DATABASE_URL: "https://localhost:5432/test",
  BETTER_AUTH_SECRET: "test-secret",
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
