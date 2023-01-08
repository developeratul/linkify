import { requireAuth } from "@/server/auth";
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
export const getServerSideProps: GetServerSideProps = requireAuth(async () => {
  return {
    props: {},
  };
});
