import { prisma } from "@/server/db";
import deviceDetector from "@/utils/device-detector";
import type { Events } from "@prisma/client";
import moment from "moment-timezone/data/meta/latest.json";
import type { NextApiRequest, NextApiResponse } from "next";
import { parseCookies, setCookie } from "nookies";

const timeZoneToCountry: Record<string, string> = {};

Object.keys(moment.zones).forEach((z) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  timeZoneToCountry[z] = moment.countries[moment.zones[z].countries[0]].abbr;
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const parsedCookies = parseCookies({ req });
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "`userId` must be provided" });
    }

    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    const country = timeZoneToCountry[timeZone];
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
