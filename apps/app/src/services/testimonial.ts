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
};

export default TestimonialService;
