import { editGroupSchema } from "@/components/app/Groups";
import { createLinkSchema } from "@/components/app/Link";
import { authorizeAuthor } from "@/helpers/auth";
import { TRPCError } from "@trpc/server";
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

  deleteLink: protectedProcedure
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

  deleteGroup: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const groupId = input;

      const group = await ctx.prisma.group.findUnique({
        where: { id: groupId },
        select: { userId: true },
      });

      if (!group) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Group not found",
        });
      }

      authorizeAuthor(group?.userId, ctx.session.user.id);

      await ctx.prisma.link.deleteMany({
        where: { groupId },
      });

      const deletedGroup = await ctx.prisma.group.delete({
        where: { id: groupId },
        select: GroupSelections,
      });

      return deletedGroup;
    }),

  editGroup: protectedProcedure
    .input(editGroupSchema.extend({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { groupId, ...update } = input;

      const group = await ctx.prisma.group.findUnique({
        where: { id: groupId },
        select: { userId: true },
      });

      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
        });
      }

      authorizeAuthor(group.userId, ctx.session.user.id);

      const updatedGroup = await ctx.prisma.group.update({
        where: { id: groupId },
        data: { ...update },
        select: GroupSelections,
      });

      return updatedGroup;
    }),
});
