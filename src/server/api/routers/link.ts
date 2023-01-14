import { createLinkSchema, editLinkSchema } from "@/components/app/Links";
import { authorizeAuthor } from "@/helpers/auth";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const LinkSelections = {
  id: true,
  text: true,
  url: true,
  icon: true,
} satisfies Prisma.LinkSelect;

export const linkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      createLinkSchema.extend({
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, text, url } = input;

      const link = await ctx.prisma.link.create({
        data: { text, url, groupId, userId: ctx.session.user.id },
        select: LinkSelections,
      });

      return link;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
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

  edit: protectedProcedure
    .input(editLinkSchema.extend({ linkId: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
});
