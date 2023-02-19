import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandGooglePlay,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandMedium,
  IconBrandPatreon,
  IconBrandPinterest,
  IconBrandSpotify,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconCash,
  IconLink,
  IconMail,
  IconSignal4gPlus,
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
  signal: IconSignal4gPlus,
  spotify: IconBrandSpotify,
  medium: IconBrandMedium,
  google_play: IconBrandGooglePlay,
  figma: IconBrandFigma,
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
