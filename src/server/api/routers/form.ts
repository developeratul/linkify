import { formSchema } from "@/pages/app/form";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});

export default formRouter;
