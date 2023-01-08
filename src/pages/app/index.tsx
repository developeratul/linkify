import AppBar from "@/components/app/AppBar";
import Groups, { CreateGroup } from "@/components/app/Groups";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import * as Chakra from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";

const AppPage: NextPage = () => {
  return (
    <Chakra.Box className="h-full w-full overflow-x-hidden" bg="gray.100">
      <AppBar />
      <Chakra.VStack w="full" p={5}>
        <Chakra.VStack w="full" maxW="2xl" spacing={5}>
          <CreateGroup />
          <Groups />
        </Chakra.VStack>
      </Chakra.VStack>
    </Chakra.Box>
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
