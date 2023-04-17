import { getSubscription } from "@/lib/subscription";
import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export const TestimonialSelections = {
  id: true,
  name: true,
  email: true,
  message: true,
  rating: true,
  shouldShow: true,
  avatar: true,
  createdAt: true,
} satisfies Prisma.TestimonialSelect;

const TestimonialService = {
  async findMany(userId: string, customSelections?: Prisma.TestimonialSelect) {
    const testimonials = await prisma.testimonial.findMany({
      where: { userId: userId },
      select: customSelections || TestimonialSelections,
      orderBy: { createdAt: "desc" },
    });
    return testimonials;
  },

  /**
   * Returns the number of testimonials the user has received in the current month
   */
  async getTestimonialCountThisMonth(userId: string) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // get current month (1-12)
    const currentYear = currentDate.getFullYear(); // get current year

    const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
    const endDate = new Date(Date.UTC(currentYear, currentMonth, 1));

    const count = await prisma.testimonial.count({
      where: {
        AND: [
          { userId: userId },
          { createdAt: { gte: startDate } },
          { createdAt: { lt: endDate } },
        ],
      },
    });

    return count;
  },

  /**
   * Checks if the user has exceeded the limit of receiving testimonials per month in his free plan
   */
  async checkIfLimitExceededInFreePlan(userId: string) {
    const totalTestimonialsReceivedThisMonth = await this.getTestimonialCountThisMonth(userId);

    const hasExceeded = totalTestimonialsReceivedThisMonth >= 10;

    return hasExceeded;
  },

  /**
   * Checks if the user has exceeded the limit of receiving testimonials per month in his Pro plan
   */
  async checkIfLimitExceededInProPlan(userId: string) {
    const totalTestimonialsReceivedThisMonth = await this.getTestimonialCountThisMonth(userId);

    const hasExceeded = totalTestimonialsReceivedThisMonth >= 50;

    return hasExceeded;
  },

  async checkIfLimitExceeded(userId: string) {
    const hasExceededInFreePlan = await this.checkIfLimitExceededInFreePlan(userId);
    const hasExceededInProPlan = await this.checkIfLimitExceededInProPlan(userId);

    const { isPro } = await getSubscription(userId);

    const hasExceeded = isPro ? hasExceededInProPlan : hasExceededInFreePlan;

    return hasExceeded;
  },
};

export default TestimonialService;
