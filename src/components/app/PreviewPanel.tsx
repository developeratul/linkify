import * as Chakra from "@chakra-ui/react";

export type PreviewPanelProps = {
  username: string;
};

export function PreviewPanel(props: PreviewPanelProps) {
  const { username } = props;
  return (
    <Chakra.VStack
      position="sticky"
      top={"96px"}
      right={0}
      w="full"
      h="calc(100vh - 96px)"
      maxW={550}
      rounded="md"
      overflow="hidden"
      as="iframe"
      src={`/${username}`}
      bg="gray.300"
    />
  );
}
