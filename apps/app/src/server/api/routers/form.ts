import { formSubmissionSchema } from "@/components/profile/Form";
import { formSchema } from "@/pages/form";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const formRouter = createTRPCRouter({
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

      const submissions = await ctx.prisma.formSubmission.findMany({
        where: { userId: userId },
        orderBy: { sentAt: orderBy },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (submissions.length > limit) {
        const nextItem = submissions.pop();
        nextCursor = nextItem?.id;
      }

      return { submissions, nextCursor };
    }),

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
        data: { form: { create: { isAcceptingSubmissions: true } } },
      });
    }

    return;
  }),

  toggleSubmissionAcceptance: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { form: true },
    });

    if (!user || !user.form) throw new TRPCError({ code: "NOT_FOUND" });

    const updatedUser = await ctx.prisma.user.update({
      where: { id: userId },
      data: { form: { update: { isAcceptingSubmissions: !user.form.isAcceptingSubmissions } } },
      select: { form: { select: { isAcceptingSubmissions: true } } },
    });

    const message = updatedUser.form?.isAcceptingSubmissions
      ? "You will receive submissions"
      : "You will not receive submissions anymore";

    return message;
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
      if (!user.form.isAcceptingSubmissions) throw new TRPCError({ code: "FORBIDDEN" });

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
