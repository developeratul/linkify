import cloudinary from "@/utils/cloudinary";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const cloudinaryRouter = createTRPCRouter({
  destroyImage: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    await cloudinary.uploader.destroy(input);
    return "Deleted Successfully";
  }),
});

export default cloudinaryRouter;
