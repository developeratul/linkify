import { Conditional } from "@/components/common/Conditional";
import { SEO } from "@/components/common/SEO";
import AddTestimonialModal from "@/components/profile/AddTestimonial";
import Container from "@/components/profile/Container";
import ProfileImage from "@/components/profile/Image";
import Sections from "@/components/profile/Sections";
import SocialLinks from "@/components/profile/SocialLinks";
import Testimonials from "@/components/profile/Testimonials";
import Wrapper from "@/components/profile/Wrapper";
import ProfileProvider from "@/providers/profile";
import { LinkSelections } from "@/server/api/routers/link";
import { TestimonialSelections } from "@/server/api/routers/testimonial";
import { prisma } from "@/server/db";
import type { ProfileSection, SocialLink, Testimonial } from "@/types";
import * as Chakra from "@chakra-ui/react";
import type {
  BackgroundType,
  ButtonStyle,
  CardShadow,
  Layout,
  SocialIconPlacement,
} from "@prisma/client";
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
            <Conditional
              condition={profile.testimonials.length > 0}
              component={
                <Chakra.Tabs isLazy isFitted w="full">
                  <Chakra.TabList>
                    <Chakra.Tab
                      color={profile.foreground || "gray.600"}
                      _active={{}}
                      _hover={{}}
                      _selected={{
                        color: profile.themeColor || "purple.500",
                        borderBottomColor: profile.themeColor || "purple.500",
                      }}
                    >
                      Links
                    </Chakra.Tab>
                    <Chakra.Tab
                      color={profile.foreground || "gray.600"}
                      _active={{}}
                      _hover={{}}
                      _selected={{
                        color: profile.themeColor || "purple.500",
                        borderBottomColor: profile.themeColor || "purple.500",
                      }}
                    >
                      Testimonials
                    </Chakra.Tab>
                  </Chakra.TabList>
                  <Chakra.TabPanels>
                    <Chakra.TabPanel px={0} py={5}>
                      <Sections />
                    </Chakra.TabPanel>
                    <Chakra.TabPanel px={0} py={5}>
                      <Testimonials />
                    </Chakra.TabPanel>
                  </Chakra.TabPanels>
                </Chakra.Tabs>
              }
              fallback={<Sections />}
            />
            {profile.socialIconPlacement === "BOTTOM" && <SocialLinks />}
          </Wrapper>
        </Container>
      </Chakra.Box>
    </ProfileProvider>
  );
};

export default ProfilePage;

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
      testimonials: {
        where: {
          shouldShow: true,
        },
        select: TestimonialSelections,
        orderBy: {
          createdAt: "desc",
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
