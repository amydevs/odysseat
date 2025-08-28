import { z } from "zod";
import { and, gte, ilike, lte, sql } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { recipe } from "~/server/db/schema";

export const recipeRouter = createTRPCRouter({
  getAll: publicProcedure
  .input(z.object({
    bounds: z.object({ // Bounding box for filtering markers
        north: z.number(), // TODO: make a helper for bounding box calculation from map view
        south: z.number(),
        east: z.number(),
        west: z.number(),
    }).optional(),
    title: z.string().optional(),
  }))
  .query(async ({ ctx, input }) => {
    return await ctx.db
      .select()
      .from(recipe)
      .where(
        and(
          ...(input.bounds != null ? [
            gte(sql`${recipe.position}[1]`, input.bounds.south.toString()),
            lte(sql`${recipe.position}[1]`, input.bounds.north.toString()),
            gte(sql`${recipe.position}[0]`, input.bounds.west.toString()),
            lte(sql`${recipe.position}[0]`, input.bounds.east.toString())
          ] : []),
          (input.title != null ? ilike(recipe.title, `%${input.title}%`) : sql`TRUE`)
        )
      )
      .orderBy(recipe.createdAt);
  }),
});