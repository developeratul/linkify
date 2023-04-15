import ColorInput from "@/components/app/common/ColorInput";
import { SectionLoader } from "@/components/common/Loader";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import type { BoxProps } from "@chakra-ui/react";
import {
  Box,
  Button as Button_1,
  FormControl,
  FormLabel,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ErrorMessage } from "../common/Message";
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
  const { isLoading, isError, error } = api.appearance.getButtonStyle.useQuery(undefined, {
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
        toast({ status: "error", description: err.message });
      }
    }
  };

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorMessage description={error.message} />;

  return (
    <SectionWrapper title="Buttons">
      <VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={10}>
        <FormControl>
          <FormLabel>Button style</FormLabel>
          <SimpleGrid spacing={5} columns={{ base: 1, sm: 2, lg: 3 }}>
            {buttonVariants.map((buttonVariantName) => {
              const isSelected = watch("buttonStyle") === buttonVariantName;
              return (
                <Box
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
          </SimpleGrid>
        </FormControl>
        <VStack spacing={3} align="start" w="full">
          <ColorInput
            label="Button background"
            value={watch("buttonBackground") || theme?.themeColor || ""}
            onChange={(color) => setValue("buttonBackground", color.hex)}
          />
          <Text>
            Don&apos;t want a different button background?{" "}
            <Button_1 onClick={() => setValue("buttonBackground", null)} variant="link">
              Sync with your theme
            </Button_1>
          </Text>
        </VStack>
        <Button_1
          leftIcon={<Icon name="Save" />}
          isLoading={isProcessing}
          w="full"
          type="submit"
          colorScheme="purple"
        >
          Save changes
        </Button_1>
      </VStack>
    </SectionWrapper>
  );
}
