// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index
} from "drizzle-orm/pg-core";
import { createTable } from "./utils";
import { user } from "./auth-schema";

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const recipe = createTable(
  "recipe",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.text().notNull().references(() => user.id),
    title: d.text().notNull(),
    content: d.text().notNull(),
    thumbnailUrl: d.varchar({ length: 1024 }),
    position: d.point().notNull(),
    createdAt: d.timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`) // Could be changed to new Date() to be handled by JS but shouldn't matter
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`) // Setting CURRENT_TIMESTAMP as default so we can sort by updatedAt for all markers
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    // index("position_idx").on(t.position),
    index("title_idx").on(t.title),
    // index("rating_idx").on(t.rating),
    index("created_at_idx").on(t.createdAt),
  ],
);

export * from "./auth-schema";
