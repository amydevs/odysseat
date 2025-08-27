// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index
} from "drizzle-orm/pg-core";
import { createTable } from "./utils";

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

export const markers = createTable (
  "marker",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    title: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    longitude: d.numeric({ precision: 10, scale: 7 }).notNull(),
    latitude: d.numeric({ precision: 10, scale: 7 }).notNull(),
    rating: d.numeric({ precision: 3, scale: 2 }),
    imageUrl: d.varchar({ length: 1024 }),
    createdAt: d.timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`) // Could be changed to new Date() to be handled by JS but shouldn't matter
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`) // Setting CURRENT_TIMESTAMP as default so we can sort by updatedAt for all markers
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("location_idx").on(t.longitude, t.latitude),
    index("title_idx").on(t.title),
    // index("rating_idx").on(t.rating),
    index("created_at_idx").on(t.createdAt),
  ],
);

export * from "./auth-schema";
