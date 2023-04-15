import { useProfileContext } from "@/providers/profile";
import { VStack } from "@chakra-ui/react";
import React from "react";

type ContainerProps = {
  children: React.ReactNode;
};

export default function Container(props: ContainerProps) {
  const { children } = props;
  const profile = useProfileContext();

  if (profile === undefined) return <></>;

  return (
    <VStack mx="auto" spacing={50} maxW={profile.layout.containerWidth}>
      {children}
    </VStack>
  );
}
