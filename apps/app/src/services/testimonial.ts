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
   * Returns the total number of testimonials the user has received (all time)
   */
  async getTotalTestimonialCount(userId: string) {
    const count = await prisma.testimonial.count({
      where: { userId: userId },
    });

    return count;
  },

  /**
   * Returns the total number of testimonials the user has shown (all time)
   */
  async getTotalShownTestimonialCount(userId: string) {
    const count = await prisma.testimonial.count({
      where: {
        AND: [{ userId: userId }, { shouldShow: true }],
      },
    });

    return count;
  },

  /**
   * Checks if the user has exceeded the limit of testimonials in free plan
   */
  async checkIfLimitExceededInFreePlan(userId: string) {
    const totalTestimonials = await this.getTotalTestimonialCount(userId);
    const hasExceeded = totalTestimonials >= 10;
    return hasExceeded;
  },
};

export default TestimonialService;
