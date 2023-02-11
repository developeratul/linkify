import type { AppProps } from "@/types";
import type { UseRadioProps } from "@chakra-ui/react";
import * as Chakra from "@chakra-ui/react";

export type RadioCardProps = UseRadioProps & AppProps;

export function RadioCard(props: RadioCardProps) {
  const { getInputProps, getCheckboxProps } = Chakra.useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Chakra.Box as="label">
      <input {...input} />
      <Chakra.Box
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
      </Chakra.Box>
    </Chakra.Box>
  );
}
