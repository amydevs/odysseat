import { ServerBlockNoteEditor } from "@blocknote/server-util";
import scrapedData from "./scrape-db/recipes.json";
import { db } from "../src/server/db";
import { recipe, user } from "../src/server/db/schema";

await db.delete(recipe);
await db.delete(user);

const u = await db.insert(user).values({
    id: "admin",
    email: "admin@odysseat.com",
    name: "Odysseat Admin"
})
.returning();

const editor = ServerBlockNoteEditor.create();

await db.insert(recipe).values(
    await Promise.all(
        scrapedData.map(async (r) => ({
            userId: u[0]!.id,
            title: r.title,
            content: await editor.tryParseMarkdownToBlocks(
                "# Ingredients\n" +
                r.ingredients.map((e) => `- ${e}`).join("\n\n") +
                "\n# Steps\n" +
                r.steps.map((e, i) => `## Step ${i + 1}\n${e}`).join("\n\n")
            ),
            thumbnailUrl: r.thumbnailUrl,
            position: r.coordinates as [number, number],
        }))
    )
);

process.exit(0);