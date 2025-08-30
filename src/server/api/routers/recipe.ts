import { z } from "zod/v4";
import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { recipe } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { createUpdateSchema } from "drizzle-zod";

export const recipeRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const recipes = await ctx.db
        .select()
        .from(recipe)
        .where(eq(recipe.id, input.id))
      if (recipes.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return recipes[0]!;
    }),
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
  update: publicProcedure
    .input(createUpdateSchema(recipe).and(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(recipe)
        .set(input)
        .where(eq(recipe.id, input.id));
    })
});