import type { GetServerSideProps } from "next";
import { type GetServerSidePropsContext } from "next";
import type { GetSessionParams } from "next-auth/react";
import { getSession } from "next-auth/react";

export const getServerAuthSession = async (params: GetSessionParams) => {
  return await getSession(params);
};

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
      return {
        redirect: {
          destination: "/auth", // login path
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };

export const redirectAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (session) {
      return {
        redirect: {
          destination: "/app",
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
