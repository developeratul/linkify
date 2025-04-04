import { formSubmissionSchema } from "@/components/profile/Form";
import { getSubscription } from "@/lib/subscription";
import { unkey } from "@/lib/unkey";
import { formSchema } from "@/pages/form";
import FormSubmissionService, { MAX_FORM_SUBMISSIONS } from "@/services/form-submission";
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

  getRemainingFormSubmissionsInFreePlan: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const { isPro } = await getSubscription(userId);

    const countThisMonth = await FormSubmissionService.getSubmissionCountThisMonth(userId);

    const remainingThisMonth = MAX_FORM_SUBMISSIONS - countThisMonth;

    return remainingThisMonth;
  }),

  submit: publicProcedure
    .input(formSubmissionSchema.extend({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("called");
      const { userId, ...data } = input;

      if (ctx.ip) {
        const { success } = await unkey.limit(ctx.ip);
        if (!success) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Please slow down and try after a while",
          });
        }
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { form: true },
      });

      if (!user || !user.form) throw new TRPCError({ code: "NOT_FOUND" });
      if (!user.form.isAcceptingSubmissions) throw new TRPCError({ code: "FORBIDDEN" });

      const subscription = await getSubscription(userId);

      const hasExceeded = subscription.isPro
        ? await FormSubmissionService.checkIfLimitExceededInProPlan(userId)
        : await FormSubmissionService.checkIfLimitExceededInFreePlan(userId);

      if (hasExceeded) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This user is not accepting any submissions right now.",
        });
      }

      await ctx.prisma.user.update({
        where: { id: userId },
        data: { formSubmissions: { create: { ...data } } },
      });

      return user.form.submissionSuccessMessage || "Your response was successfully submitted";
    }),
});

export default formRouter;
