import { SocialIcon } from "@/Icons";
import { useProfileContext } from "@/providers/profile";
import { SocialLink } from "@/types";
import * as Chakra from "@chakra-ui/react";

export default function SocialLinks() {
  const profile = useProfileContext();

  return (
    <Chakra.Stack
      wrap="wrap"
      direction="row"
      justify="center"
      align="center"
      columnGap="10px"
      rowGap="10px"
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
  return (
    <Chakra.Stack
      background={profile?.themeColor}
      rounded={6}
      color="white"
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
