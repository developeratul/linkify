import { updateProfileSchema } from "@/components/app/appearance/Profile";
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
      });

      return user.theme;
    }),
});

export default appearanceRouter;
