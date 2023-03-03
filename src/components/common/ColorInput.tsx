import * as Chakra from "@chakra-ui/react";
import React from "react";
import type { ColorPickerProps } from "./ColorPicker";
import ColorPicker from "./ColorPicker";

type ColorInputProps = {
  label?: string;
  helperText?: string;
  trigger?: React.ReactNode;
} & Omit<ColorPickerProps, "trigger">;

export default function ColorInput(props: ColorInputProps) {
  const {
    onChange,
    value,
    trigger = <Chakra.Button w="full">Change</Chakra.Button>,
    label,
    helperText,
  } = props;
  return (
    <Chakra.FormControl>
      {label && <Chakra.FormLabel>{label}</Chakra.FormLabel>}
      <Chakra.HStack>
        <Chakra.Box boxSize={10} rounded="md" bg={value || "purple.500"} borderWidth={1} />
        <ColorPicker value={value} onChange={onChange} trigger={trigger} />
      </Chakra.HStack>
      {helperText && <Chakra.FormHelperText>{helperText}</Chakra.FormHelperText>}
    </Chakra.FormControl>
  );
}
