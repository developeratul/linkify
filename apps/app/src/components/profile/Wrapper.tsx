import { useProfileContext } from "@/providers/profile";
import { StackProps, VStack } from "@chakra-ui/react";
import React from "react";

type WrapperProps = {
  children: React.ReactNode;
};

export default function Wrapper(props: WrapperProps) {
  const { children } = props;
  const profile = useProfileContext();

  if (profile === undefined) return <></>;

  const defaultProps: StackProps = {
    spacing: "30px",
    w: "full",
  };

  if (profile.layout.layout === "CARD") {
    return (
      <VStack
        mx="auto"
        bg={profile.theme.cardBackgroundColor}
        as="fieldset"
        pb={10}
        px={{ base: 5, md: 10 }}
        rounded="lg"
        shadow={profile.theme.cardShadow}
        {...defaultProps}
      >
        {children}
      </VStack>
    );
  }

  return <VStack {...defaultProps}>{children}</VStack>;
}
