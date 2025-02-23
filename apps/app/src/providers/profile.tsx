import { useDefaultProfileTheme } from "@/components/app/appearance/Theme/themes";
import { DEFAULT_FONT_NAME, defaultFont, fonts } from "@/fonts/profile";
import { toastOptions } from "@/lib/theme";
import type {
  Profile,
  ProfileButton,
  ProfileLayout,
  ProfileSettings,
  ProfileTheme,
} from "@/pages/[slug]";
import { getColorMode } from "@/utils/color";
import { ChakraProvider, ColorModeProvider, extendTheme } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { NextFont } from "next/dist/compiled/@next/font";
import { useRouter } from "next/router";
import { generatePalette } from "palette-by-numbers";
import React from "react";

type InitialState = Omit<Profile, "theme" | "layout" | "button" | "settings"> & {
  theme: Omit<
    ProfileTheme,
    "font" | "bodyBackgroundColor" | "cardBackgroundColor" | "themeColor" | "foreground"
  > & {
    bodyBackgroundColor: string;
    cardBackgroundColor: string;
    themeColor: string;
    foreground: string;
    font: NextFont;
  };
  layout: ProfileLayout;
  settings: ProfileSettings;
  button: ProfileButton;
};

const ProfileContext = React.createContext<InitialState | undefined>(undefined);

type ProfileProviderProps = {
  profile: Profile;
  children: React.ReactNode;
};

export default function ProfileProvider(props: ProfileProviderProps) {
  const { children, profile } = props;
  const defaultTheme = useDefaultProfileTheme();
  const font = fonts[profile.theme?.font || DEFAULT_FONT_NAME] || defaultFont;
  const router = useRouter();
  const { query } = router;

  const value: InitialState = {
    ...profile,
    profileTitle: profile.profileTitle || `${profile.username}`,
    layout: profile.layout || {
      layout: "WIDE",
      containerWidth: 768,
      linksColumnCount: 1,
    },
    theme: {
      bodyBackgroundColor: profile.theme?.bodyBackgroundColor || defaultTheme.bodyBackgroundColor,
      bodyBackgroundType: profile.theme?.bodyBackgroundType || defaultTheme.bodyBackgroundType,
      bodyBackgroundImage: profile.theme?.bodyBackgroundImage || defaultTheme.bodyBackgroundImage,
      cardBackgroundColor: profile.theme?.cardBackgroundColor || defaultTheme.cardBackgroundColor,
      cardShadow: profile.theme?.cardShadow || defaultTheme.cardShadow,
      font,
      foreground: profile.theme?.foreground || defaultTheme.foreground,
      themeColor: profile.theme?.themeColor || defaultTheme.themeColor,
    },
    button: profile.button || {
      buttonStyle: "ROUNDED",
      buttonBackground: null,
    },
    settings: profile.settings || {
      socialIconPlacement: "TOP",
      seoTitle: null,
      seoDescription: null,
    },
  };

  const chakraProfileTheme = extendTheme({
    fonts: { body: font.style.fontFamily, heading: font.style.fontFamily },
    colors: {
      brand: generatePalette(value.theme.themeColor),
      gray: generatePalette(value.theme.bodyBackgroundColor),
    },
    styles: {
      global: {
        body: { color: value.theme.foreground },
      },
    },
  });

  // capture page view
  useQuery({
    queryKey: ["capture-page-view", value.id],
    queryFn: ({ queryKey }) =>
      axios.post("/api/analytics", { userId: queryKey[1], type: query.type }),
  });

  return (
    <ProfileContext.Provider value={value}>
      <ChakraProvider toastOptions={toastOptions} resetCSS theme={chakraProfileTheme}>
        <ColorModeProvider value={getColorMode(value.theme.cardBackgroundColor)}>
          {children}
        </ColorModeProvider>
      </ChakraProvider>
    </ProfileContext.Provider>
  );
}
export const useProfileContext = () => React.useContext(ProfileContext);
