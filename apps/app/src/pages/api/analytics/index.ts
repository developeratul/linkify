import { prisma } from "@/server/db";
import { detectCountry } from "@/utils/country-detector";
import deviceDetector from "@/utils/device-detector";
import type { Events } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { parseCookies, setCookie } from "nookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const parsedCookies = parseCookies({ req });
    const { userId, type } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "`userId` must be provided" });
    }

    if (type === "preview") {
      return res.json({});
    }

    const country = detectCountry();
    const device = deviceDetector(req.headers["user-agent"]);
    const event: Events = parsedCookies["viewed-at"] ? "VIEW" : "UNIQUE_VIEW";

    await prisma.user.update({
      where: { id: userId },
      data: {
        analytics: { create: { event, fromBrowser: device && device.name, fromCountry: country } },
      },
    });

    setCookie({ res }, "viewed-at", new Date().toISOString());

    return res.json({});
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
