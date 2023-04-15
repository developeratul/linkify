import { prisma } from "@/server/db";
import { Events } from "@prisma/client";
import z from "zod";

export const analyticsWithin = z.enum(["WEEK", "MONTH", "ALL_TIME"]);
export type AnalyticsWithin = z.infer<typeof analyticsWithin>;

const days: Record<AnalyticsWithin, number> = {
  WEEK: 7,
  MONTH: 30,
  ALL_TIME: 0,
};

const AnalyticsService = {
  async get(event: Events, userId: string, within: AnalyticsWithin) {
    const today = new Date();

    const currentCount = await prisma.analytics.count({
      where: {
        AND: [
          { userId },
          { event },
          {
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
          {
            createdAt: {
              gt: new Date(today.getTime() - days[within] * 2 * 24 * 60 * 60 * 1000),
              lt: new Date(),
            },
          },
        ],
      },
    });

    const increasePercentage = Math.floor(((currentCount - previousCount) / previousCount) * 100);

    return { currentCount, previousCount, increasePercentage };
  },
};

export default AnalyticsService;
