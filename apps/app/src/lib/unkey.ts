import { env } from "@/env/server.mjs";
import { Ratelimit } from "@unkey/ratelimit";

export const unkey = new Ratelimit({
  rootKey: env.UNKEY_ROOT_KEY,
  namespace: "default",
  limit: 1,
  duration: "1m",
});
