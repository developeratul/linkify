import { Button } from "@chakra-ui/react";
import { Icon } from "components";
import { useSession } from "next-auth/react";

export default function ShareProfile() {
  const { data, status } = useSession();

  return (
    <Button
      position="fixed"
      bottom="4"
      left="4"
      zIndex="overlay"
      borderRadius="full"
      boxShadow="lg"
      colorScheme="purple"
      variant="ghost"
      isLoading={status === "loading"}
      leftIcon={<Icon name="Share" />}
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
      Share
    </Button>
  );
}
