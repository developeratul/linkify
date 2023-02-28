import appearanceRouter from "./routers/appearance";
import { authRouter } from "./routers/auth";
import { linkRouter } from "./routers/link";
import { sectionRouter } from "./routers/section";
import { socialLinkRouter } from "./routers/social-link";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  section: sectionRouter,
  link: linkRouter,
  socialLink: socialLinkRouter,
  appearance: appearanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
