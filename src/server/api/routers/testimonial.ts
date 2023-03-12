import { testimonialSchema } from "@/components/profile/AddTestimonial";
import { authorizeAuthor } from "@/helpers/auth";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const TestimonialSelections = {
  id: true,
  name: true,
  email: true,
  message: true,
  rating: true,
  shouldShow: true,
  avatar: true,
} satisfies Prisma.TestimonialSelect;

const testimonialRouter = createTRPCRouter({
  add: publicProcedure
    .input(testimonialSchema.extend({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session?.user?.id) throw new TRPCError({ code: "FORBIDDEN" });

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
});

export default testimonialRouter;
