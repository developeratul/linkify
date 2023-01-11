import { TRPCError } from "@trpc/server";

export function authorizeAuthor(authorId: string, userId: string) {
  if (authorId !== userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not allowed to perform this action",
    });
  }
}
