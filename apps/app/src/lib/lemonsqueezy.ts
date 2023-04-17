import { env } from "@/env/server.mjs";
import { LemonsqueezyClient } from "lemonsqueezy.ts";

export const client = new LemonsqueezyClient(env.LEMON_SQUEEZY_API_KEY);
