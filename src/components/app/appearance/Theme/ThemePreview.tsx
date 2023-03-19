import * as Chakra from "@chakra-ui/react";
import type { Theme } from "./themes";

type ThemePreviewProps = {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
};

export default function ThemePreview(props: ThemePreviewProps) {
  const { theme, isSelected, onSelect } = props;
  return (
    <Chakra.VStack spacing={3}>
      <Chakra.Box
        onClick={onSelect}
        {...(isSelected ? { shadow: "outline" } : {})}
        cursor="pointer"
        w="full"
        p={5}
        rounded="md"
        bg={theme.bodyBackgroundColor}
      >
        <Chakra.VStack>
          {Array(5)
            .fill({})
            .map((_, index) => (
              <ThemeButton key={index} theme={theme} />
            ))}
        </Chakra.VStack>
      </Chakra.Box>
      <Chakra.Text textAlign="center" fontSize="md">
        {theme.name}
      </Chakra.Text>
    </Chakra.VStack>
  );
}

function ThemeButton(props: { theme: Theme }) {
  const { theme } = props;
  return <Chakra.Box bg={theme.themeColor} py={4} px={5} w="full" rounded="full" />;
}
