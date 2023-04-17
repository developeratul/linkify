import { Box, Text, VStack } from "@chakra-ui/react";
import type { Theme } from "./themes";

type ThemePreviewProps = {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
};

export default function ThemePreview(props: ThemePreviewProps) {
  const { theme, isSelected, onSelect } = props;
  return (
    <VStack spacing={3}>
      <Box
        onClick={onSelect}
        {...(isSelected ? { shadow: "outline" } : {})}
        cursor="pointer"
        w="full"
        p={5}
        rounded="md"
        backgroundSize="cover"
        backgroundPosition="center"
        bg={
          theme.bodyBackgroundType === "COLOR"
            ? theme.bodyBackgroundColor || ""
            : `url(${theme.bodyBackgroundImage})`
        }
      >
        <VStack>
          {Array(5)
            .fill({})
            .map((_, index) => (
              <ThemeButton key={index} theme={theme} />
            ))}
        </VStack>
      </Box>
      <Text textAlign="center" fontSize="md">
        {theme.name}
      </Text>
    </VStack>
  );
}

function ThemeButton(props: { theme: Theme }) {
  const { theme } = props;
  return <Box bg={theme.themeColor} py={4} px={5} w="full" rounded="full" />;
}
