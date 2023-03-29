import { clientEnv } from "@/env/schema.mjs";
import axios from "axios";
import { type UploadApiResponse } from "cloudinary";

export const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
export const uploadPreset =
  clientEnv.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;
export const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export default async function uploadFile(
  file: Blob
): Promise<UploadApiResponse> {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);
  return (await axios.post(uploadEndpoint, data)).data;
}
