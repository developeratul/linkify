import { addSocialLinkSchema } from "@/components/app/SocialLinks";
import { authorizeAuthor } from "@/helpers/auth";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const socialLinkRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const socialLinks = await ctx.prisma.socialLink.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { index: "asc" },
    });

    return socialLinks;
  }),

  create: protectedProcedure
    .input(addSocialLinkSchema)
    .mutation(async ({ ctx, input }) => {
      const { type, url } = input;

      const link = await ctx.prisma.socialLink.create({
        data: { type, url, userId: ctx.session.user.id },
      });

      return link;
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

        await ctx.prisma.link.update({
          where: { id: socialLinkId },
          data: { index: newOrder.indexOf(socialLinkId) },
        });
      });

      return;
    }),
});
