import { env } from "@/env/server.mjs";
import { getSubscription } from "@/lib/subscription";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { CreateCheckoutResult } from "lemonsqueezy.ts/types";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const paymentRouter = createTRPCRouter({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;

    const { isPro } = await getSubscription(id);

    return { isPro };
  }),

  createCheckout: protectedProcedure
    .input(z.object({ variantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { variantId } = input;
      const userId = ctx.session.user.id;

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, id: true, username: true },
      });

      if (!user || !user.email || !user.username) throw new TRPCError({ code: "NOT_FOUND" });

      const { isPro } = await getSubscription(user.id);

      if (isPro) throw new TRPCError({ code: "FORBIDDEN", message: "You are already a pro!" });

      const checkout = (
        await axios.post(
          "https://api.lemonsqueezy.com/v1/checkouts",
          {
            data: {
              type: "checkouts",
              attributes: { checkout_data: { email: user.email, custom: [userId] } },
              relationships: {
                store: { data: { type: "stores", id: env.LEMON_SQUEEZY_STORE_ID } },
                variant: { data: { type: "variants", id: variantId } },
              },
            },
          },
          { headers: { Authorization: `Bearer ${env.LEMON_SQUEEZY_API_KEY}` } }
        )
      ).data as CreateCheckoutResult;

      return checkout;
    }),
});

export default paymentRouter;
