import { testimonialSchema } from "@/components/profile/AddTestimonial";
import { authorizeAuthor } from "@/helpers/auth";
import TestimonialService from "@/services/testimonial";
import { TRPCError } from "@trpc/server";
import { json2csv } from "json-2-csv";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const testimonialRouter = createTRPCRouter({
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
          message: "User is not accepting testimonials anymore",
          code: "FORBIDDEN",
        });

      await ctx.prisma.testimonial.create({
        data: input,
      });

      return { message: "Your testimonial was sent!" };
    }),

  toggleShow: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const testimonialId = input;

    const testimonial = await ctx.prisma.testimonial.findUnique({
      where: { id: testimonialId },
      select: { userId: true, shouldShow: true },
    });

    if (!testimonial) throw new TRPCError({ code: "NOT_FOUND" });

    authorizeAuthor(testimonial.userId, ctx.session.user.id);

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
});

export default testimonialRouter;
