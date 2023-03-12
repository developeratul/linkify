import { testimonialSchema } from "@/components/profile/AddTestimonial";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const testimonialRouter = createTRPCRouter({
  add: publicProcedure
    .input(testimonialSchema.extend({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.testimonial.create({
        data: input,
      });

      return { message: "Your testimonial was sent!" };
    }),
});

export default testimonialRouter;
