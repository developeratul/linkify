import type { AppProps } from "@/types";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import type { IconNames } from "components";
import { Icon } from "components";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Conditional } from "../../common/Conditional";
import Logo from "../../common/Logo";

function LinkButton(props: AppProps & { icon: React.ReactElement; to: string }) {
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

type AppBarLink = {
  label: string;
  to: string;
  icon: IconNames;
};

const links: AppBarLink[] = [
  { label: "Links", to: "/", icon: "Link" },
  { label: "Appearance", to: "/appearance", icon: "Appearance" },
  { label: "Analytics", to: "/analytics", icon: "Analytics" },
  { label: "Settings", to: "/settings", icon: "Settings" },
  { label: "Testimonials", to: "/testimonials", icon: "Testimonial" },
  { label: "Form", to: "/form", icon: "Form" },
];

export default function AppBar() {
  const visibleLinks = links.slice(0, 3);
  const menuLinks = links.slice(3, links.length);
  return (
    <Chakra.Box zIndex="sticky" p={3} className="sticky left-0 top-0 h-24">
      <Chakra.Card bg="white" size="sm" rounded="full" height="full">
        <Chakra.CardBody className="flex items-center justify-between">
          <Chakra.HStack spacing={{ base: "2", md: "14" }}>
            <Chakra.Box>
              <Logo />
            </Chakra.Box>
            <Chakra.Show above="md">
              <Chakra.HStack>
                {visibleLinks.map((link) => (
                  <LinkButton to={link.to} key={link.label} icon={<Icon name={link.icon} />}>
                    {link.label}
                  </LinkButton>
                ))}
                <Chakra.Menu isLazy>
                  <Chakra.MenuButton>
                    <Chakra.IconButton
                      size="sm"
                      as="span"
                      variant="outline"
                      colorScheme="purple"
                      icon={<Icon name="Menu" />}
                      aria-label="Menu"
                    />
                  </Chakra.MenuButton>
                  <Chakra.MenuList>
                    {menuLinks.map((link) => (
                      <Chakra.MenuItem
                        key={link.label}
                        as={Link}
                        href={link.to}
                        icon={<Icon name={link.icon} />}
                      >
                        {link.label}
                      </Chakra.MenuItem>
                    ))}
                  </Chakra.MenuList>
                </Chakra.Menu>
              </Chakra.HStack>
            </Chakra.Show>
            <Chakra.Show below="md">
              <Chakra.Menu isLazy>
                <Chakra.MenuButton as="div">
                  <Chakra.IconButton
                    size="sm"
                    as="span"
                    variant="outline"
                    colorScheme="purple"
                    icon={<Icon name="Menu" />}
                    aria-label="Links"
                  />
                </Chakra.MenuButton>
                <Chakra.MenuList>
                  {links.map((link) => (
                    <Chakra.MenuItem
                      href={link.to}
                      as={Link}
                      icon={<Icon name={link.icon} />}
                      key={link.label}
                    >
                      {link.label}
                    </Chakra.MenuItem>
                  ))}
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
  const { data: subscription } = api.payment.getSubscription.useQuery();
  return (
    <Chakra.Menu>
      <Chakra.MenuButton>
        <Chakra.Avatar
          src={data?.user?.image as string}
          name={(data?.user?.name || data?.user?.username) as string}
        >
          {subscription?.isPro ? (
            <Chakra.AvatarBadge boxSize="1.25rem" placement="top-end" bg="purple.500" />
          ) : null}
        </Chakra.Avatar>
      </Chakra.MenuButton>
      <Chakra.MenuList>
        <Chakra.MenuItem icon={<Icon name="Logout" />} onClick={() => signOut()}>
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
    <Chakra.Show above="md">
      <Conditional
        condition={status === "authenticated"}
        component={
          <Chakra.Popover strategy="fixed">
            <Chakra.PopoverTrigger>
              <Chakra.Button variant="outline" rounded="full" leftIcon={<Icon name="Share" />}>
                Share
              </Chakra.Button>
            </Chakra.PopoverTrigger>
            <Chakra.PopoverContent>
              <Chakra.PopoverArrow />
              <Chakra.PopoverBody>
                <Chakra.VStack spacing="3">
                  <Chakra.Text>
                    Once you have finished setting up your tree, you can now share this link on
                    media platforms!
                  </Chakra.Text>
                  <Chakra.InputGroup size="md">
                    <Chakra.Input fontSize="sm" pr="4.5rem" value={link} readOnly />
                    <Chakra.InputRightElement width="4.5rem">
                      <Chakra.Button onClick={handleCopy} colorScheme="blue" h="1.75rem" size="xs">
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
    </Chakra.Show>
  );
}
