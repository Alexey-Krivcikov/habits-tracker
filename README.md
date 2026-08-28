# Habits Tracker

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-1.6-purple)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![Mantine](https://img.shields.io/badge/Mantine-9-339AF0?logo=mantine&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)

Дневник успеха — приложение для отслеживания привычек через journaling на основе КПТ-рефлексии (Ситуация → Достижение → Эмоция → Мысль).

## Features

- 🔐 Authentication (email/password via Better Auth)
- 📝 CRUD записей успеха с пагинацией
- 🌗 Тёмная тема по умолчанию с переключателем
- 🎯 Серверный рендеринг + React Query на клиенте

## Tech Stack

### Core
- Next.js 16 (App Router, React Compiler)
- React 19, TypeScript 5 (strict)

### Auth
- Better Auth 1.6 + Drizzle adapter

### Data
- PostgreSQL 17 + Drizzle ORM 0.45
- TanStack React Query 5

### UI
- Mantine 9 + Tailwind CSS 4
- React Hook Form 7 + Zod 4
- SCSS Modules
- Tabler Icons

### Tooling
- Biome 2 (linter, formatter)
- Husky + Commitlint
- Docker Compose (PostgreSQL)

## Quick Start

```bash
npm install
npm run db:migrate
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server on localhost:3000 |
| `npm run build` | Production build |
| `npm run lint` | Biome check |
| `npm run lint:fix` | Auto-fix |
| `npm run format` | Format code |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Apply migrations |
