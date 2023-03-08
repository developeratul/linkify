import { useProfileContext } from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";
import React from "react";

type WrapperProps = {
  children: React.ReactNode;
};

export default function Wrapper(props: WrapperProps) {
  const { children } = props;
  const profile = useProfileContext();

  if (profile?.layout === "CARD") {
    return (
      <Chakra.VStack
        spacing="20px"
        mx="auto"
        w="full"
        bg={profile.cardBackgroundColor}
        as="fieldset"
        pb={10}
        px={10}
        rounded="lg"
        color={profile.foreground}
        shadow={profile.cardShadow}
      >
        {children}
      </Chakra.VStack>
    );
  }

  return (
    <Chakra.VStack spacing="20px" color={profile?.foreground} w="full">
      {children}
    </Chakra.VStack>
  );
}
