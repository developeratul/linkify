import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const analyticsRouter = createTRPCRouter({
  captureLinkClick: publicProcedure
    .input(
      z.object({
        linkId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { linkId } = input;

      const link = await ctx.prisma.link.findUnique({
        where: { id: linkId },
        select: { clickCount: true },
      });

      if (!link) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.link.update({
        where: { id: linkId },
        data: { clickCount: link.clickCount + 1 },
      });

      return;
    }),
});

export default analyticsRouter;
