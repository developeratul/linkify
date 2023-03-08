import { useProfileContext } from "@/providers/profile";
import type { ProfileLink, ProfileLinks } from "@/types";
import { getContrastColor } from "@/utils/contrast";
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
    <Chakra.Box
      as="a"
      target="_blank"
      href={link.url}
      rounded="md"
      color="white"
      w="full"
      bg={profile?.themeColor}
      transition="100ms"
      transformOrigin="top"
      _hover={{
        transform: "scale(1.02)",
      }}
      px={2}
    >
      <Chakra.HStack>
        {link.thumbnail && <Chakra.Image boxSize={45} rounded="lg" src={link.thumbnail} />}
        <Chakra.Text
          color={getContrastColor(profile?.themeColor as string)}
          noOfLines={1}
          py={4}
          textAlign="center"
          w="full"
          fontWeight="medium"
        >
          {link.text}
        </Chakra.Text>
      </Chakra.HStack>
    </Chakra.Box>
  );
}
