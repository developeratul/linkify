import { Icon } from "@/Icons";
import { useProfileContext } from "@/providers/profile";
import { api } from "@/utils/api";
import { getContrastColor, lightenColor } from "@/utils/color";
import * as Chakra from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Rating from "../app/common/Rating";

export const testimonialSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  rating: z.number({ required_error: "Please provide rating" }).min(1).max(5),
  message: z.string(),
  avatar: z.string().optional(),
});

type TestimonialSchema = z.infer<typeof testimonialSchema>;

export default function AddTestimonialModal() {
  const profile = useProfileContext();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const [yellow] = Chakra.useToken("colors", ["orange.400"]);
  const { register, setValue, watch, reset, handleSubmit, formState } = useForm<TestimonialSchema>({
    resolver: zodResolver(testimonialSchema),
  });
  const { mutateAsync, isLoading } = api.testimonial.add.useMutation();
  const toast = Chakra.useToast();

  const closeModal = () => {
    onClose();
    reset();
  };

  React.useEffect(() => {
    if (window.location.hash === "#add-testimonial") {
      onOpen();
    }
  }, [onOpen]);

  if (profile === undefined) return <></>;

  const buttonBackground = lightenColor(
    profile.button.buttonBackground || profile.theme.themeColor
  );

  const onSubmit = async (values: TestimonialSchema) => {
    try {
      const data = await mutateAsync({ ...values, userId: profile.id });
      closeModal();
      toast({ status: "success", description: data.message });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box zIndex="sticky" position="fixed" bottom={0} right={0} m={5}>
      <Chakra.Tooltip
        label={`Add testimonial for ${profile.profileTitle}`}
        hasArrow
        placement="start"
      >
        <Chakra.IconButton
          onClick={onOpen}
          aria-label="Add testimonial"
          icon={<Icon name="Testimonial" />}
          background={buttonBackground}
          color={getContrastColor(buttonBackground)}
          _hover={{}}
          _active={{}}
          shadow="md"
        />
      </Chakra.Tooltip>
      <Chakra.Modal isOpen={isOpen} scrollBehavior="inside" size="xl" onClose={closeModal}>
        <Chakra.ModalOverlay />
        <Chakra.ModalContent>
          <Chakra.ModalHeader>Add testimonial for {profile.profileTitle}</Chakra.ModalHeader>
          <Chakra.ModalCloseButton />
          <Chakra.ModalBody>
            <Chakra.VStack
              as="form"
              id="testimonial-form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={10}
            >
              <Chakra.FormControl isRequired isInvalid={!!formState.errors.name}>
                <Chakra.FormLabel>Your name</Chakra.FormLabel>
                <Chakra.Input {...register("name")} />
                <Chakra.FormErrorMessage>{formState.errors.name?.message}</Chakra.FormErrorMessage>
              </Chakra.FormControl>
              <Chakra.FormControl isRequired isInvalid={!!formState.errors.email}>
                <Chakra.FormLabel>Your email</Chakra.FormLabel>
                <Chakra.Input type="email" {...register("email")} />
                <Chakra.FormErrorMessage>{formState.errors.email?.message}</Chakra.FormErrorMessage>
              </Chakra.FormControl>
              <Chakra.FormControl isRequired isInvalid={!!formState.errors.rating?.message}>
                <Chakra.FormLabel>Your rating</Chakra.FormLabel>
                <Rating
                  changeRating={(newRating) => setValue("rating", newRating)}
                  numberOfStars={5}
                  rating={watch("rating")}
                  starRatedColor={yellow}
                  starDimension="30px"
                />
                <Chakra.FormErrorMessage>
                  {formState.errors.rating?.message}
                </Chakra.FormErrorMessage>
              </Chakra.FormControl>
              <Chakra.FormControl isRequired isInvalid={!!formState.errors.message}>
                <Chakra.FormLabel>Your testimonial</Chakra.FormLabel>
                <Chakra.Textarea {...register("message")} />
                <Chakra.FormErrorMessage>
                  {formState.errors.message?.message}
                </Chakra.FormErrorMessage>
              </Chakra.FormControl>
              <Chakra.FormControl isRequired>
                <Chakra.Checkbox colorScheme="purple">
                  I give permission to use this testimonial across social channels and other
                  marketing efforts
                </Chakra.Checkbox>
              </Chakra.FormControl>
            </Chakra.VStack>
          </Chakra.ModalBody>
          <Chakra.ModalFooter>
            <Chakra.Button
              isLoading={isLoading}
              type="submit"
              form="testimonial-form"
              w="full"
              colorScheme="purple"
            >
              Send your testimonial
            </Chakra.Button>
          </Chakra.ModalFooter>
        </Chakra.ModalContent>
      </Chakra.Modal>
    </Chakra.Box>
  );
}
