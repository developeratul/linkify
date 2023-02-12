import { updateProfileSchema } from "@/components/app/appearance/Profile";
import cloudinary from "@/utils/cloudinary";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
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

  getTheme: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { theme: true },
    });
    return user?.theme;
  }),

  updateTheme: protectedProcedure
    .input(z.enum(["DARK", "LIGHT"]))
    .mutation(async ({ input, ctx }) => {
      const updatedTheme = input;

      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { theme: updatedTheme },
        select: { theme: true },
      });

      return user.theme;
    }),

  getFont: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { font: true },
    });
    return user?.font;
  }),

  updateFont: protectedProcedure
    .input(
      z.enum(["body", "serif", "sans_serif", "monospace", "cursive", "fantasy"])
    )
    .mutation(async ({ input, ctx }) => {
      const updatedFont = input;

      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { font: updatedFont },
        select: { font: true },
      });

      return user.font;
    }),

  getBackgroundImage: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { backgroundImage: true, image: true },
    });
    return user?.backgroundImage || user?.image;
  }),

  updateBackgroundImage: protectedProcedure
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
        select: { backgroundImage: true, backgroundImagePublicId: true },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const { backgroundImage, backgroundImagePublicId } = user;

      if (backgroundImage && backgroundImagePublicId) {
        await cloudinary.uploader.destroy(backgroundImagePublicId);
      }

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { backgroundImage: url, backgroundImagePublicId: id },
      });

      return;
    }),
});

export default appearanceRouter;
