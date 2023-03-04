import { updateProfileSchema } from "@/components/app/appearance/Profile";
import { themeSchema } from "@/components/app/appearance/Theme";
import cloudinary from "@/utils/cloudinary";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ThemeSelections = {
  layout: true,
  themeColor: true,
  foreground: true,
  grayColor: true,
  bodyBackgroundType: true,
  bodyBackgroundColor: true,
  cardBackgroundColor: true,
} as Prisma.UserSelect;

const appearanceRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        profileTitle: true,
        bio: true,
        username: true,
        image: true,
      },
    });

    return user;
  }),

  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ input, ctx }) => {
    const { bio, profileTitle } = input;

    const user = await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { bio, profileTitle },
    });

    return user;
  }),

  updateProfileImage: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, url } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { image: true, imagePublicId: true },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const { image, imagePublicId } = user;

      if (image && imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId);
      }

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { image: url, imagePublicId: id },
      });

      return;
    }),

  updateTheme: protectedProcedure.input(themeSchema).mutation(async ({ ctx, input }) => {
    const update = input;

    const user = await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { ...update },
      select: ThemeSelections,
    });

    return user;
  }),

  getTheme: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: ThemeSelections,
    });

    return user;
  }),
});

export default appearanceRouter;
