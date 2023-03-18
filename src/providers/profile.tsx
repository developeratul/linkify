import { fonts, robotoMono } from "@/fonts/profile";
import type { Profile } from "@/pages/[slug]";
import { useToken } from "@chakra-ui/react";
import type { NextFont } from "next/dist/compiled/@next/font";
import React from "react";

type InitialState = Omit<
  Profile,
  | "bodyBackgroundColor"
  | "cardBackgroundColor"
  | "themeColor"
  | "grayColor"
  | "foreground"
  | "profileTitle"
  | "font"
> & {
  bodyBackgroundColor: string;
  cardBackgroundColor: string;
  themeColor: string;
  grayColor: string;
  foreground: string;
  profileTitle: string;
  font: NextFont;
};

const ProfileContext = React.createContext<InitialState | undefined>(undefined);

type ProfileProviderProps = {
  profile: Profile;
  children: React.ReactNode;
};

export default function ProfileProvider(props: ProfileProviderProps) {
  const { children, profile } = props;
  const [purple50, purple100, purple500, gray300, gray600] = useToken("colors", [
    "purple.50",
    "purple.100",
    "purple.500",
    "gray.300",
    "gray.600",
  ]);
  const font = fonts[profile.font || "robotoMono"] || robotoMono;
  const value: InitialState = {
    ...profile,
    profileTitle: profile.profileTitle || `${profile.username}`,
    bodyBackgroundColor: profile.bodyBackgroundColor || purple50,
    cardBackgroundColor: profile.cardBackgroundColor || purple100,
    themeColor: profile.themeColor || purple500,
    grayColor: profile.grayColor || gray300,
    foreground: profile.foreground || gray600,
    font,
  };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
export const useProfileContext = () => React.useContext(ProfileContext);
