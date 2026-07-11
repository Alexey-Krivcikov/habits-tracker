# AGENTS.md - AI Coding Assistant Guide

## Project Overview

**Habits Tracker** is a Next.js 16 full-stack application with PostgreSQL backend for tracking habits through success entry journaling. Built with TypeScript, featuring email/password authentication via Better Auth, ORM via Drizzle, React Query for state management, and Mantine UI.

## Architecture

### Layered Structure
- **`src/app/`** - Next.js App Router pages and API routes (SSR/server components)
- **`src/auth/`** - Better Auth config and client exports
- **`src/db/`** - Drizzle ORM schema and database client
- **`src/shared/`** - Reusable providers (React Query, Mantine) and API hooks

### Data Flow
1. Better Auth intercepts `/api/auth/*` requests via catch-all route
2. Client hooks use Better Auth client → wrapped in React Query mutations/queries
3. Drizzle ORM connects to PostgreSQL via `src/db/index.ts` (Pool-based)
4. Mantine dark theme + Tailwind CSS for UI rendering

## Critical Developer Workflows

### Database Management
```bash
npm run db:generate  # Create migration files from schema changes
npm run db:migrate   # Apply pending migrations to database
```
Schema is single source of truth in `src/db/schema/index.ts`. Never manually edit migration files.

### Code Quality & Formatting
```bash
npm run lint         # Biome linting and validation
npm run lint:fix     # Auto-fix ESLint-style issues
npm run format       # Format code (Prettier-compatible)
npm run check        # Pre-commit staged files validation
```
Biome config: double quotes, semicolons, 120-char lines, 2-space indents, React/Next recommended rules.

### Development Workflow
```bash
npm run dev   # Hot-reload dev server on http://localhost:3000
npm run build # Production bundle with Next.js compilation
npm start     # Run production server
```

## Project-Specific Patterns

### Data Models (Drizzle ORM)
Two schema files in `src/db/schema/`:

**Auth Schema** (`auth-schema.ts`):
- `user` - id (PK), email (unique), name, emailVerified, image, createdAt, updatedAt
- `session`, `account`, `verification` - managed by Better Auth adapter, don't manually query

**Business Schema** (`success-entries.ts`):
- `successEntries` - id (uuid PK), situation, achievement, emotion, thought, createdAt

Relations defined in auth-schema using Drizzle relations() for foreign keys.

### API Hooks Pattern (React Query Wrapper)
All client-side mutations/queries in `src/shared/api/` directory organized by domain:

```typescript
// src/shared/api/auth/mutations.ts
export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const result = await signIn.email(payload);  // Better Auth client
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
  });
}
```

**Rules**: 
- Export hooks from domain index.ts
- Never call Better Auth directly in components
- Always wrap in React Query for caching/state management
- Destructure only what's used from results

### Validation Schema (Zod + React Hook Form)
Define in `src/auth/schemas.ts`, export both schema and inferred type:

```typescript
export const authSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});
export type AuthFormValues = z.infer<typeof authSchema>;
```

Use with `mantine-form-zod-resolver` in Mantine forms.

### Provider Composition
Root layout applies two "use client" providers in sequence:
1. `MantineProvider` - Mantine dark theme (default)
2. `QueryProvider` - React Query client with staleTime: 60s, retry: 1

Order matters: Mantine must wrap Query for proper styling context.

## Key Dependencies & Integration Points

- **Better Auth 1.6.14**: Manages user sessions + auth tables via Drizzle adapter. Client exports: `signIn.email()`, `signUp.email()`, `useSession()` hook, `signOut()`. All configured in `src/auth/auth.ts`.
- **Drizzle ORM 0.45.2**: PostgreSQL only. Schema co-located with migrations. Relations defined in same file as tables.
- **React Query 5.101.0**: Configured in QueryProvider with retry: 1, staleTime: 60s. Access via `useMutation()`, `useQuery()`.
- **Mantine 9.3.0**: Dark theme by default. CSS imported in layout. Form integration via resolver.
- **React Hook Form 7.78.0**: Client-side validation paired with Zod schemas.

## Conventions & Naming

### TypeScript Strictness
- Strict mode enabled (`tsconfig.json`)
- Path alias: `@/*` maps to `./src/*`
- Avoid `any` types—use generics or explicit types

### Naming Standards
- React hooks: "use" prefix (useLogin, useSession, useQuery)
- Drizzle tables: descriptive lowercase (user, session, successEntries)
- API mutations/queries grouped by domain in `src/shared/api/{domain}/`
- Client components: explicit "use client" directive at top of file
- Type exports from schema files: inferred via `z.infer<typeof schema>`

### Environment Variables (Required)
- `DATABASE_URL` - PostgreSQL connection string (for Drizzle)
- `BETTER_AUTH_SECRET` - Session signing secret (fallback in auth.ts)
- `NEXT_PUBLIC_APP_URL` - Public app URL (fallback: localhost:3000)

All loaded via `dotenv` in `src/auth/auth.ts` and `src/db/index.ts`.

## Adding New Features

### Example: Add New Success Entry Endpoint
1. **Schema**: Add fields to `src/db/schema/success-entries.ts` table
2. **Migration**: Run `npm run db:generate` → `npm run db:migrate`
3. **API Hooks**: Create `src/shared/api/entries/mutations.ts`, export hook from `index.ts`
4. **Form**: Use hook in page, bind to React Hook Form + Mantine form component
5. **Route** (if needed): Create `src/app/api/entries/route.ts` for server actions

Example mutation:
```typescript
export function useCreateEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: typeof successEntries.$inferInsert) => {
      const res = await fetch("/api/entries", { method: "POST", body: JSON.stringify(entry) });
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] }),
  });
}
```

### Example: Extend Authentication
1. Update config in `src/auth/auth.ts` (add OAuth providers, session duration, etc.)
2. Wrap new auth method in React Query hook in `src/shared/api/auth/mutations.ts`
3. Export and use in auth pages via custom hook or `useSession` for state

## Testing & Debugging Notes

- **Type Safety**: Run `tsc --noEmit` locally (included in build pipeline)
- **Database Debugging**: Import { db, schema } and test queries in Node script with tsx
- **Auth Debugging**: Check `better-auth.session_token` in cookies (HttpOnly in production)
- **React Query**: DevTools available but not wired (install @tanstack/react-query-devtools to debug cache)
- **Biome Errors**: Run `npm run lint` to see all issues, `npm run lint:fix` to auto-correct
