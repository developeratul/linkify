import { createLinkSchema } from "@/components/app/Link";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const GroupSelections = {
  id: true,
  name: true,
  links: {
    select: {
      id: true,
      icon: true,
      text: true,
      url: true,
    },
  },
};

export const LinkSelections = { id: true, text: true, url: true, icon: true };

export const appCoreRouter = createTRPCRouter({
  getGroupsWithLinks: protectedProcedure.query(async ({ ctx }) => {
    const groups = await ctx.prisma.group.findMany({
      select: GroupSelections,
    });
    return groups;
  }),

  createGroup: protectedProcedure.mutation(async ({ ctx }) => {
    const group = await ctx.prisma.group.create({
      data: { userId: ctx.session.user.id },
      select: GroupSelections,
    });
    return group;
  }),

  createLink: protectedProcedure
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
});
