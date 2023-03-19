import type { Theme } from "@/types";
import * as Chakra from "@chakra-ui/react";

type ThemePreviewProps = {
  theme: Theme;
};

export default function ThemePreview(props: ThemePreviewProps) {
  const { theme } = props;
  return (
    <Chakra.Box p={5} rounded="md" bg={theme.bodyBackgroundColor}>
      <Chakra.VStack>
        {Array(5)
          .fill({})
          .map((_, index) => (
            <ThemeButton key={index} theme={theme} />
          ))}
      </Chakra.VStack>
    </Chakra.Box>
  );
}

function ThemeButton(props: { theme: Theme }) {
  const { theme } = props;
  return <Chakra.Box bg={theme.themeColor} py={4} px={5} w="full" rounded="lg" />;
}
