import { SectionSelections } from "@/server/api/routers/section";
import { prisma } from "@/server/db";

const SectionService = {
  async findManyWithLinks(userId: string, includeIndex = false) {
    return await prisma.section.findMany({
      where: { userId: userId },
      select: { ...SectionSelections, index: includeIndex },
      orderBy: {
        index: "asc",
      },
    });
  },

  async findLast(userId: string) {
    const previousSections = await this.findManyWithLinks(userId, true);
    const previousSection = previousSections[previousSections.length - 1];
    return previousSection;
  },
};

export default SectionService;
