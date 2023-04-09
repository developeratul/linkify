import { env } from "@/env/server.mjs";
import { client } from "@/lib/lemonsqueezy";
import { prisma } from "@/server/db";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import rawBody from "raw-body";

export const config = {
  api: {
    // Turn off the body parser so we can access raw body for verification.
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = await rawBody(req);
  const secret = env.LEMONS_SQUEEZY_SIGNATURE_SECRET;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
  const signature = Buffer.from(
    Array.isArray(req.headers["x-signature"])
      ? req.headers["x-signature"].join("")
      : req.headers["x-signature"] || "",
    "utf8"
  );

  // validate signature
  if (!crypto.timingSafeEqual(digest, signature)) {
    return res.status(403).json({ message: "Invalid signature" });
  }

  const payload = JSON.parse(body.toString());

  if (req.method === "POST") {
    switch (payload.meta.event_name) {
      case "subscription_created": {
        const subscription = await client.retrieveSubscription({ id: payload.data.id });
        const userId = payload.meta.custom_data[0];

        if (!userId) {
          return res.status(403).json({ message: "No userId provided" });
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionId: `${subscription.data.id}`,
            customerId: `${payload.data.attributes.customer_id}`,
            variantId: subscription.data.attributes.variant_id,
            currentPeriodEnd: subscription.data.attributes.renews_at,
          },
        });
      }

      case "subscription_updated": {
        const subscription = await client.retrieveSubscription({ id: payload.data.id });
        const userId = payload.meta.custom_data[0];

        if (!userId) {
          return res.status(403).json({ message: "No userId provided" });
        }

        const user = await prisma.user.findUnique({
          where: { subscriptionId: `${subscription.data.id}` },
          select: { subscriptionId: true },
        });

        if (!user || !user.subscriptionId) return res.end();

        await prisma.user.update({
          where: { subscriptionId: user.subscriptionId },
          data: {
            variantId: subscription.data.attributes.variant_id,
            currentPeriodEnd: subscription.data.attributes.renews_at,
          },
        });
      }

      default: {
        return res.end();
      }
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
