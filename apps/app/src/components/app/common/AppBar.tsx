import UpgradeButton from "@/components/common/UpgradeButton";
import type { AppProps } from "@/types";
import { api } from "@/utils/api";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Spinner,
  ToastId,
  useToast,
} from "@chakra-ui/react";
import { Icon, IconNames } from "components";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Logo from "../../common/Logo";
import ShareProfile from "./ShareProfile";

function LinkButton(props: AppProps & { icon: React.ReactElement; to: string }) {
  const { children, icon, to } = props;
  const router = useRouter();
  const isActive = router.pathname === to;
  return (
    <Button
      as={Link}
      href={to}
      variant="ghost"
      colorScheme={isActive ? "purple" : "gray"}
      leftIcon={icon}
      w={{ base: "full", md: "auto" }}
    >
      {children}
    </Button>
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
  // { label: "Settings", to: "/settings", icon: "Settings" },
  { label: "Testimonials", to: "/testimonials", icon: "Testimonial" },
  { label: "Form", to: "/form", icon: "Form" },
];

export default function AppBar() {
  const visibleLinks = links.slice(0, 3);
  const menuLinks = links.slice(3, links.length);
  const { data: subscription, isLoading } = api.payment.getSubscription.useQuery();

  return (
    <Box zIndex="sticky" p={3} className="sticky left-0 top-0 h-24">
      <Card bg="white" size="sm" rounded="full" height="full">
        <CardBody className="flex items-center justify-between">
          <HStack spacing={{ base: "2", md: "14" }}>
            <Box flexShrink={0}>
              <Logo />
            </Box>
            <Show above="lg">
              <HStack>
                {visibleLinks.map((link) => (
                  <LinkButton to={link.to} key={link.label} icon={<Icon name={link.icon} />}>
                    {link.label}
                  </LinkButton>
                ))}
                <Menu isLazy>
                  <MenuButton>
                    <IconButton
                      size="sm"
                      as="span"
                      variant="outline"
                      colorScheme="purple"
                      icon={<Icon name="Menu" />}
                      aria-label="Menu"
                    />
                  </MenuButton>
                  <MenuList>
                    {menuLinks.map((link) => (
                      <MenuItem
                        key={link.label}
                        as={Link}
                        href={link.to}
                        icon={<Icon name={link.icon} />}
                      >
                        {link.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </HStack>
            </Show>
            <Show below="lg">
              <Menu isLazy>
                <MenuButton as="div">
                  <IconButton
                    size="sm"
                    as="span"
                    variant="outline"
                    colorScheme="purple"
                    icon={<Icon name="Menu" />}
                    aria-label="Links"
                  />
                </MenuButton>
                <MenuList>
                  {links.map((link) => (
                    <MenuItem
                      href={link.to}
                      as={Link}
                      icon={<Icon name={link.icon} />}
                      key={link.label}
                    >
                      {link.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Show>
          </HStack>
          {isLoading ? (
            <div className="flex w-12 items-center justify-center">
              <Spinner size="sm" colorScheme="purple" color="purple.500" />
            </div>
          ) : (
            <HStack align="center" spacing={5}>
              <ShareProfile />
              <UpgradeButton />
              <AppMenu />
            </HStack>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}

export function AppMenu() {
  const { data } = useSession();
  const { data: subscription, isLoading } = api.payment.getSubscription.useQuery();
  const { mutateAsync: createCustomerPortal } = api.payment.createCustomerPortal.useMutation();
  const toast = useToast();
  const [, setToastId] = useState<ToastId | undefined>(undefined);
  const router = useRouter();

  return (
    <Menu>
      <MenuButton>
        {isLoading ? (
          <div className="flex w-12 items-center justify-center">
            <Spinner size="sm" colorScheme="purple" color="purple.500" />
          </div>
        ) : (
          <Avatar
            src={data?.user?.image as string}
            name={(data?.user?.name || data?.user?.username) as string}
          >
            {subscription?.isPro ? (
              <AvatarBadge boxSize="1rem" placement="top-end" bg="purple.500" />
            ) : null}
          </Avatar>
        )}
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} href="/settings" icon={<Icon name="Settings" />}>
          Page Settings
        </MenuItem>
        {!subscription?.isPro && (
          <MenuItem as={Link} href="/subscribe" icon={<Icon name="Subscribe" />}>
            Upgrade to pro
          </MenuItem>
        )}
        {subscription?.isPro && (
          <MenuItem
            onClick={async () => {
              const id = toast({
                status: "loading",
                description: "Redirecting to Customer Portal...",
              });
              setToastId(id);
              const url = await createCustomerPortal();
              window.open(url, "_blank");
              toast.update(id, { status: "success", description: "Redirected to Customer Portal" });
              setToastId(undefined);
            }}
            icon={<Icon name="Billing" />}
          >
            Manage subscription
          </MenuItem>
        )}
        <MenuItem
          icon={<Icon name="Logout" />}
          onClick={async () => {
            await signOut();
            router.push("/auth");
          }}
        >
          Logout from app
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
