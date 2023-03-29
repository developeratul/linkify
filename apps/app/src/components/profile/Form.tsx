import { Icon } from "@/Icons";
import { useProfileContext } from "@/providers/profile";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
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
    <Chakra.Box>
      <Chakra.Button onClick={onOpen} variant="link" colorScheme="brand">
        {form.title || "Contact"}
      </Chakra.Button>
      <Modal scrollBehavior="inside" size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{form.title || "Contact"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Chakra.VStack
              onSubmit={handleSubmit(handleFormSubmission)}
              as="form"
              id="profile-form"
              spacing={5}
            >
              {form.nameField && (
                <Chakra.FormControl isRequired={form.nameFieldRequired}>
                  <Chakra.FormLabel>{form.nameFieldLabel || "Name"}</Chakra.FormLabel>
                  <Chakra.Input {...register("name")} />
                </Chakra.FormControl>
              )}
              {form.phoneField && (
                <Chakra.FormControl isRequired={form.phoneFieldRequired}>
                  <Chakra.FormLabel>{form.phoneFieldLabel || "Phone number"}</Chakra.FormLabel>
                  <Chakra.Input {...register("phone")} />
                </Chakra.FormControl>
              )}
              {form.emailField && (
                <Chakra.FormControl isRequired={form.emailFieldRequired}>
                  <Chakra.FormLabel>{form.emailFieldLabel || "Email"}</Chakra.FormLabel>
                  <Chakra.Input type="email" {...register("email")} />
                </Chakra.FormControl>
              )}
              {form.subjectField && (
                <Chakra.FormControl isRequired={form.subjectFieldRequired}>
                  <Chakra.FormLabel>{form.subjectFieldLabel || "Subject"}</Chakra.FormLabel>
                  <Chakra.Input {...register("subject")} />
                </Chakra.FormControl>
              )}
              {form.messageField && (
                <Chakra.FormControl isRequired={form.messageFieldRequired}>
                  <Chakra.FormLabel>{form.messageFieldLabel || "Message"}</Chakra.FormLabel>
                  <Chakra.Textarea {...register("message")} />
                </Chakra.FormControl>
              )}
            </Chakra.VStack>
          </ModalBody>
          <ModalFooter>
            <Chakra.Button
              isLoading={isLoading}
              type="submit"
              form="profile-form"
              leftIcon={<Icon name="Form" />}
              colorScheme="brand"
              w="full"
            >
              {form.submitButtonText || "Submit"}
            </Chakra.Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Chakra.Box>
  );
}
