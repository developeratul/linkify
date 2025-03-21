import { AuthLayout } from "@/Layouts/auth";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { api } from "@/utils/api";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { NextPageWithLayout } from "../_app";

export const onboardingSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/g, "Invalid username"),
  bio: z.string().min(15, "Bio must contain at least 15 characters"),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

const OnBoardingPage: NextPageWithLayout<Record<string, never>> = () => {
  const { register, formState, handleSubmit, setError } = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
  });
  const { mutateAsync, isLoading } = api.auth.setupAccount.useMutation();
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (values: OnboardingSchema) => {
    try {
      const { title, description } = await mutateAsync(values);
      await router.push("/");
      toast({ status: "success", description, title });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        setError("username", {
          message: err.message,
        });
      }
    }
  };

  return (
    <AuthLayout title="Setup your account">
      <VStack onSubmit={handleSubmit(onSubmit)} as="form" id="onboarding-form" spacing={3}>
        <FormControl isRequired isInvalid={!!formState.errors?.username}>
          <FormLabel>Username</FormLabel>
          <Input {...register("username")} />
          <FormErrorMessage>{formState.errors.username?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!formState.errors?.bio}>
          <FormLabel>Bio</FormLabel>
          <Textarea {...register("bio")} />
          <FormErrorMessage>{formState.errors.bio?.message}</FormErrorMessage>
        </FormControl>
        <Button isLoading={isLoading} type="submit" w="full" colorScheme="purple">
          Finish
        </Button>
      </VStack>
    </AuthLayout>
  );
};

export default OnBoardingPage;
export const getServerSideProps: GetServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    const user = await prisma?.user.findUnique({
      where: { id: session.user?.id },
      select: { username: true },
    });

    if (user?.username) {
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    }
  }

  return {
    props: {},
  };
});
