import { useProfileContext } from "@/providers/profile";
import type { ProfileLink, ProfileLinks } from "@/types";
import * as Chakra from "@chakra-ui/react";

export default function Links(props: { links: ProfileLinks }) {
  const { links } = props;
  const profile = useProfileContext();

  return (
    <Chakra.SimpleGrid columns={{ base: 1, md: profile?.linksColumnCount }} spacing="10px" w="full">
      {links.map((link) => (
        <Link key={link.id} link={link} />
      ))}
    </Chakra.SimpleGrid>
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
