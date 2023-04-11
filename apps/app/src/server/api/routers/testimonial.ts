import { testimonialSchema } from "@/components/profile/SendTestimonial";
import { authorizeAuthor } from "@/helpers/auth";
import { getSubscription } from "@/lib/subscription";
import TestimonialService from "@/services/testimonial";
import { TRPCError } from "@trpc/server";
import { json2csv } from "json-2-csv";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const testimonialRouter = createTRPCRouter({
  findMany: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        orderBy: z.enum(["desc", "asc"]).default("desc"),
        cursor: z.any().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit, orderBy = "desc" } = input;
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const testimonials = await ctx.prisma.testimonial.findMany({
        where: { userId: userId },
        orderBy: { createdAt: orderBy },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (testimonials.length > limit) {
        const nextItem = testimonials.pop();
        nextCursor = nextItem?.id;
      }

      return { testimonials, nextCursor };
    }),

  add: publicProcedure
    .input(testimonialSchema.extend({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: { isAcceptingTestimonials: true },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      if (!user.isAcceptingTestimonials)
        throw new TRPCError({
          message: "This User is not accepting testimonials right now",
          code: "FORBIDDEN",
        });

      const hasExceededLimit = await TestimonialService.checkIfLimitExceeded(input.userId);

      if (hasExceededLimit)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This user is not accepting testimonials right now",
        });

      await ctx.prisma.testimonial.create({
        data: input,
      });

      return { message: "Your testimonial was sent!" };
    }),

  toggleShow: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const testimonialId = input;
    const userId = ctx.session.user.id;

    const testimonial = await ctx.prisma.testimonial.findUnique({
      where: { id: testimonialId },
      select: { userId: true, shouldShow: true },
    });

    if (!testimonial) throw new TRPCError({ code: "NOT_FOUND" });

    authorizeAuthor(testimonial.userId, userId);

    /**
     * If the user is trying to showcase another testimonial,
     * Then check if he has exceeded the limit or not
     */
    if (!testimonial.shouldShow) {
      const previousTestimonialCount = await ctx.prisma.testimonial.count({
        where: { AND: [{ userId }, { shouldShow: true }] },
      });

      const { isPro } = await getSubscription(userId);

      if (!isPro && previousTestimonialCount >= 5)
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Maximum 5 testimonials can be showcased in your free plan. Please upgrade to pro.",
        });

      if (isPro && previousTestimonialCount >= 30)
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Maximum 30 testimonials can be showcased in your pro plan. Please contact the team to request a new plan.",
        });
    }

    await ctx.prisma.testimonial.update({
      where: { id: testimonialId },
      data: { shouldShow: !testimonial.shouldShow },
    });

    return;
  }),

  deleteOne: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const testimonialId = input;

    const testimonial = await ctx.prisma.testimonial.findUnique({
      where: { id: testimonialId },
      select: { userId: true },
    });

    if (!testimonial) throw new TRPCError({ code: "NOT_FOUND" });

    authorizeAuthor(testimonial.userId, ctx.session.user.id);

    await ctx.prisma.testimonial.delete({
      where: { id: testimonialId },
    });

    return;
  }),

  exportAsCSV: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const testimonials = await TestimonialService.findMany(userId, {
      name: true,
      avatar: true,
      email: true,
      rating: true,
      message: true,
      createdAt: true,
    });

    const data = await json2csv(testimonials);

    return data;
  }),

  toggleTestimonialAcceptance: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { isAcceptingTestimonials: true },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    const updatedUser = await ctx.prisma.user.update({
      where: { id: userId },
      data: { isAcceptingTestimonials: !user.isAcceptingTestimonials },
      select: { isAcceptingTestimonials: true },
    });

    const message = updatedUser.isAcceptingTestimonials
      ? "You will receive testimonials"
      : "You will not receive testimonials anymore";

    return message;
  }),

  hasLimitExceeded: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const hasExceeded = await TestimonialService.checkIfLimitExceeded(userId);
    const { isPro } = await getSubscription(userId);
    return { hasExceeded, isPro };
  }),
});

export default testimonialRouter;
