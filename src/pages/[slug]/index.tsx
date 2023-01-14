import * as Chakra from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const UserPage: NextPage = () => {
  const { slug } = useRouter().query;
  console.log({ slug });
  return (
    <Chakra.Box>
      <Chakra.Heading>User Page</Chakra.Heading>
    </Chakra.Box>
  );
};

export default UserPage;
