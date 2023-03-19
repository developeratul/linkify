import { SocialIcon } from "@/Icons";
import { useProfileContext } from "@/providers/profile";
import { SocialLink } from "@/types";
import { getContrastColor } from "@/utils/color";
import * as Chakra from "@chakra-ui/react";
import { buttonImageRoundness } from "../app/appearance/Button";

export default function SocialLinks() {
  const profile = useProfileContext();

  if (!profile?.socialLinks.length) return <></>;

  return (
    <Chakra.Stack
      wrap="wrap"
      direction="row"
      justify="center"
      align="center"
      columnGap="5px"
      rowGap="5px"
    >
      {profile?.socialLinks.map((socialLink) => (
        <SocialLink key={socialLink.id} link={socialLink} />
      ))}
    </Chakra.Stack>
  );
}

function SocialLink(props: { link: SocialLink }) {
  const { link } = props;
  const profile = useProfileContext();
  if (profile === undefined) return <></>;
  const background = profile.button.buttonBackground || profile.theme.themeColor;
  return (
    <Chakra.Stack
      background={background}
      rounded={buttonImageRoundness[profile.button.buttonStyle]}
      color={getContrastColor(background)}
      cursor="pointer"
      boxSize="45px"
      justify="center"
      align="center"
      as="a"
      aria-label={link.url}
      target="_blank"
      href={link.url}
      referrerPolicy="no-referrer"
    >
      <SocialIcon name={link.icon} />
    </Chakra.Stack>
  );
}
