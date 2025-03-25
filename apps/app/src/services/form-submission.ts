import { prisma } from "@/server/db";

export const MAX_FORM_SUBMISSIONS = 25;

const FormSubmissionService = {
  /**
   * Returns the number of form-submission the user has received in the current month
   */
  async getSubmissionCountThisMonth(userId: string) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // get current month (1-12)
    const currentYear = currentDate.getFullYear(); // get current year

    const startDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
    const endDate = new Date(Date.UTC(currentYear, currentMonth, 1));

    const count = await prisma.formSubmission.count({
      where: {
        AND: [{ userId: userId }, { sentAt: { gte: startDate } }, { sentAt: { lt: endDate } }],
      },
    });

    return count;
  },

  /**
   * Checks if the user has exceeded the limit of receiving form-submissions per month in his free plan
   */
  async checkIfLimitExceededInFreePlan(userId: string) {
    const totalSubmissionsThisMonth = await this.getSubmissionCountThisMonth(userId);

    const hasExceeded = totalSubmissionsThisMonth >= 25;

    return hasExceeded;
  },

  /**
   * Checks if the user has exceeded the limit of receiving testimonials per month in his Pro plan
   */
  async checkIfLimitExceededInProPlan(userId: string) {
    // const totalSubmissionsThisMonth = await this.getSubmissionCountThisMonth(userId);

    return false;
  },
};

export default FormSubmissionService;
