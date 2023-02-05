import { Icon } from "@/Icons";
import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

function LinkButton(
  props: AppProps & { icon: React.ReactElement; to: string }
) {
  const { children, icon, to } = props;
  const router = useRouter();
  const isActive = router.pathname === to;
  return (
    <Chakra.Button
      as={Link}
      href={to}
      variant="ghost"
      colorScheme={isActive ? "purple" : "gray"}
      leftIcon={icon}
      w="full"
    >
      {children}
    </Chakra.Button>
  );
}

export default function AppBar() {
  const links = (
    <>
      <LinkButton to="/app" icon={<Icon name="Link" />}>
        Links
      </LinkButton>
      <LinkButton to="/app/appearance" icon={<Icon name="Appearance" />}>
        Appearance
      </LinkButton>
      <LinkButton to="/app/settings" icon={<Icon name="Settings" />}>
        Settings
      </LinkButton>
    </>
  );
  return (
    <Chakra.Box zIndex="sticky" p={3} className="sticky top-0 left-0 h-24">
      <Chakra.Card bg="white" size="sm" px={5} rounded="full" height="full">
        <Chakra.CardBody className="flex items-center justify-between">
          <Chakra.HStack spacing={{ base: "2", sm: "10" }}>
            <Chakra.Box>
              <Chakra.Heading size="md">LOGO</Chakra.Heading>
            </Chakra.Box>
            <Chakra.Show above="md">
              <Chakra.HStack>{links}</Chakra.HStack>
            </Chakra.Show>
            <Chakra.Show below="md">
              <Chakra.Menu>
                <Chakra.MenuButton>
                  <Chakra.IconButton
                    icon={<Icon name="Menu" />}
                    aria-label="Links"
                  />
                </Chakra.MenuButton>
                <Chakra.MenuList>
                  <Chakra.VStack align="start">{links}</Chakra.VStack>
                </Chakra.MenuList>
              </Chakra.Menu>
            </Chakra.Show>
          </Chakra.HStack>
          <Chakra.HStack align="center" spacing={5}>
            <AppMenu />
          </Chakra.HStack>
        </Chakra.CardBody>
      </Chakra.Card>
    </Chakra.Box>
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
        <Chakra.MenuItem
          icon={<Icon name="Logout" />}
          onClick={() => signOut()}
        >
          Logout from app
        </Chakra.MenuItem>
      </Chakra.MenuList>
    </Chakra.Menu>
  );
}
