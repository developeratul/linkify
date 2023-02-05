import { updateProfileSchema } from "@/components/app/appearance/Profile";
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
});

export default appearanceRouter;
