import { SocialLinkSelections } from "@/server/api/routers/social-link";
import { prisma } from "@/server/db";

const SocialLinkService = {
  async findMany(userId: string, includeIndex = false) {
    return await prisma.socialLink.findMany({
      where: { userId: userId },
      select: { ...SocialLinkSelections, index: includeIndex },
      orderBy: {
        index: "asc",
      },
    });
  },

  async findLast(userId: string) {
    const previousLinks = await this.findMany(userId, true);
    const previousLink = previousLinks[previousLinks.length - 1];
    return previousLink;
  },
};

export default SocialLinkService;
