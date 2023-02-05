import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import Image from "next/image";
import { RadioCard } from "../common/RadioCard";

const options = {
  LIGHT: {
    label: "Light",
    image: "/light-theme.gif",
  },
  DARK: {
    label: "Dark",
    image: "/dark-theme.gif",
  },
};

export function Theme() {
  const { data } = api.appearance.getTheme.useQuery();
  const { mutateAsync } = api.appearance.updateTheme.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const handleThemeChange = async (value: keyof typeof options) => {
    try {
      await mutateAsync(value);
      await utils.appearance.getTheme.invalidate();
      previewContext?.reload();
    } catch (err) {}
  };

  const { getRootProps, getRadioProps } = Chakra.useRadioGroup({
    name: "theme",
    onChange: handleThemeChange,
    value: data,
  });

  const group = getRootProps();

  return (
    <Chakra.VStack w="full" align="start" spacing="3">
      <Chakra.Heading size="md" fontWeight="medium">
        Theme
      </Chakra.Heading>
      <Chakra.Card w="full" size="lg" bg="white">
        <Chakra.CardBody>
          <Chakra.HStack {...group}>
            {(Object.keys(options) as ["LIGHT", "DARK"]).map((key) => {
              const option = options[key];
              const radio = getRadioProps({ value: key });
              return (
                <RadioCard key={key} {...radio}>
                  <Chakra.VStack>
                    <Image
                      src={option.image}
                      alt={option.label}
                      className="rounded-lg"
                      width={500}
                      height={600}
                    />
                  </Chakra.VStack>
                </RadioCard>
              );
            })}
          </Chakra.HStack>
        </Chakra.CardBody>
      </Chakra.Card>
    </Chakra.VStack>
  );
}
