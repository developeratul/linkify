import { authorizeAuthor } from "@/helpers/auth";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const SocialLinkSelections = {
  id: true,
  icon: true,
  url: true,
} satisfies Prisma.SocialLinkSelect;

export const socialLinkRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const socialLinks = await ctx.prisma.socialLink.findMany({
      where: { userId: ctx.session.user.id },
      select: SocialLinkSelections,
      orderBy: { index: "asc" },
    });

    return socialLinks;
  }),

  // add: protectedProcedure.input(addSocialLinkSchema).mutation(async ({ ctx, input }) => {
  //   const { type, url } = input;

  //   const link = await ctx.prisma.socialLink.create({
  //     data: { type, url, userId: ctx.session.user.id },
  //   });

  //   return link;
  // }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const socialLinkId = input;

    const socialLink = await ctx.prisma.socialLink.findUnique({
      where: { id: socialLinkId },
      select: { userId: true },
    });

    if (!socialLink) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Social link not found",
      });
    }

    authorizeAuthor(socialLink?.userId, ctx.session.user.id);

    const deletedSocialLink = await ctx.prisma.socialLink.delete({
      where: { id: socialLinkId },
    });

    return deletedSocialLink;
  }),

  reorder: protectedProcedure
    .input(
      z.object({
        newOrder: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { newOrder } = input;

      newOrder.map(async (socialLinkId) => {
        const socialLink = await ctx.prisma.socialLink.findUnique({
          where: { id: socialLinkId },
          select: { userId: true },
        });

        if (!socialLink) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        authorizeAuthor(socialLink.userId, ctx.session.user.id);

        await ctx.prisma.socialLink.update({
          where: { id: socialLinkId },
          data: { index: newOrder.indexOf(socialLinkId) },
        });
      });

      return;
    }),
});
