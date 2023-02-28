import { addLinkSchema } from "@/components/app/links/Links/AddLinkModal";
import { addThumbnailSchema } from "@/components/app/links/Links/AddThumbnail";
import { editLinkSchema } from "@/components/app/links/Links/EditLinkModal";
import { authorizeAuthor } from "@/helpers/auth";
import cloudinary from "@/utils/cloudinary";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const LinkSelections = {
  id: true,
  text: true,
  url: true,
  thumbnail: true,
  clickCount: true,
  hidden: true,
} satisfies Prisma.LinkSelect;

export const linkRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      addLinkSchema.extend({
        sectionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sectionId, text, url } = input;

      const link = await ctx.prisma.link.create({
        data: { text, url, sectionId, userId: ctx.session.user.id },
        select: LinkSelections,
      });

      return link;
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const linkId = input;

    const link = await ctx.prisma.link.findUnique({
      where: { id: linkId },
      select: { userId: true },
    });

    if (!link) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Link not found",
      });
    }

    authorizeAuthor(link?.userId, ctx.session.user.id);

    const deletedLink = await ctx.prisma.link.delete({
      where: { id: linkId },
      select: LinkSelections,
    });

    return deletedLink;
  }),

  edit: protectedProcedure.input(editLinkSchema.extend({ linkId: z.string() })).mutation(async ({ ctx, input }) => {
    const { linkId, ...update } = input;

    const link = await ctx.prisma.link.findUnique({
      where: { id: linkId },
      select: { userId: true },
    });

    if (!link) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Link not found",
      });
    }

    authorizeAuthor(link.userId, ctx.session.user.id);

    const updatedLink = await ctx.prisma.link.update({
      where: { id: linkId },
      data: { ...update },
      select: LinkSelections,
    });

    return updatedLink;
  }),

  reorder: protectedProcedure
    .input(
      z.object({
        newOrder: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { newOrder } = input;

      newOrder.map(async (linkId) => {
        const link = await ctx.prisma.link.findUnique({
          where: { id: linkId },
          select: { userId: true },
        });

        if (!link) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        authorizeAuthor(link.userId, ctx.session.user.id);

        await ctx.prisma.link.update({
          where: { id: linkId },
          data: { index: newOrder.indexOf(linkId) },
        });
      });

      return;
    }),

  addThumbnail: protectedProcedure
    .input(addThumbnailSchema.extend({ linkId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { linkId, url, publicId } = input;

      const link = await ctx.prisma.link.findUnique({
        where: { id: linkId },
        select: { userId: true, thumbnail: true, thumbnailPublicId: true },
      });

      if (!link) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      authorizeAuthor(link.userId, ctx.session.user.id);

      // if we have a previously uploaded thumbnail through cloudinary, then delete it first
      if (link.thumbnail && link.thumbnailPublicId) {
        await cloudinary.uploader.destroy(link.thumbnailPublicId);
      }

      const updatedLink = await ctx.prisma.link.update({
        where: { id: linkId },
        data: { thumbnail: url, thumbnailPublicId: publicId },
        select: LinkSelections,
      });

      return updatedLink;
    }),

  removeThumbnail: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const linkId = input;

    const link = await ctx.prisma.link.findUnique({
      where: { id: linkId },
      select: { userId: true, thumbnail: true, thumbnailPublicId: true },
    });

    if (!link) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    authorizeAuthor(link.userId, ctx.session.user.id);

    if (link.thumbnail && link.thumbnailPublicId) {
      await cloudinary.uploader.destroy(link.thumbnailPublicId);
    }

    const updatedLink = await ctx.prisma.link.update({
      where: { id: linkId },
      data: { thumbnail: null, thumbnailPublicId: null },
    });

    return updatedLink;
  }),

  captureClick: publicProcedure.input(z.object({ linkId: z.string() })).mutation(async ({ ctx, input }) => {
    const { linkId } = input;

    const link = await ctx.prisma.link.findUnique({
      where: { id: linkId },
      select: { clickCount: true },
    });

    if (!link) throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.link.update({
      where: { id: linkId },
      data: { clickCount: (link.clickCount || 0) + 1 },
    });

    return;
  }),
});
