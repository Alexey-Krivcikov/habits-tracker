export const queryKeys = {
  auth: {
    login: ["auth", "login"],
    register: ["auth", "register"],
  },
  entries: {
    all: ["entries"],
    paginated: (page: number, pageSize: number) => ["entries", "paginated", page, pageSize] as const,
    create: ["entries", "create"],
    update: ["entries", "update"],
    delete: ["entries", "delete"],
  },
} as const;
