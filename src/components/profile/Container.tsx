import { useProfileContext } from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";
import React from "react";

type ContainerProps = {
  children: React.ReactNode;
};

export default function Container(props: ContainerProps) {
  const { children } = props;
  const profile = useProfileContext();

  if (profile?.layout === "CARD") {
    return (
      <Chakra.VStack
        spacing="20px"
        mx="auto"
        maxW={profile.containerWidth}
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
    <Chakra.VStack
      color={profile?.foreground}
      spacing="20px"
      mx="auto"
      maxW={profile?.cardBackgroundColor}
    >
      {children}
    </Chakra.VStack>
  );
}
