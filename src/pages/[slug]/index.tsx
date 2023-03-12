import { SEO } from "@/components/common/SEO";
import AddTestimonialModal from "@/components/profile/AddTestimonial";
import Container from "@/components/profile/Container";
import ProfileImage from "@/components/profile/Image";
import Sections from "@/components/profile/Sections";
import SocialLinks from "@/components/profile/SocialLinks";
import Wrapper from "@/components/profile/Wrapper";
import ProfileProvider from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";

type ProfileProps = {
  profile: Profile;
};

const ProfilePage: NextPage<ProfileProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { profile } = props;
  return (
    <ProfileProvider profile={profile}>
      <SEO
        title={profile.seoTitle || profile.username || ""}
        description={profile.seoDescription || `@${profile.username}'s profile on Linkify`}
      />
      <Chakra.Box
        background={
          profile.bodyBackgroundType === "IMAGE"
            ? `url('${profile.bodyBackgroundImage}')`
            : profile.bodyBackgroundColor || "purple.50"
        }
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
        minH="100vh"
        py={50}
        px={{ base: 3, md: 5 }}
      >
        <AddTestimonialModal />
        <Container>
          <Wrapper>
            <ProfileImage />
            <Chakra.VStack spacing="5px" textAlign="center">
              <Chakra.Heading
                color={profile.themeColor || "purple.500"}
                fontSize={24}
                fontWeight="medium"
              >
                {profile.profileTitle || `@${profile.username}`}
              </Chakra.Heading>
              <Chakra.Text fontSize={16}>{profile.bio}</Chakra.Text>
            </Chakra.VStack>
            {profile.socialIconPlacement === "TOP" && <SocialLinks />}
            <Sections />
            {profile.socialIconPlacement === "BOTTOM" && <SocialLinks />}
          </Wrapper>
        </Container>
      </Chakra.Box>
    </ProfileProvider>
  );
};

export default ProfilePage;

import { LinkSelections } from "@/server/api/routers/link";
import { prisma } from "@/server/db";
import type { ProfileSection, SocialLink } from "@/types";
import type {
  BackgroundType,
  ButtonStyle,
  CardShadow,
  Layout,
  SocialIconPlacement,
} from "@prisma/client";

export type Profile = {
  id: string;
  username: string | null;
  name?: string | null;
  bio: string | null;
  image?: string | null;
  profileTitle?: string | null;
  layout: Layout;
  containerWidth: number;
  cardShadow: CardShadow;
  linksColumnCount: number;
  bodyBackgroundType: BackgroundType;
  bodyBackgroundColor?: string | null;
  bodyBackgroundImage?: string | null;
  cardBackgroundColor?: string | null;
  themeColor?: string | null;
  grayColor?: string | null;
  foreground?: string | null;
  buttonStyle: ButtonStyle;
  buttonBackground?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  socialIconPlacement?: SocialIconPlacement;
  sections: ProfileSection[];
  socialLinks: SocialLink[];
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
      seoTitle: true,
      seoDescription: true,
      socialIconPlacement: true,
      layout: true,
      containerWidth: true,
      cardShadow: true,
      linksColumnCount: true,
      bodyBackgroundType: true,
      bodyBackgroundColor: true,
      bodyBackgroundImage: true,
      cardBackgroundColor: true,
      themeColor: true,
      grayColor: true,
      foreground: true,
      buttonStyle: true,
      buttonBackground: true,
      sections: {
        select: {
          id: true,
          name: true,
          links: {
            where: { hidden: false },
            select: {
              ...LinkSelections,
              hidden: false,
              clickCount: false,
            },
            orderBy: {
              index: "asc",
            },
          },
        },
        orderBy: {
          index: "asc",
        },
      },
      socialLinks: {
        select: {
          id: true,
          icon: true,
          url: true,
        },
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  if (!user || !user.username || !user.bio) {
    return {
      notFound: true,
    };
  }

  return {
    props: { profile: user satisfies Profile },
  };
};
