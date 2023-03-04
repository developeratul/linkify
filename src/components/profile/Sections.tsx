import { useProfileContext } from "@/providers/profile";
import type { ProfileSection } from "@/types";
import * as Chakra from "@chakra-ui/react";
import Links from "./Links";

export default function Sections() {
  const profile = useProfileContext();
  return (
    <Chakra.VStack spacing="20px" align="start" w="full">
      {profile?.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </Chakra.VStack>
  );
}

function Section(props: { section: ProfileSection }) {
  const { section } = props;
  return (
    <Chakra.VStack spacing="10px" w="full" align="start">
      {section.name && (
        <Chakra.Heading fontSize="18px" fontWeight="medium">
          {section.name}
        </Chakra.Heading>
      )}
      <Links links={section.links} />
    </Chakra.VStack>
  );
}
