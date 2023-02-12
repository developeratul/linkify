import { Icon } from "@/Icons";
import type { AppProps } from "@/types";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Conditional } from "../common/Conditional";

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
      w={{ base: "full", md: "auto" }}
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
                <Chakra.MenuButton as="div">
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
            <SharePopover />
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

export function SharePopover() {
  const { status, data } = useSession();
  const [link, setLink] = React.useState("");
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast({ status: "info", description: "Linked copied!" });
  };

  React.useEffect(() => {
    setLink(`${window.origin}/${data?.user?.username}`);
  }, [data]);

  return (
    <Conditional
      condition={status === "authenticated"}
      component={
        <Chakra.Popover strategy="fixed">
          <Chakra.PopoverTrigger>
            <Chakra.Button
              variant="outline"
              rounded="full"
              leftIcon={<Icon name="Share" />}
            >
              Share
            </Chakra.Button>
          </Chakra.PopoverTrigger>
          <Chakra.PopoverContent>
            <Chakra.PopoverArrow />
            <Chakra.PopoverBody>
              <Chakra.VStack spacing="3">
                <Chakra.Text>
                  Once you have finished setting up your tree, you can now share
                  this link on media platforms!
                </Chakra.Text>
                <Chakra.InputGroup size="md">
                  <Chakra.Input
                    fontSize="sm"
                    pr="4.5rem"
                    value={link}
                    readOnly
                  />
                  <Chakra.InputRightElement width="4.5rem">
                    <Chakra.Button
                      onClick={handleCopy}
                      colorScheme="blue"
                      h="1.75rem"
                      size="xs"
                    >
                      Copy
                    </Chakra.Button>
                  </Chakra.InputRightElement>
                </Chakra.InputGroup>
              </Chakra.VStack>
            </Chakra.PopoverBody>
          </Chakra.PopoverContent>
        </Chakra.Popover>
      }
      fallback={<></>}
    />
  );
}
