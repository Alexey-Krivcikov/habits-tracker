"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { EntryFormValues } from "@/features";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { successEntries } from "@/server/db/schema";

export async function createEntry(data: EntryFormValues) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [entry] = await db
    .insert(successEntries)
    .values({ ...data, userId: session.user.id })
    .returning();

  return entry;
}

export async function getEntries() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db
    .select()
    .from(successEntries)
    .where(eq(successEntries.userId, session.user.id))
    .orderBy(desc(successEntries.createdAt));
}

export async function getEntriesPaginated(page: number, pageSize = 12) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const offset = (page - 1) * pageSize;

  const [entries, [countResult]] = await Promise.all([
    db
      .select()
      .from(successEntries)
      .where(eq(successEntries.userId, session.user.id))
      .orderBy(desc(successEntries.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ value: count() }).from(successEntries).where(eq(successEntries.userId, session.user.id)),
  ]);

  return { entries, total: Number(countResult.value) };
}

export async function getEntryById(id: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [entry] = await db
    .select()
    .from(successEntries)
    .where(and(eq(successEntries.id, id), eq(successEntries.userId, session.user.id)))
    .limit(1);

  if (!entry) notFound();
  return entry;
}

export async function updateEntry(id: string, data: EntryFormValues) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [entry] = await db
    .update(successEntries)
    .set(data)
    .where(and(eq(successEntries.id, id), eq(successEntries.userId, session.user.id)))
    .returning();

  if (!entry) notFound();
  return entry;
}

export async function deleteEntry(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(successEntries).where(eq(successEntries.id, id));
}
