import { buttonSchema } from "@/components/app/appearance/Button";
import { layoutSchema } from "@/components/app/appearance/Layout";
import { updateProfileSchema } from "@/components/app/appearance/Profile";
import { themeSchema } from "@/components/app/appearance/Theme/CustomThemeEditor";
import cloudinary from "@/utils/cloudinary";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ProfileThemeSelections = {
  bodyBackgroundColor: true,
  bodyBackgroundImage: true,
  bodyBackgroundType: true,
  cardBackgroundColor: true,
  cardShadow: true,
  font: true,
  foreground: true,
  grayColor: true,
  themeColor: true,
} satisfies Prisma.ThemeSelect;

export const ProfileSettingsSelections = {
  seoTitle: true,
  seoDescription: true,
  socialIconPlacement: true,
} satisfies Prisma.SettingsSelect;

export const ProfileLayoutSelections = {
  containerWidth: true,
  layout: true,
  linksColumnCount: true,
} satisfies Prisma.LayoutSelect;

export const ProfileButtonSelections = {
  buttonBackground: true,
  buttonStyle: true,
} satisfies Prisma.ButtonSelect;

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

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

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

  updateLayout: protectedProcedure.input(layoutSchema).mutation(async ({ ctx, input }) => {
    const update = input;

    const user = await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        layout: {
          upsert: {
            create: { ...update },
            update: { ...update },
          },
        },
      },
      select: { layout: true },
    });

    return user.layout;
  }),

  getLayout: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        layout: true,
      },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user.layout;
  }),

  updateTheme: protectedProcedure
    .input(
      themeSchema.extend({
        theme: z.string().optional(),
        isCustomTheme: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = input;

      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          theme: {
            upsert: {
              create: { ...update },
              update: { ...update },
            },
          },
        },
        select: { theme: true },
      });

      return user.theme;
    }),

  getTheme: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { theme: true },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user.theme;
  }),

  toggleCustomTheme: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        theme: {
          upsert: {
            create: { isCustomTheme: false },
            update: { isCustomTheme: !user.theme?.isCustomTheme },
          },
        },
      },
    });

    return;
  }),

  deleteImage: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        theme: {
          select: {
            bodyBackgroundImage: true,
            bodyBackgroundImagePublicId: true,
          },
        },
      },
    });

    if (!user || !user.theme) throw new TRPCError({ code: "NOT_FOUND" });

    const { bodyBackgroundImage, bodyBackgroundImagePublicId } = user.theme;

    if (bodyBackgroundImage && bodyBackgroundImagePublicId) {
      await cloudinary.uploader.destroy(bodyBackgroundImagePublicId);
    }

    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        theme: {
          update: {
            bodyBackgroundImage: null,
            bodyBackgroundImagePublicId: null,
          },
        },
      },
    });

    return;
  }),

  getButtonStyle: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: {
        button: true,
      },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user.button;
  }),

  updateButtonStyle: protectedProcedure.input(buttonSchema).mutation(async ({ ctx, input }) => {
    const update = input;
    await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        button: {
          upsert: {
            create: { ...update },
            update: { ...update },
          },
        },
      },
      select: { button: true },
    });
    return;
  }),
});

export default appearanceRouter;
