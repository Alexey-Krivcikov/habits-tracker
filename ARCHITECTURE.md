# Architecture Guide - Масштабируемая структура для Habits Tracker

### Рекомендуемая структура (для масштабирования)
```
src/
├── app/                          # Next.js App Router - только маршруты
│   ├── (auth)/                   # Group для auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/              # Group для приватных pages
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── entries/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── entries/
│   │   └── health/
│   │       └── route.ts
│   │
│   ├── layout.tsx                # Root Layout + Providers
│   └── page.tsx
│
├── features/                     # 🎯 ГЛАВНОЕ - бизнес-логика по доменам
│   ├── auth/
│   │   ├── components/           # UI компоненты для auth
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── index.ts
│   │   ├── hooks/                # React Query / Custom hooks
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   └── index.ts
│   │   ├── schemas/              # Zod валидация
│   │   │   ├── login.schema.ts
│   │   │   ├── register.schema.ts
│   │   │   └── index.ts
│   │   ├── services/             # Server-only: бизнес-логика
│   │   │   ├── auth.service.ts   # "use server" функции
│   │   │   └── index.ts
│   │   ├── types/                # TypeScript типы
│   │   │   └── index.ts
│   │   └── index.ts              # Public API этого домена
│   │
│   ├── entries/
│   │   ├── components/
│   │   │   ├── EntryForm.tsx
│   │   │   ├── EntryCard.tsx
│   │   │   ├── EntryList.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useCreateEntry.ts
│   │   │   ├── useFetchEntries.ts
│   │   │   ├── useDeleteEntry.ts
│   │   │   └── index.ts
│   │   ├── schemas/
│   │   │   ├── entry.schema.ts
│   │   │   └─�� index.ts
│   │   ├── services/
│   │   │   ├── entries.service.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── entry.types.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── common/                   # Общие components для всех доменов
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       └── index.ts
│
├── shared/                       # Инфраструктура
│   ├── api/
│   │   ├── client.ts             # API client config
│   │   ├── queries/              # React Query queries
│   │   │   ├── index.ts
│   │   │   └── ...
│   │   ├── mutations/            # React Query mutations
│   │   │   ├── index.ts
│   │   │   └── ...
│   │   └── hooks.ts              # Common API hooks
│   │
│   ├── providers/                # ROOT-Level провайдеры
│   │   ├── MantineProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── index.ts
│   │
│   ├── components/               # Примитивные UI компоненты (if needed)
│   │   └── index.ts
│   │
│   ├── constants/                # Глобальные константы
│   │   ├── routes.ts             # Route paths
│   │   ├── api.ts                # API endpoints
│   │   └── index.ts
│   │
│   ├── lib/                      # Utilities
│   │   ├── utils.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── index.ts
│   │
│   ├── config/                   # Конфигурация
│   │   ├── app.config.ts         # Настройки приложения
│   │   └── index.ts
│   │
│   ├── types/                    # Глобальные типы
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   └── hooks/                    # Shared custom hooks
│       ├── useLocalStorage.ts
│       ├── useMediaQuery.ts
│       └── index.ts
│
├── server/                       # Server-only (optional, for clear separation)
│   ├── db/
│   │   ├── schema/
│   │   │   ├── auth-schema.ts
│   │   │   ├── success-entries.ts
│   │   │   └── index.ts
│   │   ├── migrations/
│   │   └── index.ts
│   │
│   └── lib/                      # Server-only utilities
│       ├── auth.lib.ts
│       └── db.lib.ts
│
├── auth/                         # Better Auth (minimal)
│   ├── auth.ts                   # Server config
│   └── client.ts                 # Client config
│
└── env.ts                        # Type-safe environment variables
```

## Ключевые принципы этой архитектуры

### 1️⃣ **By-Domain Organization** (вместо by-layer)
❌ Плохо:
```
components/
  ├── LoginForm.tsx
  ├── EntryForm.tsx
  └── ...
services/
  ├── auth.ts
  ├── entries.ts
```

✅ Хорошо:
```
features/
  ├── auth/
  │   ├── components/
  │   ├── hooks/
  │   └── services/
  ├── entries/
  │   ├── components/
  │   ├── hooks/
  │   └── services/
```

**Преиму��ества:**
- Найти все, что нужно для фичи, в одном месте
- Удалить фичу без разбора по всему проекту
- Команды могут работать параллельно на разных доменах

### 2️⃣ **Clear Boundaries Between Domains**
```typescript
// ✅ Хорошо - импорты только из своего домена
// features/entries/components/EntryForm.tsx
import { useCreateEntry } from "../hooks";
import { entrySchema } from "../schemas";

// ❌ Плохо - не импортируйте детали других доменов
import { loginService } from "@/features/auth/services"; // ❌
```

Используйте **index.ts** как публичное API каждого домена:
```typescript
// features/entries/index.ts
export { useCreateEntry, useFetchEntries } from "./hooks";
export { EntryForm, EntryCard } from "./components";
export { entrySchema } from "./schemas";
export type { Entry, EntryFormData } from "./types";

// ✅ Правильный импорт с другого места
import { useCreateEntry, EntryForm } from "@/features/entries";
```

### 3️⃣ **Client vs Server Separation**
```typescript
// ✅ features/entries/hooks/useCreateEntry.ts
"use client"; // явно
import { useMutation } from "@tanstack/react-query";
import { createEntryAction } from "../services/entries.service";
import { entrySchema } from "../schemas";

// ✅ features/entries/services/entries.service.ts
"use server"; // явно
import { db } from "@/server/db";
import { successEntries } from "@/server/db/schema";

export async function createEntryAction(data) {
  // Только server code здесь
}
```

### 4️⃣ **Shared Layer - только настоящее SHARED**
Кладите в `/shared` ТОЛЬКО то, что используется **минимум 2+ доменами**:
- Providers (Mantine, QueryClient)
- API client конфиг
- Глобальные константы
- Type utilities
- Hooks: useMediaQuery, useLocalStorage и т.д.

❌ НЕ кладите туда:
- UI компоненты, применяемые в одном домене
- Функции, применяемые только в одном домене

### 5️⃣ **API Routes & Services**
```typescript
// src/app/api/entries/route.ts
import { createEntryService } from "@/features/entries/services";

export async function POST(req: Request) {
  const data = await req.json();
  return createEntryService(data);
}

// src/features/entries/services/entries.service.ts
// Реальная бизнес-логика здесь
export async function createEntryService(data) {
  await db.insert(successEntries).values(data);
  // ...
}
```

## Правила Импортов

```typescript
// ✅ Хорошо - импорты внутри домена на уровень выше
import { useLogin } from "../hooks";
import { LoginForm } from "../components";
import { authSchema } from "../schemas";

// ✅ Хорошо - из shared
import { Button } from "@/shared/components";
import { API_ENDPOINTS } from "@/shared/constants";

// ✅ Хорошо - между доменами через пуб��ичное API
import { useCreateEntry, EntryForm } from "@/features/entries";

// ❌ Плохо - никогда не копайте в детали других доменов
import { createService } from "@/features/entries/services";
import { entrySchema } from "@/features/entries/schemas/entry";

// ❌ Плохо - с ../ слишком далеко
import { useLogin } from "../../../features/auth/hooks";
```

## Дополнительные файлы, которые помогут

### src/shared/constants/routes.ts
```typescript
export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/api/auth/signout",
  },
  DASHBOARD: "/dashboard",
  ENTRIES: {
    LIST: "/entries",
    CREATE: "/entries/new",
    DETAIL: (id: string) => `/entries/${id}`,
  },
} as const;
```

### src/shared/constants/api.ts
```typescript
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/api/auth/sign-in",
    SIGN_UP: "/api/auth/sign-up",
    SIGN_OUT: "/api/auth/sign-out",
  },
  ENTRIES: {
    LIST: "/api/entries",
    CREATE: "/api/entries",
    DELETE: (id: string) => `/api/entries/${id}`,
  },
} as const;
```

### src/env.ts (Type-safe env variables)
```typescript
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## Когда добавлять новую фичу

1. Создайте папку в `/features/XYZ`
2. Добавьте структуру: `{components,hooks,schemas,services,types,index.ts}`
3. Напишите публичное API в `index.ts`
4. Импортируйте только через публичное API
5. Страницы в `app/` используют компоненты и hooks из `features/`

## Масштабируемость

Эта архитектура хорошо работает на:
- ✅ 10 страниц
- ✅ 50+ компонентов
- ✅ 20+ разработчиков на разных фичах
- ✅ Fast feature development
- ✅ Easy to test и refactor

## Дополнительные улучшения (для будущего)

1. **Shared UI Library** - если много приватных компонентов
2. **Feature Flags** - управление фичами
3. **Storybook** - документация компонентов

