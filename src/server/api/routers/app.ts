import { editGroupSchema } from "@/components/app/Groups";
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

export const GroupSelections = {
  id: true,
  name: true,
  links: {
    select: LinkSelections,
    orderBy: {
      index: "asc",
    },
  },
} satisfies Prisma.GroupSelect;

export const appCoreRouter = createTRPCRouter({
  getGroupsWithLinks: protectedProcedure.query(async ({ ctx }) => {
    const groups = await ctx.prisma.group.findMany({
      where: { userId: ctx.session.user.id },
      select: GroupSelections,
      orderBy: {
        index: "asc",
      },
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

  editLink: protectedProcedure
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

  reorderLinks: protectedProcedure
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

  reorderGroups: protectedProcedure
    .input(
      z.object({
        newOrder: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { newOrder } = input;

      newOrder.map(async (groupId) => {
        const group = await ctx.prisma.group.findUnique({
          where: { id: groupId },
          select: { userId: true },
        });

        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        authorizeAuthor(group.userId, ctx.session.user.id);

        await ctx.prisma.group.update({
          where: { id: groupId },
          data: { index: newOrder.indexOf(groupId) },
        });
      });

      return;
    }),
});
