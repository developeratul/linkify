import type { Profile } from "@/pages/[slug]";
import React from "react";

type InitialState = Omit<
  Profile,
  "bodyBackgroundColor" | "cardBackgroundColor" | "themeColor" | "grayColor" | "foreground"
> & {
  bodyBackgroundColor: string;
  cardBackgroundColor: string;
  themeColor: string;
  grayColor: string;
  foreground: string;
};

const ProfileContext = React.createContext<InitialState | undefined>(undefined);

type ProfileProviderProps = {
  profile: Profile;
  children: React.ReactNode;
};

export default function ProfileProvider(props: ProfileProviderProps) {
  const { children, profile } = props;
  const value: InitialState = {
    ...profile,
    bodyBackgroundColor: profile.bodyBackgroundColor || "purple.50",
    cardBackgroundColor: profile.cardBackgroundColor || "purple.100",
    themeColor: profile.themeColor || "purple.500",
    grayColor: profile.grayColor || "gray.500",
    foreground: profile.foreground || "gray.600",
  };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
export const useProfileContext = () => React.useContext(ProfileContext);
