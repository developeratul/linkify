import { Icons } from "@/Icons";
import * as Chakra from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";

export default function AppBar() {
  return (
    <Chakra.Box zIndex="sticky" p={3} className="sticky top-0 left-0">
      <Chakra.Card bg="white" size="sm" px={5} rounded="full">
        <Chakra.CardBody className="flex items-center justify-between">
          <Chakra.Box>
            <Chakra.Heading size="md">LOGO</Chakra.Heading>
          </Chakra.Box>
          <Chakra.HStack align="center" spacing={5}>
            <ShareMenu />
            <AppMenu />
          </Chakra.HStack>
        </Chakra.CardBody>
      </Chakra.Card>
    </Chakra.Box>
  );
}

export function ShareMenu() {
  return (
    <Chakra.Button rounded="full" leftIcon={Icons.Share}>
      Share
    </Chakra.Button>
  );
}

export function AppMenu() {
  const { data } = useSession();
  return (
    <Chakra.Menu>
      <Chakra.MenuButton>
        <Chakra.Avatar
          src={data?.user?.image as string}
          name={data?.user?.name as string}
        />
      </Chakra.MenuButton>
      <Chakra.MenuList>
        <Chakra.MenuItem onClick={() => signOut()}>Logout</Chakra.MenuItem>
      </Chakra.MenuList>
    </Chakra.Menu>
  );
}
