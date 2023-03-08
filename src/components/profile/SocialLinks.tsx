import { SocialIcon } from "@/Icons";
import { useProfileContext } from "@/providers/profile";
import { SocialLink } from "@/types";
import { getContrastColor } from "@/utils/contrast";
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
  return (
    <Chakra.Stack
      background={profile?.themeColor}
      rounded={buttonImageRoundness[profile.buttonStyle]}
      color={getContrastColor(profile.themeColor)}
      cursor="pointer"
      boxSize="40px"
      justify="center"
      align="center"
      as="a"
      target="_blank"
      href={link.url}
      referrerPolicy="no-referrer"
    >
      <SocialIcon name={link.icon} />
    </Chakra.Stack>
  );
}
