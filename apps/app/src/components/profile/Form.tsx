import { useProfileContext } from "@/providers/profile";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSubmissionSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  subject: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

type FormSubmissionSchema = z.infer<typeof formSubmissionSchema>;

export default function Form() {
  const profile = useProfileContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm<FormSubmissionSchema>({
    resolver: zodResolver(formSubmissionSchema),
  });
  const { isLoading, mutateAsync } = api.form.submit.useMutation();
  const toast = useToast();

  if (profile === undefined || !profile.form) return <></>;
  if (!profile.form || !profile.form.isAcceptingSubmissions) return <></>;

  const { form } = profile;

  const handleFormSubmission = async (values: FormSubmissionSchema) => {
    try {
      const message = await mutateAsync({ ...values, userId: profile.id });
      onClose();
      reset();
      toast({ status: "success", description: message, title: "Submission successful" });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <Button onClick={onOpen} variant="link" colorScheme="brand">
        {form.title || "Contact"}
      </Button>
      <Modal scrollBehavior="inside" size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{form.title || "Contact"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              onSubmit={handleSubmit(handleFormSubmission)}
              as="form"
              id="profile-form"
              spacing={5}
            >
              {form.nameField && (
                <FormControl isRequired={form.nameFieldRequired}>
                  <FormLabel>{form.nameFieldLabel || "Name"}</FormLabel>
                  <Input {...register("name")} />
                </FormControl>
              )}
              {form.phoneField && (
                <FormControl isRequired={form.phoneFieldRequired}>
                  <FormLabel>{form.phoneFieldLabel || "Phone number"}</FormLabel>
                  <Input {...register("phone")} />
                </FormControl>
              )}
              {form.emailField && (
                <FormControl isRequired={form.emailFieldRequired}>
                  <FormLabel>{form.emailFieldLabel || "Email"}</FormLabel>
                  <Input type="email" {...register("email")} />
                </FormControl>
              )}
              {form.subjectField && (
                <FormControl isRequired={form.subjectFieldRequired}>
                  <FormLabel>{form.subjectFieldLabel || "Subject"}</FormLabel>
                  <Input {...register("subject")} />
                </FormControl>
              )}
              {form.messageField && (
                <FormControl isRequired={form.messageFieldRequired}>
                  <FormLabel>{form.messageFieldLabel || "Message"}</FormLabel>
                  <Textarea {...register("message")} />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              type="submit"
              form="profile-form"
              leftIcon={<Icon name="Form" />}
              colorScheme="brand"
              w="full"
            >
              {form.submitButtonText || "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
