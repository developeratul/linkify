import { prisma } from "@/server/db";

const LinkService = {
  async findMany(sectionId: string) {
    return await prisma.link.findMany({
      where: { sectionId },
      select: { index: true, id: true },
      orderBy: {
        index: "asc",
      },
    });
  },

  async findPrevious(sectionId: string) {
    const previousLinks = await this.findMany(sectionId);
    const previousSection = previousLinks[previousLinks.length - 1];
    return previousSection;
  },
};

export default LinkService;
