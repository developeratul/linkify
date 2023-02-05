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
    >
      {children}
    </Chakra.Button>
  );
}

export default function AppBar() {
  return (
    <Chakra.Box zIndex="sticky" p={3} className="sticky top-0 left-0 h-24">
      <Chakra.Card bg="white" size="sm" px={5} rounded="full" height="full">
        <Chakra.CardBody className="flex items-center justify-between">
          <Chakra.HStack spacing="10">
            <Chakra.Box>
              <Chakra.Heading size="md">LOGO</Chakra.Heading>
            </Chakra.Box>
            <Chakra.HStack>
              <LinkButton to="/app" icon={<Icon name="Link" />}>
                Links
              </LinkButton>
              <LinkButton
                to="/app/appearance"
                icon={<Icon name="Appearance" />}
              >
                Appearance
              </LinkButton>
              <LinkButton to="/app/settings" icon={<Icon name="Settings" />}>
                Settings
              </LinkButton>
            </Chakra.HStack>
          </Chakra.HStack>
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
    <Chakra.Button rounded="full" leftIcon={<Icon name="Share" />}>
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
