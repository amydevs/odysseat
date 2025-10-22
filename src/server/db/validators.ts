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

export const zRecipeCreate = createInsertSchema(recipe, {
  title: (schema) => schema.min(1),
  content: (schema) => schema.min(1),
}).omit({
  id: true,
  userId: true,
});

export const zRecipeEdit = createUpdateSchema(recipe, {
  title: (schema) => schema.min(1),
  content: (schema) => schema.min(1),
})
  .omit({ userId: true })
  .and(z.object({ id: z.number() }));

export const zCommentCreate = z.object({
  recipeId: z.number(),
  content: z.string().min(1, "Review content cannot be empty"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
});

export const zCommentEdit = z.object({
  id: z.number(),
  content: z.string().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
});
