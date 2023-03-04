import ColorInput from "@/components/common/ColorInput";
import { SectionLoader } from "@/components/common/Loader";
import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast, useToken } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SectionWrapper from "./common/SectionWrapper";

export const themeSchema = z.object({
  themeColor: z.string().optional(),
  foreground: z.string().optional(),
  grayColor: z.string().optional(),
  bodyBackgroundType: z.enum(["COLOR", "IMAGE"]),
  bodyBackgroundColor: z.string().optional(),
  cardBackgroundColor: z.string().optional(),
  cardShadow: z.enum(["sm", "md", "lg", "xl", "none"]),
});

type ThemeSchema = z.infer<typeof themeSchema>;

const shadows = ["sm", "md", "lg", "xl", "none"];

export default function Theme() {
  const [bodyBackgroundColor, cardBackgroundColor, themeColor, foreground, grayColor] = useToken(
    "colors",
    ["purple.50", "purple.100", "purple.500", "gray.600", "gray.500"]
  );
  const toast = useToast();

  const { register, watch, setValue, handleSubmit } = useForm<ThemeSchema>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      themeColor,
      foreground,
      bodyBackgroundType: "COLOR",
      bodyBackgroundColor,
      cardBackgroundColor,
      grayColor,
    },
  });

  const { isLoading } = api.appearance.getTheme.useQuery(undefined, {
    onSuccess(data) {
      if (data) {
        (
          Object.keys(data) as [
            "themeColor",
            "foreground",
            "bodyBackgroundType",
            "bodyBackgroundColor",
            "cardBackgroundColor",
            "grayColor"
          ]
        ).map((key) => {
          if (data[key]) {
            setValue(key, data[key] as string);
          }
        });
      }
    },
  });

  const { data } = api.appearance.getLayout.useQuery();

  const { mutateAsync, isLoading: isProcessing } = api.appearance.updateTheme.useMutation();

  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const onSubmit = async (value: ThemeSchema) => {
    try {
      await mutateAsync(value);
      await utils.appearance.getTheme.invalidate();
      previewContext?.reload();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <SectionWrapper title="Theme">
      <Chakra.VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={10}>
        <Chakra.FormControl>
          <Chakra.FormLabel>Background type</Chakra.FormLabel>
          <Chakra.Select {...register("bodyBackgroundType")}>
            <option value="COLOR">Solid color</option>
            <option value="IMAGE">Image</option>
          </Chakra.Select>
        </Chakra.FormControl>
        {watch("bodyBackgroundType") === "COLOR" ? (
          <ColorInput
            label="Body background color"
            value={watch("bodyBackgroundColor") || ""}
            onChange={(newColor) => setValue("bodyBackgroundColor", newColor.hex)}
          />
        ) : (
          <h1>Image</h1>
        )}
        {data?.layout === "CARD" && (
          <>
            <ColorInput
              label="Card background color"
              value={watch("cardBackgroundColor") || ""}
              onChange={(newColor) => setValue("cardBackgroundColor", newColor.hex)}
            />
            <Chakra.FormControl>
              <Chakra.FormLabel>Card shadow</Chakra.FormLabel>
              <Chakra.SimpleGrid columns={3} w="full" spacing={5}>
                {shadows.map((shadow) => {
                  const isSelected = watch("cardShadow") === shadow;
                  return (
                    <Chakra.Box
                      {...(isSelected ? { borderWidth: 2, borderColor: "purple.500" } : {})}
                      key={shadow}
                      cursor="pointer"
                      shadow={shadow}
                      py={3}
                      px={5}
                      bg={watch("cardBackgroundColor")}
                      rounded="lg"
                      fontWeight="medium"
                      textAlign="center"
                      onClick={() => setValue("cardShadow", shadow as any)}
                    >
                      {isSelected ? (
                        <Chakra.Radio
                          spacing={5}
                          isChecked={isSelected}
                          readOnly
                          colorScheme="purple"
                        >
                          {shadow}
                        </Chakra.Radio>
                      ) : (
                        shadow
                      )}
                    </Chakra.Box>
                  );
                })}
              </Chakra.SimpleGrid>
            </Chakra.FormControl>
          </>
        )}
        <ColorInput
          label="Theme color"
          helperText="The color that represents you"
          value={watch("themeColor") || ""}
          onChange={(newColor) => setValue("themeColor", newColor.hex)}
        />
        <ColorInput
          label="Foreground"
          helperText="The text color throughout your profile"
          value={watch("foreground") || ""}
          onChange={(newColor) => setValue("foreground", newColor.hex)}
        />
        <ColorInput
          label="Low contrast text color"
          helperText="Color of the texts that will have low priority"
          value={watch("grayColor") || ""}
          onChange={(newColor) => setValue("grayColor", newColor.hex)}
        />
        <Chakra.Button
          isLoading={isProcessing}
          type="submit"
          leftIcon={<Icon name="Save" />}
          colorScheme="purple"
          w="full"
        >
          Save changes
        </Chakra.Button>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
