import type { AppProps } from "@/types";
import type { UseRadioProps } from "@chakra-ui/react";
import { Box, useRadio } from "@chakra-ui/react";

export type RadioCardProps = UseRadioProps & AppProps;

export function RadioCard(props: RadioCardProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        userSelect="none"
        borderWidth={3}
        rounded="lg"
        borderColor="transparent"
        _checked={{
          borderColor: "purple.500",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        p={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}
