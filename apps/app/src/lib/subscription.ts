import { prisma } from "@/server/db";
import { client } from "./lemonsqueezy";

export async function getUserSubscriptionPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionId: true, currentPeriodEnd: true, customerId: true, variantId: true },
  });

  // Check if user is on a pro plan.
  const isPro =
    user?.variantId &&
    user.currentPeriodEnd &&
    user?.currentPeriodEnd?.getTime() + 86_400_000 > Date.now();

  // If user has a pro plan, check cancel status on Stripe.
  let isCanceled = false;

  if (isPro && user.subscriptionId) {
    const subscription = await client.retrieveSubscription({ id: user.subscriptionId });
    isCanceled = !!(
      subscription.data.attributes.ends_at &&
      subscription.data.attributes.ends_at.getTime() > Date.now()
    );
  }

  return { ...user, stripeCurrentPeriodEnd: user?.currentPeriodEnd?.getTime(), isCanceled, isPro };
}
