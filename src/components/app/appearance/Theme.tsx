import ColorInput from "@/components/app/common/ColorInput";
import { SectionLoader } from "@/components/common/Loader";
import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import { getContrastColor } from "@/utils/color";
import uploadFile from "@/utils/uploadFile";
import * as Chakra from "@chakra-ui/react";
import { useToast, useToken } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import type { ChangeEvent } from "react";
import React from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SectionWrapper from "./common/SectionWrapper";

export const themeSchema = z.object({
  themeColor: z.string().optional(),
  foreground: z.string().optional(),
  grayColor: z.string().optional(),
  bodyBackgroundType: z.enum(["COLOR", "IMAGE"]),
  bodyBackgroundColor: z.string().optional(),
  bodyBackgroundImage: z.string().optional(),
  bodyBackgroundImagePublicId: z.string().optional(),
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
            "bodyBackgroundImage",
            "bodyBackgroundImagePublicId",
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
          <AddBackgroundImage
            bodyBackgroundImage={watch("bodyBackgroundImage")}
            bodyBackgroundImagePublicId={watch("bodyBackgroundImagePublicId")}
            setValue={setValue}
          />
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
                      {...(isSelected ? { borderWidth: 2, borderColor: "blue.300" } : {})}
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
                      color={getContrastColor(watch("cardBackgroundColor") as string)}
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

function AddBackgroundImage(props: {
  bodyBackgroundImage: string | undefined;
  bodyBackgroundImagePublicId: string | undefined;
  setValue: UseFormSetValue<ThemeSchema>;
}) {
  const { bodyBackgroundImage, bodyBackgroundImagePublicId, setValue } = props;

  const [isImageUploading, setImageUploading] = React.useState(false);

  const { mutateAsync, isLoading } = api.appearance.deleteImage.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const handleImageInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageUploading(true);
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const { secure_url, public_id } = await uploadFile(file);
        setValue("bodyBackgroundImage", secure_url);
        setValue("bodyBackgroundImagePublicId", public_id);
      }
    } catch (err) {
      //
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!bodyBackgroundImage || !bodyBackgroundImagePublicId) return;
    try {
      await mutateAsync();
      setValue("bodyBackgroundImage", undefined);
      setValue("bodyBackgroundImagePublicId", undefined);
      await utils.appearance.getTheme.invalidate();
      previewContext?.reload();
    } catch (err) {}
  };

  return (
    <Chakra.FormControl>
      <Chakra.FormLabel>Image</Chakra.FormLabel>
      {bodyBackgroundImage ? (
        <Chakra.VStack>
          <Chakra.Image src={bodyBackgroundImage} alt="Background image" w="full" rounded="md" />
          <Chakra.Button
            isLoading={isLoading}
            onClick={handleRemoveImage}
            w="full"
            colorScheme="red"
          >
            Remove
          </Chakra.Button>
        </Chakra.VStack>
      ) : (
        <Chakra.Input
          disabled={isImageUploading}
          onChange={handleImageInputChange}
          accept="image/*"
          type="file"
        />
      )}
    </Chakra.FormControl>
  );
}
