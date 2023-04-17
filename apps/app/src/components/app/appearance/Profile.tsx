import { Conditional } from "@/components/common/Conditional";
import Loader, { SectionLoader } from "@/components/common/Loader";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import uploadFile from "@/utils/uploadFile";
import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ErrorMessage } from "../common/Message";
import SectionWrapper from "./common/SectionWrapper";

export const updateProfileSchema = z.object({
  profileTitle: z.string().min(1, "Title is required"),
  bio: z.string().min(15, "Bio must contain at least 15 characters"),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export function Profile() {
  const { data, isLoading, isError, error } = api.appearance.getProfile.useQuery();
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

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorMessage description={error.message} />;

  return (
    <SectionWrapper title="Profile">
      <Stack
        flexDirection={{ base: "column", sm: "row" }}
        align={{ base: "center", sm: "start" }}
        gap={5}
      >
        <div className="group relative overflow-hidden rounded-full">
          <Avatar size="xl" src={data?.image || ""} name={formState.defaultValues?.profileTitle} />
          <label className="absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center bg-black/50 text-white opacity-0 duration-100 group-hover:opacity-100">
            <Conditional
              condition={isImageProcessing}
              component={<Loader />}
              fallback={<Icon name="Add" size={30} />}
            />
            <input hidden accept="image/*" type="file" onChange={handleFileInputChange} />
          </label>
        </div>
        <VStack w="full" flex={1} as="form" spacing="3" onSubmit={handleSubmit(onSubmit)}>
          <FormControl isDisabled={isLoading} isInvalid={!!formState.errors.profileTitle}>
            <FormLabel>Title</FormLabel>
            <Input {...register("profileTitle")} />
            <FormErrorMessage>{formState.errors.profileTitle?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isDisabled={isLoading} isInvalid={!!formState.errors.bio}>
            <FormLabel>Bio</FormLabel>
            <Textarea {...register("bio")} />
            <FormErrorMessage>{formState.errors.bio?.message}</FormErrorMessage>
          </FormControl>
          <Button
            isLoading={isProcessing}
            type="submit"
            leftIcon={<Icon name="Save" />}
            w="full"
            colorScheme="purple"
          >
            Save
          </Button>
        </VStack>
      </Stack>
    </SectionWrapper>
  );
}
