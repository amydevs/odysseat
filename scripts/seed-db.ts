import scrapedData from "./scrape-db/recipes.json";
import { db } from "../src/server/db";
import { recipe, user } from "../src/server/db/schema";

await db.delete(user);
await db.delete(recipe);

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
        content: r.steps.join("\n"),
        thumbnailUrl: r.thumbnailUrl,
        position: r.coordinates as [number, number],
    }))
);

process.exit(0);