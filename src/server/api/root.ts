import appearanceRouter from "./routers/appearance";
import { authRouter } from "./routers/auth";
import { exampleRouter } from "./routers/example";
import { groupRouter } from "./routers/group";
import { linkRouter } from "./routers/link";
import { socialLinkRouter } from "./routers/social-link";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  group: groupRouter,
  link: linkRouter,
  socialLink: socialLinkRouter,
  appearance: appearanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
