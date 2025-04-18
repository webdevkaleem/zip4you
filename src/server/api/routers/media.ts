import { z } from "zod";

import { env } from "@/env";
import CheckIfAdmin from "@/lib/check-if-admin";
import { labelToSlug, slugToLabel } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { redis } from "@/server/db/redis";
import { media } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { and, desc, eq } from "drizzle-orm";
import { UTApi, UTFile } from "uploadthing/server";

const mediaDownloadRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "media_download_limit",
});

const mediaCleanRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(2, "10 m"),
  prefix: "media_clean_limit",
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

  admin: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async () => {
      const isAdmin = await CheckIfAdmin();

      if (!isAdmin) throw new Error("Unauthorized");

      const allMedia = await db.query.media.findMany({
        orderBy: [desc(media.updatedAt)],
        columns: {
          userId: false,
        },
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

      const utapi = new UTApi();

      const { userId } = await auth();

      const mediaCreated = await db
        .insert(media)
        .values({
          key: input.key,
          name: labelToSlug(input.name),
          size: input.size,
          userId: userId,
        })
        .returning();

      const uploadthingMediaUpdated = await utapi.renameFiles({
        fileKey: input.key,
        newName: `${slugToLabel(labelToSlug(input.name))}.zip`,
      });

      if (!mediaCreated[0]) return { status: false, message: "Failed to save" };

      if (!uploadthingMediaUpdated.success)
        return { status: false, message: "Failed to save on uploadthing" };

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

      const utapi = new UTApi();

      const mediaUpdated = await db
        .update(media)
        .set({
          name: slugToLabel(labelToSlug(input.name)),
          size: input.size,
          visibility: input.visibility,
        })
        .where(eq(media.key, input.key))
        .returning();

      const uploadthingMediaUpdated = await utapi.renameFiles({
        fileKey: input.key,
        newName: `${slugToLabel(labelToSlug(input.name))}.zip`,
      });

      if (!mediaUpdated[0]) return { status: false, message: "Failed to save" };

      if (!uploadthingMediaUpdated.success)
        return { status: false, message: "Failed to save on uploadthing" };

      const mediaCreatedId = mediaUpdated[0].id;

      // REDIS: Reset the file download number in cache
      await redis.set(`media:${mediaCreatedId}`, 0);

      console.log("updated media name: ", mediaUpdated[0].name);

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

  clean: publicProcedure.query(async ({ ctx }) => {
    try {
      // REDIS: Rate limit
      const ip =
        ctx.headers.get("x-real-ip") ??
        ctx.headers.get("x-forwarded-for") ??
        "127.0.0.1";

      const { success } = await mediaCleanRatelimit.limit(ip);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You have exceeded the cleaning limit",
        });
      }

      // Check if any media's creation time is older than 1 day.
      // If so, delete it from both uploadthing and media database.
      const utapi = new UTApi();
      const todaysDate = new Date();

      const allMedia = await db.query.media.findMany();

      const allPromisesToDelete = allMedia.map(async (mediaObj) => {
        const mediaDate = new Date(mediaObj.createdAt);
        const mediaOneDayAfter = new Date(
          mediaDate.getTime() + 24 * 60 * 60 * 1000,
        );

        if (mediaOneDayAfter > todaysDate) {
          return {
            status: true,
            message: "No media to delete",
          };
        }

        if (!mediaObj.key) {
          return {
            status: true,
            message: "No media to delete",
          };
        }

        // Now delete all the selected media from the database and uploadthing
        // The 'await' keyword is required as then the Promise.All doesn't wait for the promises to resolve
        return [
          await utapi.deleteFiles([mediaObj.key]),
          await db.delete(media).where(eq(media.id, mediaObj.id)),
        ];
      });

      if (allPromisesToDelete.length === 0) {
        return {
          status: true,
          message: "No media to delete",
        };
      }

      await Promise.all(allPromisesToDelete);

      return {
        status: true,
        message: `Cleaned ${allMedia.length} media successfully`,
      };
    } catch (error) {
      return {
        status: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }),

  gmail: publicProcedure.query(async ({ ctx }) => {
    try {
      const isAdmin =
        env.ZAPIER_ADMIN_TOKEN === ctx.headers.get("zapier-admin-token");
      if (!isAdmin) throw new TRPCError({ code: "UNAUTHORIZED" });

      const attachments = ctx.headers.get("attachments");
      const subject = ctx.headers.get("subject");
      const from_email = ctx.headers.get("from_email");

      if (!attachments || !subject || !from_email)
        return new TRPCError({ code: "BAD_REQUEST" });

      // Check if the correct person sen't the mail
      const allowedEmails = ["muneeb.ict@gmail.com", "webdevkaleem@gmail.com"];

      if (!allowedEmails.includes(from_email)) {
        return new TRPCError({ code: "FORBIDDEN" });
      }

      const subjectFormatted = slugToLabel(labelToSlug(subject));

      // Fetch the attachments
      const attachmentsFetch = await fetch(attachments);

      // Convert the attachmentsFetch into a buffer
      const attachmentsBuffer = await attachmentsFetch.arrayBuffer();

      // Convert the attachmentsFile to a file
      const attachmentsFile = new UTFile(
        [attachmentsBuffer],
        `${subjectFormatted}.zip`,
        {
          type: "application/zip",
        },
      );

      // Now we can create a new media in uploadthing
      const utapi = new UTApi();

      const returnedUploadedFiles = await utapi.uploadFiles([attachmentsFile]);

      if (!returnedUploadedFiles[0]?.data)
        return new TRPCError({ code: "BAD_REQUEST" });

      // Saving in the document database
      await db.insert(media).values({
        key: returnedUploadedFiles[0].data.key,

        // The name / subject is taken from the request body and formatted (without the .zip extension)
        name: subjectFormatted,
        size: returnedUploadedFiles[0].data.size,
        visibility: "public",
        userId: "zapier",
      });

      return {
        status: true,
        message: "Media saved successfully",
      };
    } catch (error) {
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
