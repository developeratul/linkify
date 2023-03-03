import { Conditional } from "@/components/common/Conditional";
import Loader from "@/components/common/Loader";
import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import uploadFile from "@/utils/uploadFile";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SectionWrapper from "./common/SectionWrapper";

export const updateProfileSchema = z.object({
  profileTitle: z.string().min(1, "Title is required"),
  bio: z.string().min(15, "Bio must contain at least 15 characters"),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export function Profile() {
  const { data, isLoading } = api.appearance.getProfile.useQuery();
  const [isImageProcessing, setImageProcessing] = React.useState(false);
  const { register, formState, handleSubmit } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      profileTitle: data?.profileTitle || `@${data?.username}` || "",
      bio: data?.bio || "",
    },
  });
  const { mutateAsync, isLoading: isProcessing } = api.appearance.updateProfile.useMutation();
  const { mutateAsync: updateProfileImage } = api.appearance.updateProfileImage.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();
  const toast = useToast();

  const onSubmit = async (values: UpdateProfileSchema) => {
    try {
      await mutateAsync(values);
      await utils.appearance.getProfile.invalidate();
      previewContext?.reload();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageProcessing(true);
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const { secure_url, public_id } = await uploadFile(file);
        await updateProfileImage({ id: public_id, url: secure_url });
        await utils.appearance.getProfile.invalidate();
        previewContext?.reload();
      }
    } catch (err) {
    } finally {
      setImageProcessing(false);
    }
  };

  return (
    <SectionWrapper title="Profile">
      <Chakra.HStack align="start" spacing="5">
        <div className="group relative overflow-hidden rounded-full">
          <Chakra.Avatar
            size="xl"
            src={data?.image || ""}
            name={formState.defaultValues?.profileTitle}
          />
          <label className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center bg-black/50 text-white opacity-0 duration-100 group-hover:opacity-100">
            <Conditional
              condition={isImageProcessing}
              component={<Loader />}
              fallback={<Icon name="Add" size={30} />}
            />
            <input hidden accept="image/*" type="file" onChange={handleFileInputChange} />
          </label>
        </div>
        <Chakra.VStack flex={1} as="form" spacing="3" onSubmit={handleSubmit(onSubmit)}>
          <Chakra.FormControl isDisabled={isLoading} isInvalid={!!formState.errors.profileTitle}>
            <Chakra.FormLabel>Title</Chakra.FormLabel>
            <Chakra.Input {...register("profileTitle")} />
            <Chakra.FormErrorMessage>
              {formState.errors.profileTitle?.message}
            </Chakra.FormErrorMessage>
          </Chakra.FormControl>
          <Chakra.FormControl isDisabled={isLoading} isInvalid={!!formState.errors.bio}>
            <Chakra.FormLabel>Bio</Chakra.FormLabel>
            <Chakra.Textarea {...register("bio")} />
            <Chakra.FormErrorMessage>{formState.errors.bio?.message}</Chakra.FormErrorMessage>
          </Chakra.FormControl>
          <Chakra.Button
            isLoading={isProcessing}
            type="submit"
            leftIcon={<Icon name="Save" />}
            w="full"
            colorScheme="purple"
          >
            Save
          </Chakra.Button>
        </Chakra.VStack>
      </Chakra.HStack>
    </SectionWrapper>
  );
}
