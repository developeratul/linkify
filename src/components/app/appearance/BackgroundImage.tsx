import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import uploadFile from "@/utils/uploadFile";
import * as Chakra from "@chakra-ui/react";
import React from "react";

export function BackgroundImage() {
  const { data } = api.appearance.getBackgroundImage.useQuery();
  const [isProcessing, setProcessing] = React.useState(false);
  const { mutateAsync } = api.appearance.updateBackgroundImage.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProcessing(true);
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const { secure_url, public_id } = await uploadFile(file);
        await mutateAsync({ id: public_id, url: secure_url });
        await utils.appearance.getBackgroundImage.invalidate();
        previewContext?.reload();
      }
    } catch (err) {
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Chakra.VStack w="full" align="start" spacing="3">
      <Chakra.Heading size="md" fontWeight="medium">
        Background image
      </Chakra.Heading>
      <Chakra.Card w="full" size="lg" bg="white">
        <Chakra.CardBody>
          <Chakra.VStack spacing="3" w="full" align="start">
            <Chakra.Image
              src={data || ""}
              alt="Background image"
              w="full"
              rounded="lg"
            />
            <Chakra.Button
              isLoading={isProcessing}
              as="label"
              w="full"
              colorScheme="purple"
            >
              Change
              <input
                onChange={handleFileInputChange}
                hidden
                accept="image/*"
                type="file"
              />
            </Chakra.Button>
          </Chakra.VStack>
        </Chakra.CardBody>
      </Chakra.Card>
    </Chakra.VStack>
  );
}
