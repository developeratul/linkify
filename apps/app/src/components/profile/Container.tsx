import { useProfileContext } from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";
import React from "react";

type ContainerProps = {
  children: React.ReactNode;
};

export default function Container(props: ContainerProps) {
  const { children } = props;
  const profile = useProfileContext();

  if (profile === undefined) return <></>;

  return (
    <Chakra.VStack mx="auto" spacing={50} maxW={profile.layout.containerWidth}>
      {children}
    </Chakra.VStack>
  );
}
