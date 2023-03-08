import { useProfileContext } from "@/providers/profile";
import type { AvatarProps } from "@chakra-ui/react";
import * as Chakra from "@chakra-ui/react";

export default function ProfileImage() {
  const profile = useProfileContext();
  const defaultProps: AvatarProps = {
    name: profile?.profileTitle,
    mx: "auto",
    boxSize: 100,
    src: profile?.image || "",
    rounded: "full",
    borderWidth: 2,
    borderColor: profile?.themeColor,
  };

  if (profile?.layout === "CARD") {
    return (
      <legend className="mx-auto">
        <Chakra.Avatar {...defaultProps} />
      </legend>
    );
  }

  return <Chakra.Avatar {...defaultProps} />;
}
