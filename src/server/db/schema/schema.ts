// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { SQL, sql } from "drizzle-orm";
import {
  index
} from "drizzle-orm/pg-core";
import { createTable, tsVector } from "./utils";
import { user } from "./auth-schema";

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
    // search: tsVector("search_idx")
    //   .notNull()
    //   .generatedAlwaysAs((): SQL => sql`(
    //     setweight(to_tsvector('english', ${recipe.title}), 'A')
    //   )`)
  }),
  (t) => [
    // index('search_idx').using('gin', t.search),
  ],
);

export const comment = createTable(
  "comment",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.text().notNull().references(() => user.id),
    recipeId: d.integer().notNull().references(() => recipe.id),
    content: d.text().notNull(),
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
    // index("rating_idx").on(t.rating),
    // index("created_at_idx").on(t.createdAt),
  ],
);

export * from "./auth-schema";
