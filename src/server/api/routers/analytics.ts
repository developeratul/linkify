import { createTRPCRouter, publicProcedure } from "../trpc";

const analyticsRouter = createTRPCRouter({
  captureLinkClick: publicProcedure.mutation(async () => {
    //
  }),
});

export default analyticsRouter;
