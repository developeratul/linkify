import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";

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
    <Chakra.Button isLoading={isLoading} onClick={handleClick} colorScheme="purple" leftIcon={<Icon name="Create" />}>
      Create new
    </Chakra.Button>
  );
}
