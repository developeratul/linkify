import type { Profile } from "@/pages/[slug]";
import { useToken } from "@chakra-ui/react";
import React from "react";

type InitialState = Omit<
  Profile,
  | "bodyBackgroundColor"
  | "cardBackgroundColor"
  | "themeColor"
  | "grayColor"
  | "foreground"
  | "profileTitle"
> & {
  bodyBackgroundColor: string;
  cardBackgroundColor: string;
  themeColor: string;
  grayColor: string;
  foreground: string;
  profileTitle: string;
};

const ProfileContext = React.createContext<InitialState | undefined>(undefined);

type ProfileProviderProps = {
  profile: Profile;
  children: React.ReactNode;
};

export default function ProfileProvider(props: ProfileProviderProps) {
  const { children, profile } = props;
  const [purple50, purple100, purple500, gray500, gray600] = useToken("colors", [
    "purple.50",
    "purple.100",
    "purple.500",
    "gray.500",
    "gray.600",
  ]);
  const value: InitialState = {
    ...profile,
    profileTitle: profile.profileTitle || profile.username,
    bodyBackgroundColor: profile.bodyBackgroundColor || purple50,
    cardBackgroundColor: profile.cardBackgroundColor || purple100,
    themeColor: profile.themeColor || purple500,
    grayColor: profile.grayColor || gray500,
    foreground: profile.foreground || gray600,
  };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
export const useProfileContext = () => React.useContext(ProfileContext);
