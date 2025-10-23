import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { user } from "~/server/db/schema";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { zUserSelect } from "~/server/db/validators";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(zUserSelect)
    .query(async ({ ctx, input }) => {
      const r = await ctx.db.select().from(user).where(eq(user.id, input.id));
      if (r.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return r[0]!;
    }),
});
