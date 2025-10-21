import scrapedData from "./scrape-db/recipes.json";
import { db } from "../src/server/db";
import { account, comment, recipe, user } from "../src/server/db/schema";
import { auth } from "./auth-config";

await db.delete(comment);
await db.delete(recipe);
await db.delete(account);
await db.delete(user);

const authCtx = await auth.$context;

const u = await db
  .insert(user)
  .values({
    id: "admin",
    email: "admin@odysseat.com",
    name: "Odysseat Admin",
    username: "admin",
  })
  .returning()
  .then((us) => us[0]!);

await db.insert(account).values({
  id: "admin",
  accountId: "admin",
  userId: u.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  providerId: "credential",
  password: await authCtx.password.hash("Password@123"),
});

const u1 = await db
  .insert(user)
  .values({
    id: "normal",
    email: "normal@odysseat.com",
    name: "Odysseat Normal",
    username: "normal",
  })
  .returning()
  .then((us) => us[0]!);

await db.insert(account).values({
  id: "normal",
  accountId: "normal",
  userId: u1.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  providerId: "credential",
  password: await authCtx.password.hash("Password@123"),
});

const recipes = await db.insert(recipe)
  .values(
    await Promise.all(
      scrapedData.map(async (r) => ({
        userId: u.id,
        title: r.title,
        content:
          "# Ingredients\n" +
          r.ingredients.map((e) => `- ${e}`).join("\n\n") +
          "\n# Steps\n" +
          r.steps.map((e, i) => `## Step ${i + 1}\n${e}`).join("\n\n"),
        thumbnailUrl: r.thumbnailUrl,
        position: r.coordinates as [number, number],
      })),
    ),
  )
  .returning();

await db.insert(comment)
  .values(
    recipes.map((e) => ({
      recipeId: e.id,
      userId: u1.id,
      content: "Very good!",
      rating: 5,
    }))
  );

process.exit(0);
