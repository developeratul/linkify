import type React from "react";

export type AppProps = {
  children: React.ReactNode;
};

export type Section = {
  id: string;
  name: string | null;
  links: Link[];
};

export type ProfileSection = Omit<Section, "links"> & {
  links: Omit<Link, "hidden" | "clickCount">;
};

export type Link = {
  id: string;
  thumbnail?: string | null;
  text: string;
  url: string;
  clickCount: number;
  hidden: boolean;
};

export type ProfileLink = ProfileSection["links"];

export type SocialLink = {
  id: string;
  url: string;
  icon: string;
};
