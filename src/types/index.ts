import type React from "react";

export type AppProps = {
  children: React.ReactNode;
};

export type Link = {
  id: string;
  thumbnail?: string | null;
  text: string;
  url: string;
  clickCount: number;
  hidden: boolean;
};

export type Section = {
  id: string;
  name: string | null;
  links: Link[];
};

export type SocialLink = {
  id: string;
  url: string;
  icon: string;
};
