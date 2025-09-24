import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import postgres from "postgres";

import { env } from "~/env";
import { relations } from "./relations";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export let db:
  | PostgresJsDatabase<Record<string, never>, typeof relations>
  | PgliteDatabase<Record<string, never>, typeof relations>;

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

db = drizzle(conn, { relations });
