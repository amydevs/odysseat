import { z } from "zod/v4";
import { eq, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { user } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getByIds: publicProcedure
    .input(z.object({ userIds: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: user.id,
          name: user.name,
        })
        .from(user)
        .where(sql`${user.id} IN (${sql.join(input.userIds.map((id) => sql`${id}`), sql`, `,)})`,
        );
    }),
});