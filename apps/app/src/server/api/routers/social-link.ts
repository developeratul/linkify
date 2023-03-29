import { authorizeAuthor } from "@/helpers/auth";
import SocialLinkService from "@/services/social-link";
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
    const socialLinks = await SocialLinkService.findMany(ctx.session.user.id);
    return socialLinks;
  }),

  add: protectedProcedure
    .input(z.object({ url: z.string().url(), icon: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { icon, url } = input;
      const userId = ctx.session.user.id;

      const previousSocialLink = await SocialLinkService.findLast(userId);

      let socialLink;

      if (previousSocialLink) {
        socialLink = await ctx.prisma.socialLink.create({
          data: { icon, url, userId, index: previousSocialLink.index + 1 },
        });
      } else {
        socialLink = await ctx.prisma.socialLink.create({
          data: { icon, url, userId, index: 0 },
        });
      }

      return socialLink;
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const socialLinkId = input;
    const userId = ctx.session.user.id;

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

    // update the order of current social links
    const updatedSocialLinksList = await SocialLinkService.findMany(userId);
    updatedSocialLinksList.map(async (item, index) => {
      await ctx.prisma.socialLink.update({
        where: { id: item.id },
        data: { index },
      });
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

      for (const socialLinkId of newOrder) {
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
      }

      return;
    }),
});
