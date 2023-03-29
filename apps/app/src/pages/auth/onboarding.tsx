import { AuthLayout } from "@/Layouts/auth";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const onboardingSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]+$/g, "Invalid username"),
  bio: z.string().min(15, "Bio must contain at least 15 characters"),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

const OnBoardingPage: NextPage = () => {
  const { register, formState, handleSubmit, setError } =
    useForm<OnboardingSchema>({
      resolver: zodResolver(onboardingSchema),
    });
  const { mutateAsync, isLoading } = api.auth.setupAccount.useMutation();
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (values: OnboardingSchema) => {
    try {
      const { title, description } = await mutateAsync(values);
      router.push("/app");
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
        <Chakra.Button
          isLoading={isLoading}
          type="submit"
          w="full"
          colorScheme="purple"
        >
          Finish
        </Chakra.Button>
      </Chakra.VStack>
    </AuthLayout>
  );
};

export default OnBoardingPage;
export const getServerSideProps: GetServerSideProps = requireAuth(
  async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (session) {
      const user = await prisma?.user.findUnique({
        where: { id: session.user?.id },
        select: { username: true },
      });

      if (user?.username) {
        return {
          redirect: {
            destination: "/app",
            permanent: true,
          },
        };
      }
    }

    return {
      props: {},
    };
  }
);
