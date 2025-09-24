import { drizzle } from 'drizzle-orm/pglite';
import { reset as seedReset } from "drizzle-seed";
import * as schema from "~/server/db/schema";
import { relations } from "~/server/db/relations";
import { vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

export function createMemoryDbInstanceMock() {
  const client = new PGlite();
  const db = drizzle(client, { relations });
  return db;
}

export async function pushSchema(db: ReturnType<typeof createMemoryDbInstanceMock>) {
  const { createRequire } = await vi.importActual<typeof import("node:module")>("node:module");
  const require = createRequire(import.meta.url);
  const { pushSchema } = require("drizzle-kit/api") as typeof import("drizzle-kit/api");
  const { apply } = await pushSchema(schema, db);
  await apply();
}

export async function reset(db: ReturnType<typeof createMemoryDbInstanceMock>) {
  return await seedReset(db, schema);
}