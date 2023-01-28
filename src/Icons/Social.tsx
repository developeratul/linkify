import {
  IconBrandDiscord,
  IconBrandFacebook,
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

const icons = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
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

export function SocialIcon(props: { size?: number; name: keyof typeof icons }) {
  const { size = 24, name } = props;
  const IconElement = icons[name];
  return <IconElement size={size} />;
}
