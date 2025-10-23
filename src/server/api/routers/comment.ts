import { z } from "zod/v4";
import { and, eq, getTableColumns, or, sql } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { comment, user } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import {
  zCommentCreate,
  zCommentEdit,
  zCommentSelect,
} from "~/server/db/validators";

export const commentRouter = createTRPCRouter({
  getByRecipeId: publicProcedure
    .input(z.object({ recipeId: z.number() }))
    .output(zCommentSelect.array())
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select()
        .from(comment)
        .innerJoin(user, eq(comment.userId, user.id))
        .where(eq(comment.recipeId, input.recipeId));
      return res.map(({ comment, user }) => ({ ...comment, user }));
    }),
  create: protectedProcedure
    .input(zCommentCreate)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(comment)
        .where(
          and(
            eq(comment.recipeId, input.recipeId),
            eq(comment.userId, ctx.session.user.id),
          ),
        )
        .limit(1);
      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "You already have a review for this recipe. Please delete your original review first.",
        });
      }
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
            or(
              ctx.session.user.role === "admin" ? sql`TRUE` : sql`FALSE`,
              eq(comment.userId, ctx.session.user.id),
            ),
          ),
        )
        .returning();
      if (c[0] == null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return c[0];
    }),
});
