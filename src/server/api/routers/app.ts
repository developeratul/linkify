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
});
