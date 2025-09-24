import { drizzle } from "drizzle-orm/postgres-js";
import { relations } from "~/server/db/relations";

export function createDbMock() {
  return drizzle.mock({ relations });
}
