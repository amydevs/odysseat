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
  client: postgres.Sql | undefined;
};

const client = globalForDb.client ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db:
  | PostgresJsDatabase<typeof relations>
  | PgliteDatabase<typeof relations> = drizzle({
  client,
  relations,
});
