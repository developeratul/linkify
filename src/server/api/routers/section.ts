import { authorizeAuthor } from "@/helpers/auth";
import cloudinary from "@/utils/cloudinary";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { LinkSelections } from "./link";

export const SectionSelections = {
  id: true,
  name: true,
  links: {
    select: LinkSelections,
    orderBy: {
      index: "asc",
    },
  },
} satisfies Prisma.SectionSelect;

export const sectionRouter = createTRPCRouter({
  getWithLinks: protectedProcedure.query(async ({ ctx }) => {
    const groups = await ctx.prisma.section.findMany({
      where: { userId: ctx.session.user.id },
      select: SectionSelections,
      orderBy: {
        index: "asc",
      },
    });
    return groups;
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const section = await ctx.prisma.section.create({
      data: { userId: ctx.session.user.id },
      select: SectionSelections,
    });
    return section;
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const sectionId = input;

    const section = await ctx.prisma.section.findUnique({
      where: { id: sectionId },
      select: { userId: true },
    });

    if (!section) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Group not found",
      });
    }

    authorizeAuthor(section?.userId, ctx.session.user.id);

    // delete all the link thumbnails
    const links = await ctx.prisma.link.findMany({
      where: { sectionId },
      select: { thumbnail: true, thumbnailPublicId: true },
    });

    for (const link of links) {
      if (link.thumbnail && link.thumbnailPublicId) {
        await cloudinary.uploader.destroy(link.thumbnailPublicId);
      }
    }

    // delete all the corresponding links
    await ctx.prisma.link.deleteMany({
      where: { sectionId },
    });

    // finally delete the section
    const deletedSection = await ctx.prisma.section.delete({
      where: { id: sectionId },
      select: SectionSelections,
    });

    return deletedSection;
  }),

  edit: protectedProcedure
    .input(z.object({ sectionId: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { sectionId, ...update } = input;

      const section = await ctx.prisma.section.findUnique({
        where: { id: sectionId },
        select: { userId: true },
      });

      if (!section) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
        });
      }

      authorizeAuthor(section.userId, ctx.session.user.id);

      const updatedSection = await ctx.prisma.section.update({
        where: { id: sectionId },
        data: { ...update },
        select: SectionSelections,
      });

      return updatedSection;
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        newOrder: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { newOrder } = input;

      newOrder.map(async (groupId) => {
        const section = await ctx.prisma.section.findUnique({
          where: { id: groupId },
          select: { userId: true },
        });

        if (!section) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        authorizeAuthor(section.userId, ctx.session.user.id);

        await ctx.prisma.section.update({
          where: { id: groupId },
          data: { index: newOrder.indexOf(groupId) },
        });
      });

      return;
    }),
});
