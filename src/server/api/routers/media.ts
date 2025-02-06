import { z } from "zod";

import CheckIfAdmin from "@/lib/check-if-admin";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { media } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { redis } from "@/server/db/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { TRPCError } from "@trpc/server";

const mediaDownloadRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
});

export const mediaRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const isAdmin = await CheckIfAdmin();

    const allMedia = await db.query.media.findMany({
      orderBy: [desc(media.updatedAt)],
      columns: {
        userId: false,
      },

      // If the user is not an admin, only show public media
      ...(!isAdmin && {
        where: and(eq(media.visibility, "public")),
      }),
    });

    return allMedia;
  }),

  my: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const isAdmin = await CheckIfAdmin();

      if (!isAdmin) throw new Error("Unauthorized");

      const allMedia = await db.query.media.findMany({
        orderBy: [desc(media.updatedAt)],
        columns: {
          userId: false,
        },
        where: eq(media.userId, input.userId),
      });

      return allMedia;
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        size: z.number(),
        key: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const isAdmin = await CheckIfAdmin();

      if (!isAdmin) throw new Error("Unauthorized");

      const { userId } = await auth();

      const mediaCreated = await db
        .insert(media)
        .values({
          key: input.key,
          name: input.name,
          size: input.size,
          userId: userId,
        })
        .returning();

      if (!mediaCreated[0]) return { status: false, message: "Failed to save" };

      const mediaCreatedId = mediaCreated[0].id;

      // REDIS: Add the file download number in cache
      await redis.set(`media:${mediaCreatedId}`, 0);

      return {
        status: true,
        data: mediaCreated,
        message: "Media saved successfully",
      };
    }),

  edit: publicProcedure
    .input(
      z.object({
        name: z.string(),
        size: z.number(),
        key: z.string(),
        visibility: z.enum(["public", "private"]),
      }),
    )
    .mutation(async ({ input }) => {
      const isAdmin = await CheckIfAdmin();

      if (!isAdmin) throw new Error("Unauthorized");

      const mediaUpdated = await db
        .update(media)
        .set({
          name: input.name,
          size: input.size,
          visibility: input.visibility,
        })
        .where(eq(media.key, input.key))
        .returning();

      if (!mediaUpdated[0]) return { status: false, message: "Failed to save" };

      const mediaCreatedId = mediaUpdated[0].id;

      // REDIS: Reset the file download number in cache
      await redis.set(`media:${mediaCreatedId}`, 0);

      return {
        status: true,
        message: "Media saved successfully",
      };
    }),

  download: publicProcedure
    .input(z.object({ mediaId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // REDIS: Rate limit
        const ip =
          ctx.headers.get("x-real-ip") ??
          ctx.headers.get("x-forwarded-for") ??
          "127.0.0.1";

        const { success } = await mediaDownloadRatelimit.limit(ip);

        if (!success) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have exceeded the download limit",
          });
        }

        // REDIS: Increment the file download number in cache
        await redis.incr(`media:${input.mediaId}`);

        return;
      } catch (error) {
        return {
          status: false,
          message:
            error instanceof Error ? error.message : "Failed to download",
        };
      }
    }),

  remove: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const isAdmin = await CheckIfAdmin();

      if (!isAdmin) throw new Error("Unauthorized");

      // Delete from the media & document databases
      const utapi = new UTApi();
      await utapi.deleteFiles([input.key]);

      const mediaDeleted = await db
        .delete(media)
        .where(eq(media.key, input.key))
        .returning();

      if (!mediaDeleted[0])
        return { status: false, message: "Failed to delete" };

      const mediaDeletedId = mediaDeleted[0].id;

      // Remove the count from the redis cache
      await redis.del(`media:${mediaDeletedId}`);

      return {
        status: true,
        message: "Media deleted successfully",
      };
    }),
});
