import { z } from "zod/v4";
import { and, eq, gte, ilike, lte, sql, or } from "drizzle-orm";

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
    // Have to do this otherwise marker get cut off at the dateline
    const normalizeLongitude = (lng: number) => {
      return ((lng + 180) % 360 + 360) % 360 - 180;
    };
    const longitudeCondition = input.bounds ? 
      (() => {
        const normalizedWest = normalizeLongitude(input.bounds.west);
        const normalizedEast = normalizeLongitude(input.bounds.east);

        if (normalizedWest <= normalizedEast) {
          // Normal case
          return and(
            gte(sql`${recipe.position}[0]`, normalizedWest.toString()),
            lte(sql`${recipe.position}[0]`, normalizedEast.toString())
          );
        }
        else {
          // Crosses the dateline
          return or(
            gte(sql`${recipe.position}[0]`, normalizedWest.toString()),
            lte(sql`${recipe.position}[0]`, normalizedEast.toString())
          );
        }
      })() : sql`TRUE`;

    return await ctx.db
      .select()
      .from(recipe)
      .where(
        and(
          ...(input.bounds != null ? [
            gte(sql`${recipe.position}[1]`, input.bounds.south.toString()),
            lte(sql`${recipe.position}[1]`, input.bounds.north.toString()),
            longitudeCondition
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