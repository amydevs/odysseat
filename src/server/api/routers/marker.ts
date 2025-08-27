import { z } from "zod";
import { and, gte, ilike, lte } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { markers } from "~/server/db/schema";

// TODO: Add to-from filtering as well
export const markerRouter = createTRPCRouter({
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
    const conditions = [];
    
    if (input.bounds) {
      conditions.push(
        gte(markers.latitude, input.bounds.south.toString()),
        lte(markers.latitude, input.bounds.north.toString()),
        gte(markers.longitude, input.bounds.west.toString()),
        lte(markers.longitude, input.bounds.east.toString())
      );
    }
    
    if (input.title) {
      conditions.push(ilike(markers.title, `%${input.title}%`));
    }
    
    let whereClause;
    if (conditions.length > 0) {
      whereClause = and(...conditions); // Huh
    }
    else {
      whereClause = undefined;
    }
    
    return await ctx.db
      .select()
      .from(markers)
      .where(whereClause)
      .orderBy(markers.createdAt);
  }),
});