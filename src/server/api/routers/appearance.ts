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
});

export default appearanceRouter;
