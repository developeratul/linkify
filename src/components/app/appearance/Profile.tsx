import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const updateProfileSchema = z.object({
  profileTitle: z.string().min(1, "Title is required"),
  bio: z.string().min(15, "Bio must contain at least 15 characters"),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export function Profile() {
  const { data, isLoading } = api.appearance.getProfile.useQuery();
  const { register, formState, handleSubmit } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      profileTitle: data?.profileTitle || `@${data?.username}` || "",
      bio: data?.bio || "",
    },
  });
  const { mutateAsync, isLoading: isProcessing } =
    api.appearance.updateProfile.useMutation();
  const utils = api.useContext();
  const previewContext = usePreviewContext();

  const onSubmit = async (values: UpdateProfileSchema) => {
    try {
      await mutateAsync(values);
      await utils.appearance.getProfile.invalidate();
      previewContext?.reload();
    } catch (err) {}
  };

  return (
    <Chakra.VStack w="full" align="start" spacing="3">
      <Chakra.Heading size="md" fontWeight="medium">
        Profile
      </Chakra.Heading>
      <Chakra.Card w="full" size="lg" bg="white">
        <Chakra.CardBody>
          <Chakra.VStack
            as="form"
            spacing="3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Chakra.FormControl
              isDisabled={isLoading}
              isInvalid={!!formState.errors.profileTitle}
            >
              <Chakra.FormLabel>Title</Chakra.FormLabel>
              <Chakra.Input {...register("profileTitle")} />
              <Chakra.FormErrorMessage>
                {formState.errors.profileTitle?.message}
              </Chakra.FormErrorMessage>
            </Chakra.FormControl>
            <Chakra.FormControl
              isDisabled={isLoading}
              isInvalid={!!formState.errors.bio}
            >
              <Chakra.FormLabel>Bio</Chakra.FormLabel>
              <Chakra.Textarea {...register("bio")} />
              <Chakra.FormErrorMessage>
                {formState.errors.bio?.message}
              </Chakra.FormErrorMessage>
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
        </Chakra.CardBody>
      </Chakra.Card>
    </Chakra.VStack>
  );
}
