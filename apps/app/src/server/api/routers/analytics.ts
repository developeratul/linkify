import { getSubscription } from "@/lib/subscription";
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

      const currentCTR =
        parseFloat(((currentTotalClicks / currentTotalViews) * 100).toFixed(2)) || 0;
      const previousCTR =
        parseFloat(((previousTotalClicks / previousTotalViews) * 100).toFixed(2)) || 0;

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
          event: {
            not: "CLICK",
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

  getFromBrowserAnalytics: protectedProcedure
    .input(
      z.object({
        within: analyticsWithin,
      })
    )
    .query(async ({ ctx, input }) => {
      const { within } = input;
      const today = new Date();
      const isAllTime = within === "ALL_TIME";

      const analytics = await ctx.prisma.analytics.groupBy({
        by: ["fromBrowser"],
        where: {
          userId: ctx.session.user.id,
          createdAt: isAllTime
            ? {}
            : {
                gt: new Date(today.getTime() - days[within] * 24 * 60 * 60 * 1000),
                lt: new Date(),
              },
          fromBrowser: {
            not: null,
          },
          event: {
            not: "CLICK",
          },
        },
        _count: {
          fromBrowser: true,
        },
        orderBy: {
          _count: {
            fromBrowser: "desc",
          },
        },
      });

      return analytics.map((item) => ({
        browser: item.fromBrowser,
        count: item._count.fromBrowser,
      }));
    }),

  getTopLinksAnalytics: protectedProcedure
    .input(
      z.object({
        within: analyticsWithin,
      })
    )
    .query(async ({ ctx, input }) => {
      const { within } = input;
      const today = new Date();
      const isAllTime = within === "ALL_TIME";

      const analytics = await ctx.prisma.analytics.groupBy({
        by: ["linkId"],
        where: {
          userId: ctx.session.user.id,
          createdAt: isAllTime
            ? {}
            : {
                gt: new Date(today.getTime() - days[within] * 24 * 60 * 60 * 1000),
                lt: new Date(),
              },
          event: "CLICK",
        },
        _count: { linkId: true },
        orderBy: { _count: { linkId: "desc" } },
      });

      const linksWithAnalytics = await ctx.prisma.link.findMany({
        where: {
          id: {
            in: analytics
              .map((a) => a.linkId)
              .filter((linkId): linkId is string => linkId !== null),
          },
        },
        select: { id: true, url: true, text: true },
      });

      const result = analytics.map((item) => {
        const link = linksWithAnalytics.find((l) => l.id === item.linkId);
        if (!link) return null;
        return {
          linkId: item.linkId,
          count: item._count.linkId,
          url: link.url,
          text: link.text,
        };
      });

      return result.filter((item) => item !== null);
    }),

  getChartDataAnalytics: protectedProcedure
    .input(
      z.object({
        within: analyticsWithin,
      })
    )
    .query(async ({ ctx, input }) => {
      const { within } = input;
      const today = new Date();
      const isAllTime = within === "ALL_TIME";
      const userId = ctx.session.user.id;

      const { isPro } = await getSubscription(userId);

      if (!isPro) {
        return [];
      }

      const daysToFetch = isAllTime ? 30 : days[within]; // Default to 30 days for all time
      const startDate = new Date(today.getTime() - daysToFetch * 24 * 60 * 60 * 1000);

      const analytics = await ctx.prisma.analytics.findMany({
        where: {
          userId,
          event: { in: ["VIEW", "CLICK"] },
          createdAt: {
            gte: startDate,
            lte: today,
          },
        },
        select: {
          event: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Create a map of dates to store views and clicks
      const dateMap = new Map<string, { pageViews: number; clicks: number }>();

      // Initialize all dates in the range
      for (let i = 0; i < daysToFetch; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
        dateMap.set(dateKey, { pageViews: 0, clicks: 0 });
      }

      // Count views and clicks for each date
      analytics.forEach((entry) => {
        const date = entry.createdAt;
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
        const data = dateMap.get(dateKey) || { pageViews: 0, clicks: 0 };

        if (entry.event === "VIEW") {
          data.pageViews++;
        } else if (entry.event === "CLICK") {
          data.clicks++;
        }

        dateMap.set(dateKey, data);
      });

      // Convert map to array and sort by date
      const result = Array.from(dateMap.entries()).map(([date, data]) => ({
        date,
        pageViews: data.pageViews,
        clicks: data.clicks,
      }));

      return result.reverse(); // Return most recent dates first
    }),
});

export default analyticsRouter;
