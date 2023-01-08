import { getServerAuthSession, requireAuth } from "@/server/auth";
import * as Chakra from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { signOut } from "next-auth/react";

const AppPage: NextPage = () => {
  return (
    <div className="h-full w-full">
      <Chakra.Heading>Hello world</Chakra.Heading>
      <Chakra.Button onClick={() => signOut({ callbackUrl: "/auth" })}>
        Logout
      </Chakra.Button>
    </div>
  );
};

export default AppPage;
export const getServerSideProps: GetServerSideProps = requireAuth(
  async (ctx) => {
    const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });

    if (session) {
      const user = await prisma?.user.findUnique({
        where: { id: session.user?.id },
        select: { username: true, bio: true },
      });

      console.log({ user });

      if (!user?.username) {
        return {
          redirect: {
            destination: "/auth/onboarding",
            permanent: false,
          },
        };
      }
    }

    return {
      props: {},
    };
  }
);
