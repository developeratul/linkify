import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { RadioCard } from "../common/RadioCard";

const fonts = {
  body: "Default",
  serif: "Serif",
  sans_serif: "Sans-serif",
  monospace: "Monospace",
  cursive: "Cursive",
  fantasy: "Fantasy",
};

export function Font() {
  const { data } = api.appearance.getFont.useQuery();
  const { mutateAsync } = api.appearance.updateFont.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const handleThemeChange = async (value: keyof typeof fonts) => {
    try {
      await mutateAsync(value);
      await utils.appearance.getFont.invalidate();
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
        Font
      </Chakra.Heading>
      <Chakra.Card w="full" size="lg" bg="white">
        <Chakra.CardBody>
          <Chakra.HStack flexWrap="wrap" {...group}>
            {(
              Object.keys(fonts) as [
                "body",
                "serif",
                "sans_serif",
                "monospace",
                "cursive",
                "fantasy"
              ]
            ).map((key) => {
              const label = fonts[key];
              const radio = getRadioProps({ value: key });
              return (
                <RadioCard key={key} {...radio}>
                  <Chakra.Text
                    fontFamily={key.replace("_", "-")}
                    fontWeight="medium"
                  >
                    {label}
                  </Chakra.Text>
                </RadioCard>
              );
            })}
          </Chakra.HStack>
        </Chakra.CardBody>
      </Chakra.Card>
    </Chakra.VStack>
  );
}
