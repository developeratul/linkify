import { AuthLayout } from "@/Layouts/auth";
import * as Chakra from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const onboardingSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/g, "Invalid username"),
  bio: z.string().min(15, "Bio must contain at least 15 characters"),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

const OnBoardingPage: NextPage = () => {
  const { register, formState, handleSubmit } = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values: OnboardingSchema) => {
    console.log({ values });
  };

  return (
    <AuthLayout title="Setup your account">
      <Chakra.VStack
        onSubmit={handleSubmit(onSubmit)}
        as="form"
        id="onboarding-form"
        spacing={3}
      >
        <Chakra.FormControl isRequired isInvalid={!!formState.errors?.username}>
          <Chakra.FormLabel>Username</Chakra.FormLabel>
          <Chakra.Input {...register("username")} />
          <Chakra.FormErrorMessage>
            {formState.errors.username?.message}
          </Chakra.FormErrorMessage>
        </Chakra.FormControl>
        <Chakra.FormControl isRequired isInvalid={!!formState.errors?.bio}>
          <Chakra.FormLabel>Bio</Chakra.FormLabel>
          <Chakra.Textarea {...register("bio")} />
          <Chakra.FormErrorMessage>
            {formState.errors.bio?.message}
          </Chakra.FormErrorMessage>
        </Chakra.FormControl>
        <Chakra.Button type="submit" w="full" colorScheme="purple">
          Finish
        </Chakra.Button>
      </Chakra.VStack>
    </AuthLayout>
  );
};

export default OnBoardingPage;
