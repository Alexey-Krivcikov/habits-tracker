export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/api/auth/sign-in",
    SIGN_UP: "/api/auth/sign-up",
    SIGN_OUT: "/api/auth/sign-out",
  },

  ENTRIES: {
    LIST: "/api/entries",
    CREATE: "/api/entries",
    GET: (id: string) => `/api/entries/${id}`,
    UPDATE: (id: string) => `/api/entries/${id}`,
    DELETE: (id: string) => `/api/entries/${id}`,
  },
} as const;
