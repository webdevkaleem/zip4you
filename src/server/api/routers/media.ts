import { z } from "zod";

import CheckIfAdmin from "@/lib/check-if-admin";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { media } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

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

      await db
        .update(media)
        .set({
          name: input.name,
          size: input.size,
          visibility: input.visibility,
        })
        .where(eq(media.key, input.key));

      return {
        status: true,
        message: "Media saved successfully",
      };
    }),

  remove: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      const isAdmin = await CheckIfAdmin();

      if (!isAdmin) throw new Error("Unauthorized");

      // Delete from the media & document databases
      const utapi = new UTApi();
      await utapi.deleteFiles([input.key]);

      await db.delete(media).where(eq(media.key, input.key));

      return {
        status: true,
        message: "Media deleted successfully",
      };
    }),
});
