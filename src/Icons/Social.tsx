import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandPatreon,
  IconBrandPinterest,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconCash,
  IconLink,
  IconMail,
} from "@tabler/icons-react";

export const socialIcons = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  github: IconBrandGithub,
  twitter: IconBrandTwitter,
  linkedIn: IconBrandLinkedin,
  youTube: IconBrandYoutube,
  pinterest: IconBrandPinterest,
  twitch: IconBrandTwitch,
  whatsapp: IconBrandWhatsapp,
  email: IconMail,
  patreon: IconBrandPatreon,
  payment: IconCash,
  discord: IconBrandDiscord,
  other: IconLink,
};

export function SocialIcon(props: {
  size?: number;
  name: keyof typeof socialIcons;
}) {
  const { size = 24, name } = props;
  const IconElement = socialIcons[name];
  return <IconElement size={size} />;
}
