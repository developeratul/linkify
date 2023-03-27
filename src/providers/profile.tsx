import { useDefaultProfileTheme } from "@/components/app/appearance/Theme/themes";
import { defaultFont, DEFAULT_FONT_NAME, fonts } from "@/fonts/profile";
import type {
  Profile,
  ProfileButton,
  ProfileLayout,
  ProfileSettings,
  ProfileTheme,
} from "@/pages/[slug]";
import { getColorMode } from "@/utils/color";
import { ChakraProvider, ColorModeProvider, extendTheme } from "@chakra-ui/react";
import type { NextFont } from "next/dist/compiled/@next/font";
import { generatePalette } from "palette-by-numbers";
import React from "react";

type InitialState = Omit<Profile, "theme" | "layout" | "button" | "settings"> & {
  theme: Omit<
    ProfileTheme,
    | "font"
    | "bodyBackgroundColor"
    | "cardBackgroundColor"
    | "themeColor"
    | "grayColor"
    | "foreground"
  > & {
    bodyBackgroundColor: string;
    cardBackgroundColor: string;
    themeColor: string;
    grayColor: string;
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
      grayColor: profile.theme?.grayColor || defaultTheme.grayColor,
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
      gray: generatePalette(value.theme.grayColor),
    },
    styles: {
      global: {
        body: { color: value.theme.foreground },
      },
    },
  });

  return (
    <ProfileContext.Provider value={value}>
      <ChakraProvider resetCSS theme={chakraProfileTheme}>
        <ColorModeProvider value={getColorMode(value.theme.cardBackgroundColor)}>
          {children}
        </ColorModeProvider>
      </ChakraProvider>
    </ProfileContext.Provider>
  );
}
export const useProfileContext = () => React.useContext(ProfileContext);
