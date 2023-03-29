import { onboardingSchema } from "@/pages/auth/onboarding";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  setupAccount: protectedProcedure
    .input(onboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const { username, bio } = input;

      const prevUser = await ctx.prisma.user.findUnique({
        where: { username },
      });

      if (prevUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken",
        });
      }

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { username, bio },
      });

      return {
        title: "You are all set!",
        description: "You can start setting up your page 🎉",
      };
    }),
});
