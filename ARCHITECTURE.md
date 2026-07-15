# Architecture Guide — Habits Tracker

## Фактическая структура проекта

```
src/
├── app/                              # Next.js App Router
│   ├── globals.css                   # Tailwind v4 + CSS-переменные
│   ├── layout.tsx                    # Root layout (серверный)
│   │   ├── MantineProvider
│   │   ├── Notifications
│   │   ├── QueryProvider
│   │   └── Navbar
│   ├── page.tsx                      # Лендинг / дашборд (в зависимости от сессии)
│   │
│   ├── (auth)/
│   │   └── login/
│   │       ├── page.tsx              # Серверный компонент (редирект, если уже авторизован)
│   │       └── LoginForm.tsx         # "use client" — логин / регистрация
│   │
│   ├── entries/
│   │   ├── list/
│   │   │   └── page.tsx              # Список записей с пагинацией (SSR + client)
│   │   ├── new/
│   │   │   └── page.tsx              # Создание записи
│   │   └── [id]/
│   │       ├── page.tsx              # Детальный просмотр записи
│   │       ├── EntryActions.tsx      # "use client" — кнопки редактирования / удаления
│   │       └── edit/
│   │           └── page.tsx          # Редактирование записи
│   │
│   └── api/
│       └── auth/
│           └── [...all]/
│               └── route.ts          # Better Auth catch-all handler
│
├── features/                         # Бизнес-логика по доменам (FSD)
│   ├── index.ts                      # Re-export всех публичных API доменов
│   │
│   ├── auth/
│   │   ├── index.ts
│   │   ├── hooks/
│   │   │   └── auth.hooks.ts         # useLogin, useRegister (React Query mutations)
│   │   ├── schemas/
│   │   │   └── auth.schema.ts        # loginSchema, registerSchema (Zod)
│   │   ├── services/
│   │   │   └── authClient.ts         # Better Auth client (signIn, signUp, signOut, useSession)
│   │   └── types/                    # (пусто — типы из схем)
│   │
│   ├── entries/
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── EntryCard.tsx         # Карточка одной записи
│   │   │   ├── EntryForm.tsx         # Форма создания / редактирования
│   │   │   ├── EntryList.tsx         # Список (без пагинации)
│   │   │   └── PaginatedEntryList.tsx # Список с пагинацией (Mantine Pagination)
│   │   ├── hooks/
│   │   │   ├── useCreateEntry.ts
│   │   │   ├── useDeleteEntry.ts
│   │   │   ├── useFetchEntries.ts
│   │   │   ├── useFetchEntriesPage.ts
│   │   │   └── useUpdateEntry.ts
│   │   ├── schemas/
│   │   │   └── entry.schema.ts       # entrySchema (Zod)
│   │   ├── services/
│   │   │   └── entries.service.ts    # "use server" — все CRUD операции
│   │   └── types/
│   │       └── entry.types.ts        # Entry = $inferSelect
│   │
│   └── common/
│       └── index.ts                  # (заглушка)
│
├── widgets/                          # FSD: виджеты
│   ├── index.ts                      # Re-export Navbar
│   └── nav-bar/
│       ├── Navbar.tsx                # "use client" — адаптивный navbar + drawer
│       └── Navbar.module.scss
│
├── shared/                           # FSD: shared layer
│   ├── api/
│   │   └── index.ts                  # queryKeys (auth keys)
│   ├── config/
│   │   └── index.ts                  # (пусто)
│   ├── constants/
│   │   └── index.ts                  # (пусто)
│   ├── hooks/
│   │   └── index.ts                  # (пусто)
│   ├── lib/
│   │   └── index.ts                  # (пусто)
│   ├── providers/
│   │   ├── index.ts
│   │   ├── MantineProvider.tsx       # "use client" — Mantine с auto color scheme
│   │   └── QueryProvider.tsx         # "use client" — TanStack Query + DevTools
│   ├── types/
│   │   └── index.ts                  # (пусто)
│   └── ui/
│       ├── index.ts
│       └── theme-toggle/
│           ├── ThemeToggle.tsx       # "use client" — переключатель темы
│           └── ThemeToggle.module.scss
│
└── server/                           # Серверная инфраструктура
    ├── auth/
    │   ├── index.ts                  # Re-export { auth }
    │   └── auth.ts                   # Better Auth config (Drizzle adapter, email/password)
    └── db/
        ├── index.ts                  # Drizzle client (Pool → PostgreSQL)
        ├── schema/
        │   ├── index.ts              # Re-export всех схем
        │   ├── auth-schema.ts        # user, session, account, verification + relations
        │   └── success-entries.ts    # success_entries (id, userId, situation, achievement, emotion, thought, createdAt)
        └── migrations/               # Drizzle Kit миграции (0000..0002)
```

## Ключевые решения

### Аутентификация — Better Auth
- Сервер: `src/server/auth/auth.ts` — `betterAuth()` с Drizzle adapter и email/password
- Клиент: `src/features/auth/services/authClient.ts` — `createAuthClient()` → `signIn`, `signUp`, `signOut`, `useSession`
- API: `src/app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)` обрабатывает все `/api/auth/*`
- Сессия на сервере: `auth.api.getSession({ headers: await headers() })` (в layout, services, middleware)

### Маршрутизация и защита
- **Middleware** (`src/proxy.ts`): защищает `/entries/*`, редиректит с `/login` при наличии сессии
- **Серверные компоненты**: дублируют проверку сессии при рендеринге (на случай изменения кук)
- **"use server" функции**: каждая проверяет `auth.api.getSession()` перед DB операцией

### Data Flow
- **Server Components** (SSR): `entries.service.ts` → Drizzle → PostgreSQL
- **Client Components**: React Query hooks → "use server" функции → Drizzle → PostgreSQL
- Мутации инвалидируют ключ `["entries"]`, обновляя кеш React Query

### Схема БД (PostgreSQL)
- `user` — id (text PK), email (unique), name, emailVerified, image, createdAt, updatedAt
- `session` — id (text PK), expiresAt, token (unique), userId (FK→user, CASCADE)
- `account` — id (text PK), accountId, providerId, userId (FK→user, CASCADE), password, accessToken, refreshToken
- `verification` — id (text PK), identifier, value, expiresAt
- `success_entries` — id (uuid PK, gen_random_uuid()), userId (FK→user, CASCADE), situation, achievement, emotion, thought, createdAt

### Provider Chain (layout.tsx)
```
MantineProvider (auto color scheme)
  → Notifications (bottom-left)
    → QueryProvider (staleTime: 60s, retry: 1, + DevTools)
      → Navbar (session)
        → children
```

### Стилизация
- **Tailwind CSS v4** — глобальные утилиты, PostCSS plugin
- **Mantine 9.3** — компоненты + тема (CSS Variables)
- **SCSS Modules** (`.module.scss`) — компонентные стили
- **Mantine CSS variables** — accent colors через `var(--mantine-color-*)`

### Технологический стек
- Next.js 16 (App Router, React Compiler), React 19, TypeScript 5 (strict)
- Better Auth 1.6 + Drizzle adapter
- Drizzle ORM 0.45 + PostgreSQL 17
- TanStack React Query 5
- Mantine 9 + Tailwind CSS 4
- React Hook Form 7 + Zod 4
- Biome 2 (linter, formatter)
- Husky + Commitlint (conventional commits)

## Правила импортов

```typescript
// ✅ Из своего домена — через index.ts
import { useCreateEntry, EntryForm } from "@/features/entries";
import { useLogin, loginSchema } from "@/features/auth";

// ✅ Из shared
import { MantineProvider } from "@/shared/providers";
import { queryKeys } from "@/shared/api";
import { ThemeToggle } from "@/shared/ui";

// ✅ Из серверного слоя (только в "use server" / server components)
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { successEntries } from "@/server/db/schema";
```

## Добавление новой фичи

1. Создать папку в `src/features/<name>/` с подпапками `{hooks, components, schemas, services, types, index.ts}`
2. Экспортировать публичное API через `index.ts`
3. Зарегистрировать в `src/features/index.ts`
4. Создать страницу в `src/app/` (или расширить существующую)
5. Если нужна новая таблица — дополнить `src/server/db/schema/`, запустить `db:generate` + `db:migrate`
6. Написать "use server" функции в `services/` для CRUD
7. Создать React Query hooks в `hooks/`

## Пустые директории (место для роста)

- `shared/config/`, `shared/constants/`, `shared/hooks/`, `shared/lib/`, `shared/types/`, `features/common/` — зарезервированы, пока не наполнены
