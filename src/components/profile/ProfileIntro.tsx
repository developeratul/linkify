import { useProfileContext } from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";

export default function ProfileIntro() {
  const profile = useProfileContext();

  if (profile === undefined) return <></>;

  return (
    <Chakra.VStack spacing="5px" textAlign="center">
      <Chakra.Heading
        fontFamily={profile.font.style.fontFamily}
        color={profile.themeColor || "purple.500"}
        fontSize={24}
        fontWeight="medium"
      >
        {profile.profileTitle || `@${profile.username}`}
      </Chakra.Heading>
      <Chakra.Text fontSize={16}>{profile.bio}</Chakra.Text>
    </Chakra.VStack>
  );
}
