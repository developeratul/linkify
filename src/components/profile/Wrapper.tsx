import { useProfileContext } from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";
import React from "react";

type WrapperProps = {
  children: React.ReactNode;
};

export default function Wrapper(props: WrapperProps) {
  const { children } = props;
  const profile = useProfileContext();

  const defaultProps: Chakra.StackProps = {
    spacing: "20px",
    w: "full",
    color: profile?.foreground,
  };

  if (profile?.layout === "CARD") {
    return (
      <Chakra.VStack
        mx="auto"
        bg={profile.cardBackgroundColor}
        as="fieldset"
        pb={10}
        px={{ base: 5, md: 10 }}
        rounded="lg"
        shadow={profile.cardShadow}
        {...defaultProps}
      >
        {children}
      </Chakra.VStack>
    );
  }

  return <Chakra.VStack {...defaultProps}>{children}</Chakra.VStack>;
}
