import { useProfileContext } from "@/providers/profile";
import { api } from "@/utils/api";
import { getContrastColor } from "@/utils/color";
import uploadFile from "@/utils/uploadFile";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
  useToken,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Rating from "../common/Rating";

export const testimonialSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  rating: z.number({ required_error: "Please provide rating" }).min(1).max(5),
  message: z.string(),
  avatar: z.string().optional(),
});

type TestimonialSchema = z.infer<typeof testimonialSchema>;

export default function SendTestimonial() {
  const profile = useProfileContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [avatarPublicId, setAvatarPublicId] = React.useState("");
  const [yellow] = useToken("colors", ["orange.400"]);
  const { register, setValue, watch, reset, handleSubmit, formState } = useForm<TestimonialSchema>({
    resolver: zodResolver(testimonialSchema),
  });
  const { mutateAsync, isLoading } = api.testimonial.add.useMutation();
  const { mutateAsync: deleteImage } = api.cloudinary.destroyImage.useMutation();
  const toast = useToast();

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (avatarPublicId) {
        await deleteImage(avatarPublicId);
        setAvatarPublicId("");
      }
      toast({ status: "info", description: "Uploading..." });
      const fileObj = e.target.files[0];
      const uploadData = await uploadFile(fileObj);
      setValue("avatar", uploadData.secure_url);
      setAvatarPublicId(uploadData.public_id);
      toast({ status: "success", description: "Uploaded successfully" });
    }
  };

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
    <Box zIndex="sticky" position="fixed" bottom={0} right={0} m={5}>
      <Tooltip label={`Send testimonial to ${profile.profileTitle}`} hasArrow placement="start">
        <IconButton
          onClick={onOpen}
          colorScheme="brand"
          aria-label="Add testimonial"
          icon={<Icon name="Testimonial" />}
          shadow="md"
        />
      </Tooltip>
      <Modal isOpen={isOpen} scrollBehavior="inside" size="xl" onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send testimonial to {profile.profileTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody color={getContrastColor(profile.theme.cardBackgroundColor)}>
            <VStack as="form" id="testimonial-form" onSubmit={handleSubmit(onSubmit)} spacing={10}>
              <FormControl justifyContent="center" display="grid">
                <Tooltip hasArrow label="Upload avatar">
                  <Box display="block" as="label">
                    <Avatar name={watch("name")} src={watch("avatar")} cursor="pointer" size="lg" />
                    <input onChange={handleAvatarUpload} type="file" hidden accept="image/*" />
                  </Box>
                </Tooltip>
              </FormControl>
              <FormControl isRequired isInvalid={!!formState.errors.name}>
                <FormLabel>Your name</FormLabel>
                <Input {...register("name")} />
                <FormErrorMessage>{formState.errors.name?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!formState.errors.email}>
                <FormLabel>Your email</FormLabel>
                <Input type="email" {...register("email")} />
                <FormErrorMessage>{formState.errors.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!formState.errors.rating?.message}>
                <FormLabel>Your rating</FormLabel>
                <Rating
                  changeRating={(newRating) => setValue("rating", newRating)}
                  numberOfStars={5}
                  rating={watch("rating")}
                  starRatedColor={yellow}
                  starDimension="30px"
                />
                <FormErrorMessage>{formState.errors.rating?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!formState.errors.message}>
                <FormLabel>Your testimonial</FormLabel>
                <Textarea {...register("message")} />
                <FormErrorMessage>{formState.errors.message?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired>
                <Checkbox colorScheme="brand">
                  I give permission to use this testimonial across social channels and other
                  marketing efforts
                </Checkbox>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              type="submit"
              form="testimonial-form"
              w="full"
              colorScheme="brand"
            >
              Send your testimonial
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
