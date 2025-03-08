import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import { Button } from "@chakra-ui/react";
import { Icon } from "components";

export default function CreateSectionModal() {
  const previewContext = usePreviewContext();
  const { isLoading, mutateAsync } = api.section.create.useMutation();
  const utils = api.useContext();

  const handleClick = async () => {
    await mutateAsync();
    await utils.section.getWithLinks.invalidate();
    previewContext?.reload();
  };
  return (
    <Button
      isLoading={isLoading}
      onClick={handleClick}
      colorScheme="purple"
      size="md"
      leftIcon={<Icon name="Create" />}
    >
      Create new
    </Button>
  );
}
