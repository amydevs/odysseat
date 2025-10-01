import { createAuthApiMock } from "__mocks__/authApi";
import { createMemoryDbInstanceMock, pushDb, resetDb } from "__mocks__/db";
import { createSessionMock, insertSessionDb } from "__mocks__/session";
import { seed } from "drizzle-seed";
import { describe } from "node:test";
import { beforeAll, beforeEach, expect, it } from "vitest";
import { createCaller } from "~/server/api/root";
import * as schema from "~/server/db/schema";

await describe("recipe rpc calls", () => {
  const db = createMemoryDbInstanceMock();
  const authApi = createAuthApiMock();
  const session = createSessionMock();
  const testRecipe = {
    title: "Test",
    content: "Test",
    position: [0, 0] as [number, number],
    thumbnailUrl: "https://test.com",
  };

  beforeAll(async () => {
    await pushDb(db);
  });

  beforeEach(async () => {
    await resetDb(db);
    await insertSessionDb(db, session);
    for (const mockFn of Object.values(authApi)) {
      mockFn.mockClear();
    }
  });
  it("create recipe unauthorized", async () => {
    const caller = createCaller({
      authApi,
      db,
      session: null,
    });
    await expect(caller.recipe.create(testRecipe)).rejects.toThrowError();
  });
  it("create recipe", async () => {
    const caller = createCaller({
      authApi,
      db,
      session,
    });
    const createdRecipe = await caller.recipe.create(testRecipe);
    const foundRecipe = await db.query.recipe.findFirst({
      where: {
        id: createdRecipe.id,
      },
    });
    expect(foundRecipe).toMatchObject(testRecipe);
  });
  it("update recipe", async () => {
    const caller = createCaller({
      authApi,
      db,
      session,
    });
    const createdRecipe = await db
      .insert(schema.recipe)
      .values([
        {
          ...testRecipe,
          userId: session.user.id,
        },
      ])
      .returning()
      .then((e) => e[0]!);
    const editedRecipeDetails: Parameters<typeof caller.recipe.edit>[0] = {
      ...createdRecipe,
      title: "New Title",
    };
    await caller.recipe.edit(editedRecipeDetails);
    const foundRecipe = await db.query.recipe.findFirst({
      where: {
        id: createdRecipe.id,
      },
    });
    expect(foundRecipe).toMatchObject(editedRecipeDetails);
  });
  it("update recipe unauthorized", async () => {
    const badUserId = "nottestuser";
    const caller = createCaller({
      authApi,
      db,
      session: {
        session: {
          ...session.session,
          userId: badUserId,
        },
        user: {
          ...session.user,
          id: badUserId,
        },
      },
    });
    const createdRecipe = await db
      .insert(schema.recipe)
      .values([
        {
          ...testRecipe,
          userId: session.user.id,
        },
      ])
      .returning()
      .then((e) => e[0]!);
    await expect(
      caller.recipe.edit({
        ...createdRecipe,
        title: "New Title",
      }),
    ).rejects.toThrowError();
  });
  it("get all recipes", async () => {
    const caller = createCaller({
      authApi,
      db,
      session: null,
    });
    await seed(db, schema, { count: 20 });
    const seededRecipes = await db.query.recipe.findMany({
      orderBy: {
        content: "desc",
      },
    });
    const recipes = await caller.recipe.getAll({
      sortBy: "content",
      sortOrder: "desc",
    });
    for (const [i, recipe] of recipes.entries()) {
      expect(seededRecipes[i]).toMatchObject(recipe);
    }
  });
  it("delete recipe", async () => {
    const caller = createCaller({
      authApi,
      db,
      session,
    });
    const createdRecipe = await db
      .insert(schema.recipe)
      .values([
        {
          ...testRecipe,
          userId: session.user.id,
        },
      ])
      .returning()
      .then((e) => e[0]!);
    await expect(caller.recipe.delete(createdRecipe)).resolves.toMatchObject(
      createdRecipe,
    );
  });
  it("delete recipe unauthorized", async () => {
    const badUserId = "nottestuser";
    const caller = createCaller({
      authApi,
      db,
      session: {
        session: {
          ...session.session,
          userId: badUserId,
        },
        user: {
          ...session.user,
          id: badUserId,
        },
      },
    });
    const createdRecipe = await db
      .insert(schema.recipe)
      .values([
        {
          ...testRecipe,
          userId: session.user.id,
        },
      ])
      .returning()
      .then((e) => e[0]!);
    await expect(caller.recipe.delete(createdRecipe)).rejects.toThrowError();
  });
});
