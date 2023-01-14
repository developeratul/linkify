import { editGroupSchema } from "@/components/app/Groups";
import { authorizeAuthor } from "@/helpers/auth";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { LinkSelections } from "./link";

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

export const groupRouter = createTRPCRouter({
  getWithLinks: protectedProcedure.query(async ({ ctx }) => {
    const groups = await ctx.prisma.group.findMany({
      where: { userId: ctx.session.user.id },
      select: GroupSelections,
      orderBy: {
        index: "asc",
      },
    });
    return groups;
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const group = await ctx.prisma.group.create({
      data: { userId: ctx.session.user.id },
      select: GroupSelections,
    });
    return group;
  }),

  delete: protectedProcedure
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

  edit: protectedProcedure
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

  reorder: protectedProcedure
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
