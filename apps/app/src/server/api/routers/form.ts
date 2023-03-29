import { formSubmissionSchema } from "@/components/profile/Form";
import { formSchema } from "@/pages/app/form";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const formRouter = createTRPCRouter({
  enableFormToggle: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { form: true },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    if (user.form) {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { form: { delete: true } },
      });
    } else {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { form: { create: {} } },
      });
    }

    return;
  }),

  updateForm: protectedProcedure.input(formSchema).mutation(async ({ ctx, input }) => {
    const update = input;
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { form: true },
    });

    if (!user || !user.form) throw new TRPCError({ code: "NOT_FOUND" });

    await ctx.prisma.user.update({
      where: { id: userId },
      data: { form: { update: { ...update } } },
    });

    return "Successfully updated";
  }),

  submit: publicProcedure
    .input(formSubmissionSchema.extend({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, ...data } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { form: true },
      });

      if (!user || !user.form) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.user.update({
        where: { id: userId },
        data: { formSubmissions: { create: { ...data } } },
      });

      return user.form.submissionSuccessMessage || "Your response was successfully submitted";
    }),

  deleteSubmission: protectedProcedure
    .input(z.object({ submissionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { submissionId } = input;
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { form: true },
      });

      if (!user || !user.form) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.user.update({
        where: { id: userId },
        data: { formSubmissions: { delete: { id: submissionId } } },
      });

      return "Deleted successfully";
    }),
});

export default formRouter;
