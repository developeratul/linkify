import { useProfileContext } from "@/providers/profile";
import type { AvatarProps } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";

export default function ProfileImage() {
  const profile = useProfileContext();

  if (profile === undefined) return <></>;

  const defaultProps: AvatarProps = {
    name: profile.profileTitle || profile.username || "",
    mx: "auto",
    boxSize: 100,
    src: profile?.image || "",
    rounded: "full",
    borderWidth: 2,
    borderColor: profile.theme.themeColor,
  };

  if (profile.layout.layout === "CARD") {
    return (
      <legend className="mx-auto">
        <Avatar {...defaultProps} />
      </legend>
    );
  }

  return <Avatar {...defaultProps} />;
}
