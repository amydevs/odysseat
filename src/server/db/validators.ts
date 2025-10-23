import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import * as z from "zod/v4";
import { comment, recipe, user } from "./schema";

export const zSortOptions = z.object({
  sortBy: z.string(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const zLongLat = z.tuple([z.number(), z.number()]);

export const zUserSelect = z.object({
  ...createSelectSchema(user).omit({
    username: true,
    email: true,
    emailVerified: true,
  }).shape,
});

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
  title: (schema) =>
    schema.min(
      1,
      "What's in a name? That which we call a rose by any other name would smell just as sweet.",
    ),
  content: (schema) =>
    schema
      .min(1, "Content cannot be empty")
      .refine(
        (content) => content.toLowerCase().includes("# ingredients"),
        "Recipe must include an 'Ingredients' section",
      )
      .refine(
        (content) => content.toLowerCase().includes("# steps"),
        "Recipe must include a 'Steps' section",
      ),
}).omit({
  id: true,
  userId: true,
});

export const zRecipeEdit = createUpdateSchema(recipe, {
  title: (schema) =>
    schema.min(
      1,
      "What's in a name? That which we call a rose by any other name would smell just as sweet.",
    ),
  content: (schema) =>
    schema
      .min(1, "Content cannot be empty")
      .refine(
        (content) => content.toLowerCase().includes("# ingredients"),
        "Recipe must include an 'Ingredients' section",
      )
      .refine(
        (content) => content.toLowerCase().includes("# steps"),
        "Recipe must include a 'Steps' section",
      ),
})
  .omit({ userId: true })
  .and(z.object({ id: z.number() }));

export const zRecipeSelect = z.object({
  ...createSelectSchema(recipe).shape,
  user: zUserSelect,
});

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

export const zCommentSelect = z.object({
  ...createSelectSchema(comment).shape,
  user: zUserSelect,
});
