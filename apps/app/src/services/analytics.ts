import { prisma } from "@/server/db";
import { Events } from "@prisma/client";
import z from "zod";

export const analyticsWithin = z.enum(["WEEK", "MONTH", "ALL_TIME"]);
export type AnalyticsWithin = z.infer<typeof analyticsWithin>;

export const days: Record<AnalyticsWithin, number> = {
  WEEK: 7,
  MONTH: 30,
  ALL_TIME: 0,
};

const AnalyticsService = {
  async get(event: Events, userId: string, within: AnalyticsWithin) {
    const today = new Date();
    const isAllTime = within === "ALL_TIME";

    const currentCount = await prisma.analytics.count({
      where: {
        AND: [
          { userId },
          { event },
          isAllTime
            ? {}
            : {
                createdAt: {
                  gt: new Date(today.getTime() - days[within] * 24 * 60 * 60 * 1000),
                  lt: new Date(),
                },
              },
        ],
      },
    });

    const previousCount = await prisma.analytics.count({
      where: {
        AND: [
          { userId },
          { event },
          isAllTime
            ? {}
            : {
                createdAt: {
                  gt: new Date(today.getTime() - days[within] * 2 * 24 * 60 * 60 * 1000),
                  lt: new Date(),
                },
              },
        ],
      },
    });

    const increasedPercentage =
      // No Growth
      currentCount - previousCount === 0
        ? 0
        : // Growth or downfall percentage
          parseFloat((((currentCount - previousCount) / previousCount) * 100).toFixed(2));

    return { currentCount, previousCount, increasedPercentage };
  },
};

export default AnalyticsService;
