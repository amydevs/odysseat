import { createAuthApiMock } from "__mocks__/authApi";
import { createMemoryDbInstanceMock, pushDb, resetDb } from "__mocks__/db";
import { describe } from "node:test";
import { beforeAll, beforeEach, it } from "vitest";
import { createCaller } from "~/server/api/root";

describe("Recipe RPC Calls", () => {
  const db = createMemoryDbInstanceMock();
  const authApi = createAuthApiMock();

  beforeAll(async () => {
    await pushDb(db);
  });

  beforeEach(async () => {
    resetDb(db);
    for (const mockFn of Object.values(authApi)) {
      mockFn.mockClear();
    }
  });

  it("Get All Recipes", async () => {
    const caller = createCaller({
      authApi,
      db,
      session: null,
    });
    const recipes = await caller.recipe.getAll({});
  });
});
