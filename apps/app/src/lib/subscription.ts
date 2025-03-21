import { prisma } from "@/server/db";
import { client } from "./lemonsqueezy";

export async function getSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionId: true, currentPeriodEnd: true, customerId: true, variantId: true },
  });

  // Check if user is on a pro plan.
  const isPro =
    user?.variantId &&
    user.currentPeriodEnd &&
    user.currentPeriodEnd.getTime() + 86_400_000 > Date.now();

  // If user has a pro plan, check cancel status on LemonSqueezy.
  let isCanceled = false;

  if (isPro && user.subscriptionId) {
    try {
      const subscription = await client.retrieveSubscription({ id: user.subscriptionId });
      // Check both status attribute and ends_at field for more reliable cancellation detection
      isCanceled = 
        subscription.data.attributes.status === 'cancelled' || 
        !!(subscription.data.attributes.ends_at && 
          subscription.data.attributes.ends_at.getTime() > Date.now());
    } catch (error) {
      // If we can't retrieve the subscription (e.g., API error), default to not canceled
      // This prevents a temporary API issue from blocking users
      console.error('Error retrieving subscription:', error);
    }
  }

  return { ...user, currentPeriodEnd: user?.currentPeriodEnd?.getTime(), isCanceled, isPro };
}
