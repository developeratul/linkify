import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import React from "react";
import type { ColorChangeHandler } from "react-color";
import { SketchPicker } from "react-color";

export type ColorPickerProps = {
  trigger: React.ReactNode;
  onChange: ColorChangeHandler;
  value: string;
};

export default function ColorPicker(props: ColorPickerProps) {
  const { trigger, onChange, value } = props;
  return (
    <Popover isLazy>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent>
        <PopoverBody p={0} w="full" maxW={300}>
          <SketchPicker
            color={value}
            onChange={onChange}
            styles={{
              default: { picker: { background: "none", boxShadow: "none", width: "100%" } },
            }}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
