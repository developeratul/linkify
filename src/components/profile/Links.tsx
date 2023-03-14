import { useProfileContext } from "@/providers/profile";
import type { ProfileLink, ProfileLinks } from "@/types";
import { api } from "@/utils/api";
import { getContrastColor } from "@/utils/color";
import * as Chakra from "@chakra-ui/react";
import { buttonImageRoundness, buttonVariantProps } from "../app/appearance/Button";

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
  const { mutate } = api.analytics.captureLinkClick.useMutation();

  if (profile === undefined) return <></>;

  const handleLinkClick = async () => {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.click();
    mutate({ linkId: link.id });
  };

  const isOutlinedButton = profile.buttonStyle.split("_").includes("OUTLINED");
  const buttonTextColor = isOutlinedButton
    ? profile.layout === "CARD"
      ? getContrastColor(profile.cardBackgroundColor)
      : getContrastColor(profile.bodyBackgroundColor)
    : getContrastColor(profile.buttonBackground || (profile.themeColor as string));

  return (
    <Chakra.Box
      cursor="pointer"
      rounded="md"
      w="full"
      onClick={handleLinkClick}
      bg={profile.buttonBackground || profile.themeColor}
      {...buttonVariantProps[profile?.buttonStyle as string]}
      borderColor={profile.buttonBackground || profile.themeColor}
      transition="100ms"
      transformOrigin="top"
      _hover={{
        transform: "scale(1.02)",
      }}
      px={2}
    >
      <Chakra.HStack>
        {link.thumbnail && (
          <Chakra.Image
            alt={link.text}
            objectFit="cover"
            rounded={buttonImageRoundness[profile.buttonStyle]}
            boxSize={{ base: "40px", sm: 45 }}
            src={link.thumbnail}
          />
        )}
        <Chakra.Text
          fontSize={{ base: "sm", sm: "md" }}
          color={buttonTextColor}
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
