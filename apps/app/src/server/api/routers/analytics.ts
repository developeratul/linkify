import { detectCountry } from "@/utils/country-detector";
import deviceDetector from "@/utils/device-detector";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const analyticsRouter = createTRPCRouter({
  captureLinkClick: publicProcedure
    .input(z.object({ linkId: z.string(), userAgent: z.string(), profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { linkId, userAgent, profileId } = input;

      const country = detectCountry();
      const device = deviceDetector(userAgent);

      const user = await ctx.prisma.user.findUnique({
        where: { id: profileId },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.user.update({
        where: { id: profileId },
        data: {
          analytics: {
            create: {
              event: "CLICK",
              linkId,
              fromBrowser: device?.name,
              fromCountry: country,
            },
          },
        },
      });

      return;
    }),
});

export default analyticsRouter;
