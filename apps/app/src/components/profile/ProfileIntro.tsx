import Rating from "@/components/common/Rating";
import { useProfileContext } from "@/providers/profile";
import { HStack, Heading, Text, VStack } from "@chakra-ui/react";
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
    <VStack spacing="5px" textAlign="center">
      <Heading
        fontFamily={profile.theme.font.style.fontFamily}
        color={profile.theme.themeColor || "purple.500"}
        fontSize={24}
        fontWeight="medium"
      >
        {profile.profileTitle || `@${profile.username}`}
      </Heading>
      <Text whiteSpace="pre-wrap" fontSize={16}>
        {profile.bio}
      </Text>
      {profile.testimonials.length > 0 && averageRating > 0 && (
        <HStack justify="center" align="center">
          <Rating starDimension="15px" starSpacing="1px" rating={averageRating} />
          <Text fontSize="sm">
            {averageRating}{" "}
            <Text as="span" color="gray">
              ({profile.testimonials.length} reviews)
            </Text>
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
