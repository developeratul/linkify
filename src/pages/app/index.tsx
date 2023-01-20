import AppBar from "@/components/app/AppBar";
import Groups, { CreateGroup } from "@/components/app/Groups";
import { PreviewPanel } from "@/components/app/PreviewPanel";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import * as Chakra from "@chakra-ui/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

const AppPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { username } = props;
  return (
    <Chakra.Box className="h-full w-full overflow-x-hidden" bg="gray.100">
      <AppBar />
      <Chakra.HStack w="full" align="start">
        <Chakra.Stack p={5} w="full" align="center">
          <Chakra.VStack w="full" maxW="2xl" spacing={5}>
            <CreateGroup />
            <Groups />
          </Chakra.VStack>
        </Chakra.Stack>
        <PreviewPanel username={username} />
      </Chakra.HStack>
    </Chakra.Box>
  );
};

export default AppPage;
export const getServerSideProps: GetServerSideProps = requireAuth(
  async (ctx) => {
    const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });

    const user = await prisma?.user.findUnique({
      where: { id: session?.user?.id },
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

    return {
      props: { username: user.username },
    };
  }
);
