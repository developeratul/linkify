import { clientEnv } from "@/env/schema.mjs";
import { env } from "@/env/server.mjs";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;
