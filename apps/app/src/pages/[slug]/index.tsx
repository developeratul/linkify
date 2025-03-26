import { Conditional } from "@/components/common/Conditional";
import { SEO } from "@/components/common/SEO";
import Container from "@/components/profile/Container";
import Footer from "@/components/profile/Footer";
import ProfileImage from "@/components/profile/ProfileImage";
import ProfileIntro from "@/components/profile/ProfileIntro";
import Sections from "@/components/profile/Sections";
import SendTestimonial from "@/components/profile/SendTestimonial";
import SocialLinks from "@/components/profile/SocialLinks";
import Testimonials from "@/components/profile/Testimonials";
import Wrapper from "@/components/profile/Wrapper";
import { getSubscription } from "@/lib/subscription";
import ProfileProvider from "@/providers/profile";
import {
  ProfileButtonSelections,
  ProfileLayoutSelections,
  ProfileSettingsSelections,
  ProfileThemeSelections,
} from "@/server/api/routers/appearance";
import { LinkSelections } from "@/server/api/routers/link";
import { prisma } from "@/server/db";
import { TestimonialSelections } from "@/services/testimonial";
import type { ProfileSection, SocialLink, Testimonial } from "@/types";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import type { Button, Form, Layout, Settings, Theme } from "@prisma/client";
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";

type ProfileProps = {
  profile: Profile;
  isPro: boolean;
};

const ProfilePage: NextPage<ProfileProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { profile, isPro } = props;
  return (
    <ProfileProvider profile={profile}>
      <SEO
        title={profile.settings?.seoTitle || profile.username || ""}
        description={
          profile.settings?.seoDescription || `@${profile.username}'s profile on Linkify`
        }
      />
      <Box
        background={
          profile.theme?.bodyBackgroundType === "IMAGE"
            ? `url('${profile.theme.bodyBackgroundImage}')`
            : profile.theme?.bodyBackgroundColor || "purple.50"
        }
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
        minH="100vh"
        py={50}
        px={{ base: 3, md: 5 }}
      >
        {profile.isAcceptingTestimonials && <SendTestimonial />}
        <Container>
          <Wrapper>
            <ProfileImage />
            <ProfileIntro />
            {(profile.settings?.socialIconPlacement || "TOP") === "TOP" && <SocialLinks />}
            <Conditional
              condition={profile.testimonials.length > 0}
              component={
                <Tabs isLazy isFitted colorScheme="brand" w="full">
                  <TabList>
                    <Tab>Links</Tab>
                    <Tab>Testimonials</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel px={0} py={5}>
                      <Sections />
                    </TabPanel>
                    <TabPanel px={0} py={5}>
                      <Testimonials />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              }
              fallback={<Sections />}
            />
            {(profile.settings?.socialIconPlacement || "TOP") === "BOTTOM" && <SocialLinks />}
          </Wrapper>
          <Footer isPro={isPro} />
        </Container>
      </Box>
    </ProfileProvider>
  );
};

export default ProfilePage;

export type ProfileLayout = Omit<Layout, "id" | "userId">;

export type ProfileTheme = Omit<
  Theme,
  "id" | "userId" | "isCustomTheme" | "theme" | "bodyBackgroundImagePublicId"
>;

export type ProfileButton = Omit<Button, "id" | "userId">;

export type ProfileSettings = Omit<Settings, "id" | "userId">;

export type Profile = {
  id: string;
  username: string | null;
  name?: string | null;
  bio: string | null;
  image?: string | null;
  profileTitle?: string | null;
  isAcceptingTestimonials: boolean;
  layout?: ProfileLayout | null;
  theme?: ProfileTheme | null;
  button?: ProfileButton | null;
  settings?: ProfileSettings | null;
  form?: Form | null;
  sections: ProfileSection[];
  socialLinks: SocialLink[];
  testimonials: Testimonial[];
};

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (ctx) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: ctx.query.slug as string }, { username: ctx.query.slug as string }],
    },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      image: true,
      profileTitle: true,
      isAcceptingTestimonials: true,
      layout: { select: ProfileLayoutSelections },
      theme: { select: ProfileThemeSelections },
      settings: { select: ProfileSettingsSelections },
      button: { select: ProfileButtonSelections },
      form: true,
      sections: {
        select: {
          id: true,
          name: true,
          links: {
            where: { hidden: false },
            select: { ...LinkSelections, hidden: false },
            orderBy: { index: "asc" },
          },
        },
        orderBy: { index: "asc" },
      },
      socialLinks: {
        select: { id: true, icon: true, url: true },
        orderBy: { index: "asc" },
      },
      testimonials: {
        where: { shouldShow: true },
        select: TestimonialSelections,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user || !user.username || !user.bio) return { notFound: true };

  const { isPro } = await getSubscription(user.id);

  return {
    props: { profile: user satisfies Profile, isPro: !!isPro },
  };
};
