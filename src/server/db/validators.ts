import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import * as z from "zod/v4";
import { recipe } from "./schema";

export const zRecipeCreate = createInsertSchema(recipe)
    .omit({ id: true, userId: true });

export const zRecipeEdit = createUpdateSchema(recipe)
    .omit({ userId: true })
    .and(z.object({ id: z.number() }));