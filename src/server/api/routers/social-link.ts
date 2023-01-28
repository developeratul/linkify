import { addSocialLinkSchema } from "@/components/app/SocialLinks";
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
});
