import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const successEntries = pgTable("success_entries", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  situation: text().notNull(),
  achievement: text().notNull(),
  emotion: text().notNull(),
  thought: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
