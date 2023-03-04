import { useProfileContext } from "@/providers/profile";
import type { ProfileLink } from "@/types";
import * as Chakra from "@chakra-ui/react";

export default function Links(props: { links: ProfileLink[] }) {
  const { links } = props;

  return (
    <Chakra.VStack spacing="10px" w="full">
      {links.map((link) => (
        <Link key={link.id} link={link} />
      ))}
    </Chakra.VStack>
  );
}

function Link(props: { link: ProfileLink }) {
  const { link } = props;
  const profile = useProfileContext();
  return (
    <Chakra.Box p={3} rounded="md" color="white" w="full" bg={profile?.themeColor}>
      {link.text}
    </Chakra.Box>
  );
}
