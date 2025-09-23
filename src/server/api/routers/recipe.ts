import { z } from "zod/v4";
import { and, eq, ilike, sql, getTableColumns } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { recipe } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { zRecipeCreate, zRecipeEdit, zRecipeFilter } from "~/server/db/validators";

export const recipeRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const r = await ctx.db
        .select()
        .from(recipe)
        .where(eq(recipe.id, input.id))
      if (r.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return r[0]!;
    }),
  getAll: publicProcedure
    .input(zRecipeFilter)
    .query(async ({ ctx, input }) => {
      const { minPosition, maxPosition, ...inputRest } = input;
      const recipeCols = getTableColumns(recipe);
      return await ctx.db
        .select()
        .from(recipe)
        .where(
          and(
            input.minPosition != null && input.maxPosition != null ? sql`${recipe.position} <@ box(
              point(${input.minPosition[0]}, ${input.minPosition[1]}),
              point(${input.maxPosition[0]}, ${input.maxPosition[1]})
            )` : sql`TRUE`,
            ...Object.entries(inputRest)
              .map(([k, v]) => {
                if (v == null || !(k in recipeCols)) {
                  return sql`TRUE`;
                }
                const col = recipeCols[k as keyof typeof recipeCols];
                if (col.dataType !== "string" || typeof v !== "string") {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                  return eq(col, v as any);
                }
                return ilike(col, `%${v}%`);
              }),
          )
        )
        .orderBy(recipe.createdAt);
    }),
  create: protectedProcedure
    .input(zRecipeCreate)
    .mutation(async ({ ctx, input }) => {
      const r = await ctx.db
        .insert(recipe)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .returning();
      return r[0]!;
    }),
  edit: protectedProcedure
    .input(zRecipeEdit)
    .mutation(async ({ ctx, input }) => {
      const r = await ctx.db
        .update(recipe)
        .set(input)
        .where(
          and(
            eq(recipe.id, input.id),
            eq(recipe.userId, ctx.session.user.id),
          ),
        )
        .returning();
      if (r[0] == null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return r[0];
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const r = await ctx.db
        .delete(recipe)
        .where(
          and(
            eq(recipe.id, input.id),
            eq(recipe.userId, ctx.session.user.id),
          ),
        )
        .returning();
      if (r[0] == null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return r[0];
    })
});