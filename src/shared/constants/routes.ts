export const ROUTES = {
  HOME: "/",
  TERMS: "/terms",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },

  DASHBOARD: {
    ROOT: "/dashboard",
    ENTRIES: "/dashboard/entries",
    ENTRIES_NEW: "/dashboard/entries/new",
    ENTRIES_DETAIL: (id: string) => `/dashboard/entries/${id}`,
  },
} as const;
