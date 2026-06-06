import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const successEntries = pgTable("success_entries", {
  id: uuid().defaultRandom().primaryKey(),
  situation: text().notNull(),
  achievement: text().notNull(),
  emotion: text().notNull(),
  thought: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
