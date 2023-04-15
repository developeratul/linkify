import AnalyticsService, { analyticsWithin } from "@/services/analytics";
import { detectCountry } from "@/utils/country-detector";
import deviceDetector from "@/utils/device-detector";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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

  getEventData: protectedProcedure
    .input(z.object({ within: analyticsWithin, event: z.enum(["UNIQUE_VIEW", "VIEW", "CLICK"]) }))
    .query(async ({ ctx, input }) => {
      const { within, event } = input;
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const data = await AnalyticsService.get(event, userId, within);

      return data;
    }),

  getCTRData: protectedProcedure
    .input(z.object({ within: analyticsWithin }))
    .query(async ({ ctx, input }) => {
      const { within } = input;
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const { currentCount: currentTotalClicks } = await AnalyticsService.get(
        "CLICK",
        userId,
        within
      );
      const { currentCount: currentTotalViews } = await AnalyticsService.get(
        "VIEW",
        userId,
        within
      );
      const currentCTR = parseFloat(((currentTotalClicks / currentTotalViews) * 100).toFixed(2));

      return { currentCTR };
    }),
});

export default analyticsRouter;
