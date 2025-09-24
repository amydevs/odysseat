import { createAuthApiMock } from "__mocks__/authApi";
import { createDbMock } from "__mocks__/db";
import { drizzle } from "drizzle-orm/postgres-js";
import { describe } from "node:test";
import { it } from "vitest";
import { createCaller } from "~/server/api/root";
import { relations } from "~/server/db/relations";

describe("Recipe RPC Calls", () => {
  const db = createDbMock();
  const authApi = createAuthApiMock();
  const caller = createCaller({
    db,
    session: null,
    authApi,
  });

  it("Get All Recipes", async () => {
    const recipes = await caller.recipe.getAll({});
    console.log(recipes);
  });
});
