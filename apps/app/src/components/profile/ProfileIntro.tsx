import Rating from "@/components/common/Rating";
import { useProfileContext } from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export default function ProfileIntro() {
  const profile = useProfileContext();

  const averageRating = React.useMemo(() => {
    const total =
      profile?.testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) || 0;
    const average = total / (profile?.testimonials.length || 0);
    return Math.round(average * 10) / 10 || 0;
  }, [profile?.testimonials]);

  if (profile === undefined) return <></>;

  return (
    <Chakra.VStack spacing="5px" textAlign="center">
      <Chakra.Heading
        fontFamily={profile.theme.font.style.fontFamily}
        color={profile.theme.themeColor || "purple.500"}
        fontSize={24}
        fontWeight="medium"
      >
        {profile.profileTitle || `@${profile.username}`}
      </Chakra.Heading>
      <Chakra.Text whiteSpace="pre-wrap" fontSize={16}>
        {profile.bio}
      </Chakra.Text>
      {profile.testimonials.length > 0 && averageRating > 0 && (
        <Chakra.HStack
          as={Link}
          href={{ query: { tab: "testimonials", slug: profile.username } }}
          align="center"
        >
          <Rating starDimension="15px" starSpacing="1px" rating={averageRating} />
          <Chakra.Text fontSize="sm">
            {averageRating}{" "}
            <Chakra.Text as="span" color="gray">
              ({profile.testimonials.length} reviews)
            </Chakra.Text>
          </Chakra.Text>
        </Chakra.HStack>
      )}
    </Chakra.VStack>
  );
}
