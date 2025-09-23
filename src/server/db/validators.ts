import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";
import * as z from "zod/v4";
import { recipe } from "./schema";

export const zSortOptions = z.object({
    sortBy: z.string().default("id"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const zLongLat = z.tuple([z.number(), z.number()]);

export const zRecipeFilter = createSelectSchema(recipe)
    .partial()
    .and(zSortOptions)
    .and(z.object({
        minPosition: zLongLat.optional(),
        maxPosition: zLongLat.optional(),
        sortBy: createSelectSchema(recipe).keyof().default("createdAt"),
    }));

export const zRecipeCreate = createInsertSchema(recipe)
    .omit({ id: true, userId: true });

export const zRecipeEdit = createUpdateSchema(recipe)
    .omit({ userId: true })
    .and(z.object({ id: z.number() }));