import { z } from "zod";

import CheckIfAdmin from "@/lib/check-if-admin";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { redis } from "@/server/db/redis";
import { media } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { and, desc, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

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

        return {
          status: true,
          message: "Download started",
        };
      } catch (error) {
        return {
          status: false,
          message:
            error instanceof Error ? error.message : "Failed to download",
        };
      }
    }),

  clean: publicProcedure.query(async () => {
    try {
      // Check if any media's creation time is older than 1 day.
      // If so, delete it from both uploadthing and media database.
      const utapi = new UTApi();
      const todaysDate = new Date();

      const allMedia = await db.query.media.findMany();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const allPromisesToDelete = allMedia.map(async (mediaObj) => {
        const mediaDate = new Date(mediaObj.createdAt);
        const mediaOneDayAfter = new Date(
          // mediaDate.getTime() + 24 * 60 * 60 * 1000,
          mediaDate.getTime(),
        );

        if (mediaOneDayAfter > todaysDate || !mediaObj.key)
          return {
            status: true,
            message: "No media to delete",
          };

        console.log("Set to clean", mediaObj.name);

        // Now delete all the selected media from the database and uploadthing
        await utapi.deleteFiles([mediaObj.key]);
        await db.delete(media).where(eq(media.id, mediaObj.id));
      });

      return {
        status: true,
        message: "Cleaned successfully",
      };
    } catch (error) {
      console.log("Hello", error);
      return {
        status: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
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
