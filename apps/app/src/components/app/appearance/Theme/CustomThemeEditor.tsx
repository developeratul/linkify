import ColorInput from "@/components/app/common/ColorInput";
import Loader from "@/components/common/Loader";
import {
  DEFAULT_FONT_NAME,
  dmSans,
  ebGaramond,
  inter,
  openSans,
  poppins,
  quicksand,
  robotoMono,
  robotoSlab,
  spaceGrotesk,
  spaceMono,
} from "@/fonts/profile";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import { getContrastColor } from "@/utils/color";
import uploadFile from "@/utils/uploadFile";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Radio,
  Select,
  SimpleGrid,
  Text,
  VStack,
  useToast,
  useToken,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import type { ChangeEvent } from "react";
import React from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const themeSchema = z.object({
  themeColor: z.string().optional(),
  foreground: z.string().optional(),
  bodyBackgroundType: z.enum(["COLOR", "IMAGE"]),
  bodyBackgroundColor: z.string().optional().nullable(),
  bodyBackgroundImage: z.string().optional().nullable(),
  bodyBackgroundImagePublicId: z.string().optional(),
  cardBackgroundColor: z.string().optional(),
  cardShadow: z.enum(["sm", "md", "lg", "xl", "none"]),
  font: z.string().optional(),
});

type ThemeSchema = z.infer<typeof themeSchema>;

const shadows = ["sm", "md", "lg", "xl", "none"];

const fonts = [
  { name: "Roboto Mono", src: robotoMono, fontIndex: "robotoMono" },
  { name: "Space Mono", src: spaceMono, fontIndex: "spaceMono" },
  { name: "Space Grotesk", src: spaceGrotesk, fontIndex: "spaceGrotesk" },
  { name: "Poppins", src: poppins, fontIndex: "poppins" },
  { name: "Inter", src: inter, fontIndex: "inter" },
  { name: "EB Garamond", src: ebGaramond, fontIndex: "ebGaramond" },
  { name: "DM Sans", src: dmSans, fontIndex: "dmSans" },
  { name: "Quicksand", src: quicksand, fontIndex: "quicksand" },
  { name: "Open sans", src: openSans, fontIndex: "openSans" },
  { name: "Roboto Slab", src: robotoSlab, fontIndex: "robotoSlab" },
];

export default function CustomThemeEditor() {
  const [bodyBackgroundColor, cardBackgroundColor, themeColor, foreground] = useToken("colors", [
    "purple.50",
    "purple.100",
    "purple.500",
    "gray.600",
    "gray.300",
  ]);
  const toast = useToast();

  const { register, watch, setValue, handleSubmit } = useForm<ThemeSchema>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      themeColor,
      foreground,
      bodyBackgroundType: "COLOR",
      bodyBackgroundColor,
      bodyBackgroundImage: null,
      cardBackgroundColor,
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
            "font"
          ]
        ).map((key) => {
          if (data[key]) {
            setValue(key, data[key] as string);
          }
        });
      }
    },
  });

  const { data: layout } = api.appearance.getLayout.useQuery();

  const { mutateAsync, isLoading: isProcessing } = api.appearance.updateTheme.useMutation();

  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const onSubmit = async (value: ThemeSchema) => {
    try {
      await mutateAsync({ ...value, isCustomTheme: true });
      await utils.appearance.getTheme.invalidate();
      previewContext?.reload();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <VStack align="start" as="form" onSubmit={handleSubmit(onSubmit)} spacing={10}>
      <FormControl>
        <FormLabel>Background type</FormLabel>
        <Select {...register("bodyBackgroundType")}>
          <option value="COLOR">Solid color</option>
          <option value="IMAGE">Image</option>
        </Select>
      </FormControl>
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
      {layout?.layout === "CARD" && (
        <>
          <ColorInput
            label="Card background color"
            value={watch("cardBackgroundColor") || ""}
            onChange={(newColor) => setValue("cardBackgroundColor", newColor.hex)}
          />
          <FormControl>
            <FormLabel>Card shadow</FormLabel>
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} w="full" spacing={5}>
              {shadows.map((shadow) => {
                const isSelected = watch("cardShadow") === shadow;
                return (
                  <Box
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
                      <Radio spacing={5} isChecked={isSelected} readOnly colorScheme="purple">
                        {shadow}
                      </Radio>
                    ) : (
                      shadow
                    )}
                  </Box>
                );
              })}
            </SimpleGrid>
          </FormControl>
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
      <FormControl>
        <FormLabel>Font</FormLabel>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {fonts.map((font) => {
            const isSelected = (watch("font") ?? DEFAULT_FONT_NAME) === font.fontIndex;
            return (
              <Box
                cursor="pointer"
                onClick={() => setValue("font", font.fontIndex)}
                {...(isSelected ? { boxShadow: "outline" } : {})}
                key={font.fontIndex}
                borderWidth={2}
                textAlign="center"
                px={5}
                rounded="md"
                py={3}
              >
                <Text fontFamily={font.src.style.fontFamily}>{font.name}</Text>
              </Box>
            );
          })}
        </SimpleGrid>
      </FormControl>
      <Button
        isLoading={isProcessing}
        type="submit"
        leftIcon={<Icon name="Save" />}
        colorScheme="purple"
        w="full"
      >
        Save changes
      </Button>
      <ToggleCustomThemeButton />
    </VStack>
  );
}

function AddBackgroundImage(props: {
  bodyBackgroundImage?: string | null;
  bodyBackgroundImagePublicId?: string | null;
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
    <FormControl>
      <FormLabel>Image</FormLabel>
      {bodyBackgroundImage ? (
        <VStack>
          <Image src={bodyBackgroundImage} alt="Background image" w="full" rounded="md" />
          <Button isLoading={isLoading} onClick={handleRemoveImage} w="full" colorScheme="red">
            Remove
          </Button>
        </VStack>
      ) : (
        <Input
          disabled={isImageUploading}
          onChange={handleImageInputChange}
          accept="image/*"
          type="file"
        />
      )}
    </FormControl>
  );
}

function ToggleCustomThemeButton() {
  const { mutateAsync, isLoading } = api.appearance.toggleCustomTheme.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const handleClick = async () => {
    await mutateAsync();
    await utils.appearance.getTheme.invalidate();
    previewContext?.reload();
  };

  return (
    <Button variant="link" isLoading={isLoading} onClick={handleClick}>
      Use a pre-made theme instead
    </Button>
  );
}
