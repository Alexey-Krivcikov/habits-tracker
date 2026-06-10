import type { successEntries } from "@/server/db/schema";

export type Entry = typeof successEntries.$inferSelect;
export type CreateEntryInput = typeof successEntries.$inferInsert;
