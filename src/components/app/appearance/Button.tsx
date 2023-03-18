import ColorInput from "@/components/app/common/ColorInput";
import { SectionLoader } from "@/components/common/Loader";
import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import type { BoxProps } from "@chakra-ui/react";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SectionWrapper from "./common/SectionWrapper";

export const buttonVariants = [
  "SHARP",
  "ROUNDED",
  "CIRCLE",
  "SHARP_OUTLINED",
  "ROUNDED_OUTLINED",
  "CIRCLE_OUTLINED",
];

export const buttonVariantProps: Record<string, BoxProps> = {
  SHARP: {
    rounded: "none",
  },
  ROUNDED: {
    rounded: "md",
  },
  CIRCLE: {
    rounded: "full",
  },
  SHARP_OUTLINED: {
    rounded: "none",
    borderWidth: 2,
    background: "transparent",
  },
  ROUNDED_OUTLINED: {
    rounded: "md",
    borderWidth: 2,
    background: "transparent",
  },
  CIRCLE_OUTLINED: {
    rounded: "full",
    borderWidth: 2,
    background: "transparent",
  },
};

export const buttonImageRoundness = {
  SHARP: "none",
  ROUNDED: "lg",
  CIRCLE: "full",
  SHARP_OUTLINED: "none",
  ROUNDED_OUTLINED: "lg",
  CIRCLE_OUTLINED: "full",
};

export const buttonSchema = z.object({
  buttonStyle: z.enum([
    "SHARP",
    "ROUNDED",
    "CIRCLE",
    "SHARP_OUTLINED",
    "ROUNDED_OUTLINED",
    "CIRCLE_OUTLINED",
  ]),
  buttonBackground: z.string().optional().nullable(),
});

type ButtonSchema = z.infer<typeof buttonSchema>;

export default function Button() {
  const { data: theme } = api.appearance.getTheme.useQuery();
  const { isLoading } = api.appearance.getButtonStyle.useQuery(undefined, {
    onSuccess(data) {
      if (data) {
        setValue("buttonStyle", data.buttonStyle);
        setValue("buttonBackground", data.buttonBackground || "");
      }
    },
  });
  const { isLoading: isProcessing, mutateAsync } = api.appearance.updateButtonStyle.useMutation();
  const { setValue, watch, handleSubmit } = useForm<ButtonSchema>({
    resolver: zodResolver(buttonSchema),
  });
  const toast = useToast();
  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const onSubmit = async (data: ButtonSchema) => {
    try {
      await mutateAsync(data);
      await utils.appearance.getButtonStyle.invalidate();
      previewContext?.reload();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "success", description: err.message });
      }
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <SectionWrapper title="Buttons">
      <Chakra.VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={10}>
        <Chakra.FormControl>
          <Chakra.FormLabel>Button style</Chakra.FormLabel>
          <Chakra.SimpleGrid spacing={5} columns={{ base: 1, sm: 2, lg: 3 }}>
            {buttonVariants.map((buttonVariantName) => {
              const isSelected = watch("buttonStyle") === buttonVariantName;
              return (
                <Chakra.Box
                  onClick={() =>
                    setValue("buttonStyle", buttonVariantName as ButtonSchema["buttonStyle"])
                  }
                  boxShadow={isSelected ? "outline" : "none"}
                  cursor="pointer"
                  background="black"
                  borderColor="black"
                  p={6}
                  textAlign="center"
                  key={buttonVariantName}
                  {...buttonVariantProps[buttonVariantName]}
                />
              );
            })}
          </Chakra.SimpleGrid>
        </Chakra.FormControl>
        <Chakra.VStack spacing={3} align="start" w="full">
          <ColorInput
            label="Button background"
            value={watch("buttonBackground") || theme?.themeColor || ""}
            onChange={(color) => setValue("buttonBackground", color.hex)}
          />
          <Chakra.Text>
            Don&apos;t want a different button background?{" "}
            <Chakra.Button onClick={() => setValue("buttonBackground", null)} variant="link">
              Sync with your theme
            </Chakra.Button>
          </Chakra.Text>
        </Chakra.VStack>
        <Chakra.Button
          leftIcon={<Icon name="Save" />}
          isLoading={isProcessing}
          w="full"
          type="submit"
          colorScheme="purple"
        >
          Save changes
        </Chakra.Button>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
