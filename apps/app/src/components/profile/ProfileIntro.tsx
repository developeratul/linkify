import { useProfileContext } from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";

export default function ProfileIntro() {
  const profile = useProfileContext();

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
    </Chakra.VStack>
  );
}
