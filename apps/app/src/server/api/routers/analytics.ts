import AnalyticsService, { analyticsWithin, days } from "@/services/analytics";
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

      const { currentCount: currentTotalClicks, previousCount: previousTotalClicks } =
        await AnalyticsService.get("CLICK", userId, within);
      const { currentCount: currentTotalViews, previousCount: previousTotalViews } =
        await AnalyticsService.get("VIEW", userId, within);

      const currentCTR = parseFloat(((currentTotalClicks / currentTotalViews) * 100).toFixed(2));
      const previousCTR = parseFloat(((previousTotalClicks / previousTotalViews) * 100).toFixed(2));

      const increasedPercentage =
        currentCTR - previousCTR === 0
          ? 0
          : parseFloat((((currentCTR - previousCTR) / previousCTR) * 100).toFixed(2));

      return { currentCTR, increasedPercentage, previousCTR };
    }),

  getCountryAnalytics: protectedProcedure
    .input(
      z.object({
        within: analyticsWithin,
      })
    )
    .query(async ({ ctx, input }) => {
      const today = new Date();
      const { within } = input;
      const isAllTime = within === "ALL_TIME";

      const analytics = await ctx.prisma.analytics.groupBy({
        by: ["fromCountry"],
        where: {
          userId: ctx.session.user.id,
          createdAt: isAllTime
            ? {}
            : {
                gt: new Date(today.getTime() - days[within] * 24 * 60 * 60 * 1000),
                lt: new Date(),
              },
          fromCountry: {
            not: null,
          },
        },
        _count: {
          fromCountry: true,
        },
        orderBy: {
          _count: {
            fromCountry: "desc",
          },
        },
      });

      return analytics.map((item) => ({
        country: item.fromCountry,
        count: item._count.fromCountry,
      }));
    }),
});

export default analyticsRouter;
