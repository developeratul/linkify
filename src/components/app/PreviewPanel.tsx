import { usePreviewContext } from "@/providers/preview";
import * as Chakra from "@chakra-ui/react";

export type PreviewPanelProps = {
  username: string;
};

export function PreviewPanel(props: PreviewPanelProps) {
  const previewContext = usePreviewContext();
  if (previewContext === undefined) return <></>;

  const { username } = props;
  const { ref } = previewContext;
  return (
    <Chakra.VStack
      position="sticky"
      top={"96px"}
      right={0}
      w="full"
      h="calc(100vh - 96px)"
      maxW={{ base: "full", md: 350, lg: 450, xl: 500, "2xl": 550 }}
      display={{ base: "none", md: "block" }}
      rounded="md"
      overflow="hidden"
      bg="gray.300"
    >
      <iframe className="h-full w-full" src={`/${username}`} ref={ref} />
    </Chakra.VStack>
  );
}
