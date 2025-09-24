import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod/v4";
import { recipe } from "./schema";

export const zSortOptions = z.object({
  sortBy: z.string(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const zLongLat = z.tuple([z.number(), z.number()]);

export const zRecipeFilter = createSelectSchema(recipe)
  .partial()
  .and(
    z.object({
      // search: z.string().optional(),
      minPosition: zLongLat.optional(),
      maxPosition: zLongLat.optional(),
      ...zSortOptions.shape,
      sortBy: createSelectSchema(recipe).keyof().default("createdAt"),
    }),
  );

export const zRecipeCreate = createInsertSchema(recipe).omit({
  id: true,
  userId: true,
});

export const zRecipeEdit = createUpdateSchema(recipe)
  .omit({ userId: true })
  .and(z.object({ id: z.number() }));
