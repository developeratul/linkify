import { IconButton } from "@chakra-ui/react";
import { Icon } from "components";
import { useSession } from "next-auth/react";

export default function ShareProfile() {
  const { data, status } = useSession();

  return (
    <IconButton
      borderRadius="full"
      colorScheme="purple"
      variant="ghost"
      isLoading={status === "loading"}
      aria-label="Share profile"
      onClick={() => {
        if (navigator.share) {
          navigator
            .share({
              url: `${window.location.origin}/${data?.user?.username}`,
            })
            .catch(console.error);
        }
      }}
    >
      <Icon name="Share" />
    </IconButton>
  );
}
