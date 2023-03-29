import { authorizeAuthor } from "@/helpers/auth";
import SectionService from "@/services/section";
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
    const sections = await SectionService.findManyWithLinks(ctx.session.user.id);
    return sections;
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const previousSection = await SectionService.findLast(ctx.session.user.id);

    let section;

    if (previousSection) {
      section = await ctx.prisma.section.create({
        data: { userId: ctx.session.user.id, index: previousSection.index + 1 },
        select: SectionSelections,
      });
    } else {
      section = await ctx.prisma.section.create({
        data: { userId: ctx.session.user.id, index: 0 },
        select: SectionSelections,
      });
    }

    return section;
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const sectionId = input;
    const userId = ctx.session.user.id;

    const section = await ctx.prisma.section.findUnique({
      where: { id: sectionId },
      select: { userId: true },
    });

    if (!section) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Section not found",
      });
    }

    authorizeAuthor(section.userId, userId);

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

    // delete the section
    const deletedSection = await ctx.prisma.section.delete({
      where: { id: sectionId },
      select: SectionSelections,
    });

    // update the order of current sections
    const updatedSectionsList = await SectionService.findManyWithLinks(userId);
    updatedSectionsList.map(async (item, index) => {
      await ctx.prisma.section.update({
        where: { id: item.id },
        data: { index },
      });
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
          message: "Section not found",
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

      for (const sectionId of newOrder) {
        const section = await ctx.prisma.section.findUnique({
          where: { id: sectionId },
          select: { userId: true },
        });

        if (!section) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        authorizeAuthor(section.userId, ctx.session.user.id);

        await ctx.prisma.section.update({
          where: { id: sectionId },
          data: { index: newOrder.indexOf(sectionId) },
        });
      }

      return;
    }),
});
