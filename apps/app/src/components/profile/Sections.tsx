import { useProfileContext } from "@/providers/profile";
import type { ProfileSection } from "@/types";
import { Heading, VStack } from "@chakra-ui/react";
import Links from "./Links";

export default function Sections() {
  const profile = useProfileContext();

  if (!profile?.sections.length) return <></>;

  return (
    <VStack spacing="20px" align="start" w="full">
      {profile?.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </VStack>
  );
}

function Section(props: { section: ProfileSection }) {
  const { section } = props;
  return (
    <VStack spacing="10px" w="full" align="start">
      {section.name && (
        <Heading fontSize="18px" fontWeight="medium">
          {section.name}
        </Heading>
      )}
      <Links links={section.links} />
    </VStack>
  );
}
