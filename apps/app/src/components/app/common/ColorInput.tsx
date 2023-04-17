import { Box, Button, FormControl, FormHelperText, FormLabel, HStack } from "@chakra-ui/react";
import React from "react";
import type { ColorPickerProps } from "./ColorPicker";
import ColorPicker from "./ColorPicker";

type ColorInputProps = {
  label?: string;
  helperText?: string;
  trigger?: React.ReactNode;
} & Omit<ColorPickerProps, "trigger">;

export default function ColorInput(props: ColorInputProps) {
  const { onChange, value, trigger = <Button w="full">Change</Button>, label, helperText } = props;
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <HStack>
        <Box boxSize={10} rounded="md" bg={value || "purple.500"} borderWidth={1} />
        <ColorPicker value={value} onChange={onChange} trigger={trigger} />
      </HStack>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
