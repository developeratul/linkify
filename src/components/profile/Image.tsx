import { useProfileContext } from "@/providers/profile";
import * as Chakra from "@chakra-ui/react";

export default function ProfileImage() {
  const profile = useProfileContext();

  if (profile?.layout === "CARD") {
    return (
      <legend className="mx-auto">
        <Chakra.Image
          mx="auto"
          boxSize={100}
          src={profile?.image || ""}
          rounded="full"
          border="2px solid"
          borderColor={profile?.themeColor}
        />
      </legend>
    );
  }

  return (
    <Chakra.Image
      boxSize={100}
      src={profile?.image || ""}
      rounded="full"
      border="2px solid"
      borderColor={profile?.themeColor}
    />
  );
}
