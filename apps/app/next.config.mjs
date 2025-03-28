// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  transpilePackages: ["components"],
  optimizeFonts: false,
  images: {
    remotePatterns: [
      { hostname: "placehold.co" },
      { hostname: "cdn.simpleicons.org" },
      { hostname: "api.producthunt.com" },
      { hostname: "producthunt.com" },
    ],
  },
};

import { withSuperjson } from "next-superjson";

export default withSuperjson()(config);
