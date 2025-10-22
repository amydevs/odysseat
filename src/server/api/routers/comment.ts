import { z } from "zod/v4";
import { and, eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { comment } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { zCommentCreate, zCommentEdit } from "~/server/db/validators";

export const commentRouter = createTRPCRouter({
  getByRecipeId: publicProcedure
    .input(z.object({ recipeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(comment)
        .where(eq(comment.recipeId, input.recipeId));
    }),
  create: protectedProcedure
    .input(zCommentCreate)
    .mutation(async ({ ctx, input }) => {
      const c = await ctx.db
        .insert(comment)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .returning();
      return c[0]!;
    }),
  edit: protectedProcedure
    .input(zCommentEdit)
    .mutation(async ({ ctx, input }) => {
      const c = await ctx.db
        .update(comment)
        .set(input)
        .where(
          and(
            eq(comment.id, input.id),
            eq(comment.userId, ctx.session.user.id),
          ),
        )
        .returning();
      if (c[0] == null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return c[0];
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const c = await ctx.db
        .delete(comment)
        .where(
          and(
            eq(comment.id, input.id),
            eq(comment.userId, ctx.session.user.id),
          ),
        )
        .returning();
      if (c[0] == null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return c[0];
    }),
});
