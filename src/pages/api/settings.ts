import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getServerAuthSession({ req });

    if (!session?.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const update = req.body;

    const updatedSettings = await prisma.user.update({
      where: { id: session.user.id },
      data: { ...update },
      select: {
        seoTitle: true,
        seoDescription: true,
        socialIconPlacement: true,
      },
    });

    return res.json({ settings: updatedSettings, message: "Settings updated" });
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
};

export default handler;
