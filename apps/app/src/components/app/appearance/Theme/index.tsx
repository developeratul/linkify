import { Conditional } from "@/components/common/Conditional";
import { SectionLoader } from "@/components/common/Loader";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import { Button, Center, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Icon } from "components";
import React from "react";
import { ErrorMessage } from "../../common/Message";
import SectionWrapper from "../common/SectionWrapper";
import CustomThemeEditor from "./CustomThemeEditor";
import ThemePreview from "./ThemePreview";
import type { Theme } from "./themes";
import { getRawTheme, themes, useDefaultProfileTheme } from "./themes";

export default function Theme() {
  const {
    isLoading,
    data: theme,
    isError,
    error,
  } = api.appearance.getTheme.useQuery(undefined, {
    onSuccess(data) {
      if (data?.theme) {
        setCurrentTheme(data.theme);
      }
    },
  });
  const { mutateAsync: updateTheme } = api.appearance.updateTheme.useMutation();
  const { mutateAsync: toggleCustomTheme, isLoading: isProcessing } =
    api.appearance.toggleCustomTheme.useMutation();
  const [currentTheme, setCurrentTheme] = React.useState("");
  const defaultTheme = useDefaultProfileTheme();
  const previewContext = usePreviewContext();
  const utils = api.useContext();

  const handleThemeUpdate = async (theme: Theme, themeName: string) => {
    const rawTheme = getRawTheme(theme);
    await updateTheme({ ...rawTheme, isCustomTheme: false, theme: themeName });
    await utils.appearance.getTheme.invalidate();
    previewContext?.reload();
  };

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorMessage description={error.message} />;

  return (
    <SectionWrapper title="Theme">
      <Conditional
        condition={!!theme?.isCustomTheme}
        component={<CustomThemeEditor />}
        fallback={
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
            <ThemePreview
              onSelect={() => {
                setCurrentTheme("");
                handleThemeUpdate({ ...defaultTheme, name: "Default", font: "poppins" }, "");
              }}
              isSelected={!currentTheme}
              theme={{
                ...defaultTheme,
                name: "Default",
                font: "poppins",
              }}
            />
            {Object.keys(themes).map((themeIndex) => {
              const theme = themes[themeIndex] as Theme;
              return (
                <ThemePreview
                  onSelect={() => {
                    setCurrentTheme(themeIndex);
                    handleThemeUpdate(theme, themeIndex);
                  }}
                  isSelected={currentTheme === themeIndex}
                  key={themeIndex}
                  theme={theme}
                />
              );
            })}
            <Center p={5} rounded="md" borderWidth={2}>
              <VStack w="full" spacing={3}>
                <Heading color="purple.500">
                  <Icon name="CustomTheme" size={30} />
                </Heading>
                <Text>Make it your own</Text>
                <Button
                  onClick={async () => {
                    await toggleCustomTheme();
                    await utils.appearance.getTheme.invalidate();
                  }}
                  isLoading={isProcessing}
                  colorScheme="purple"
                  w="full"
                >
                  Customize
                </Button>
              </VStack>
            </Center>
          </SimpleGrid>
        }
      />
    </SectionWrapper>
  );
}
