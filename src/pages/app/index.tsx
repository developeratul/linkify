import Groups, { CreateGroup } from "@/components/app/Groups";
import { AppLayout } from "@/Layouts/app";
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
    <AppLayout username={username}>
      <Chakra.VStack w="full" maxW="2xl" spacing={5}>
        <CreateGroup />
        <Groups />
      </Chakra.VStack>
    </AppLayout>
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
