import { reset } from "drizzle-seed";
import scrapedData from "./scrape-db/recipes.json";
import { db } from "../src/server/db";
import * as schema from "../src/server/db/schema";
import { recipe, user } from "../src/server/db/schema";

await reset(db, schema);

const u = await db.insert(user).values({
    id: "admin",
    email: "admin@odysseat.com",
    name: "Odysseat Admin"
})
.returning();

await db.insert(recipe).values(
    scrapedData.map((r) => ({
        userId: u[0]!.id,
        title: r.title,
        content:
            "# Ingredients\n" +
            r.ingredients.map((e) => `- ${e}`).join("\n\n") +
            "\n# Steps\n" +
            r.steps.map((e, i) => `## Step ${i + 1}\n${e}`).join("\n\n"),
        thumbnailUrl: r.thumbnailUrl,
        position: r.coordinates as [number, number],
    }))
);

process.exit(0);