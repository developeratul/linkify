import FormsIllus from "@/assets/forms.svg";
import { Icon } from "@/Icons";
import { AppLayout } from "@/Layouts/app";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Form, FormSubmission } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import type { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { NextPageWithLayout } from "../_app";

function FormSubmissionsTable() {
  return (
    <Chakra.Box w="full" overflowX="auto">
      <Chakra.Table colorScheme="purple" bg="white" rounded="lg" variant="striped">
        <Chakra.Thead>
          <Chakra.Tr>
            <Chakra.Th>Name</Chakra.Th>
            <Chakra.Th>Email</Chakra.Th>
            <Chakra.Th>Phone</Chakra.Th>
            <Chakra.Th>Message</Chakra.Th>
          </Chakra.Tr>
        </Chakra.Thead>
        <Chakra.Tbody>
          <Chakra.Tr>
            <Chakra.Td>
              <Chakra.Text noOfLines={1}>Ratul</Chakra.Text>
            </Chakra.Td>
            <Chakra.Td>
              <Chakra.Text noOfLines={1}>azammmgol@gmail.com</Chakra.Text>
            </Chakra.Td>
            <Chakra.Td>
              <Chakra.Text noOfLines={1}>0187278675</Chakra.Text>
            </Chakra.Td>
            <Chakra.Td>
              <Chakra.Text noOfLines={1}>
                Hello world I am a good person from Bangladesh and I will be your guide.
              </Chakra.Text>
            </Chakra.Td>
          </Chakra.Tr>
        </Chakra.Tbody>
      </Chakra.Table>
    </Chakra.Box>
  );
}

type Field = {
  name: "nameField" | "emailField" | "subjectField" | "phoneField" | "messageField";
  label: string;
  labelName:
    | "nameFieldLabel"
    | "emailFieldLabel"
    | "subjectFieldLabel"
    | "phoneFieldLabel"
    | "messageFieldLabel";
};

const fields: Field[] = [
  { name: "nameField", label: "Name field", labelName: "nameFieldLabel" },
  { name: "emailField", label: "Email field", labelName: "emailFieldLabel" },
  { name: "subjectField", label: "Subject field", labelName: "subjectFieldLabel" },
  { name: "phoneField", label: "Phone field", labelName: "phoneFieldLabel" },
  { name: "messageField", label: "Message field", labelName: "messageFieldLabel" },
];

export const formSchema = z.object({
  nameField: z.boolean().optional(),
  emailField: z.boolean().optional(),
  subjectField: z.boolean().optional(),
  phoneField: z.boolean().optional(),
  messageField: z.boolean().optional(),
  nameFieldLabel: z.string().optional(),
  emailFieldLabel: z.string().optional(),
  subjectFieldLabel: z.string().optional(),
  phoneFieldLabel: z.string().optional(),
  messageFieldLabel: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

function FormSettingsModal(props: { form: Form }) {
  const { form } = props;
  const { register, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const { mutateAsync, isLoading } = api.form.updateForm.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const toast = Chakra.useToast();
  const router = useRouter();

  const handleSaveChanges = async (values: FormSchema) => {
    try {
      const message = await mutateAsync(values);
      onClose();
      await router.push(router.asPath);
      toast({ status: "success", description: message });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box>
      <Chakra.IconButton
        onClick={onOpen}
        aria-label="Form Settings"
        icon={<Icon name="Settings" />}
        colorScheme="purple"
      />
      <Chakra.Drawer placement="right" size="sm" isOpen={isOpen} onClose={onClose}>
        <Chakra.DrawerOverlay />
        <Chakra.DrawerContent>
          <Chakra.DrawerCloseButton />
          <Chakra.DrawerHeader>Fom settings</Chakra.DrawerHeader>
          <Chakra.DrawerBody>
            <Chakra.VStack
              id="form-settings"
              as="form"
              onSubmit={handleSubmit(handleSaveChanges)}
              spacing={10}
            >
              {fields.map((field) => (
                <Chakra.FormControl key={field.name}>
                  <Chakra.FormLabel>
                    <Chakra.HStack justify="space-between" align="center">
                      <Chakra.Text>{field.label}</Chakra.Text>
                      <Chakra.Switch
                        defaultChecked={!!form[field.name]}
                        {...register(field.name)}
                        colorScheme="purple"
                      />
                    </Chakra.HStack>
                  </Chakra.FormLabel>
                  <Chakra.Input
                    defaultValue={form[field.labelName] || ""}
                    {...register(field.labelName)}
                  />
                  <Chakra.FormHelperText>
                    Enter label for this field (optional)
                  </Chakra.FormHelperText>
                </Chakra.FormControl>
              ))}
            </Chakra.VStack>
          </Chakra.DrawerBody>
          <Chakra.DrawerFooter>
            <Chakra.Button onClick={onClose} mr={3}>
              Close
            </Chakra.Button>
            <Chakra.Button
              type="submit"
              form="form-settings"
              isLoading={isLoading}
              leftIcon={<Icon name="Save" />}
              colorScheme="purple"
            >
              Save changes
            </Chakra.Button>
          </Chakra.DrawerFooter>
        </Chakra.DrawerContent>
      </Chakra.Drawer>
    </Chakra.Box>
  );
}

function useEnableFormToggle() {
  const { mutateAsync, isLoading } = api.form.enableFormToggle.useMutation();
  const toast = Chakra.useToast();
  const router = useRouter();

  const handleClick = async () => {
    try {
      await mutateAsync();
      await router.push(router.asPath);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return { toggle: handleClick, isLoading };
}

function EnableFormToggle(props: { isEnabled: boolean }) {
  const { isEnabled } = props;
  const { toggle, isLoading } = useEnableFormToggle();

  return (
    <Chakra.Switch
      defaultChecked={isEnabled}
      onChange={toggle}
      disabled={isLoading}
      colorScheme="purple"
    />
  );
}

function GetStarted() {
  const { isLoading, toggle } = useEnableFormToggle();
  return (
    <Chakra.Center w="full" h="calc(100vh - 120px)">
      <Chakra.Card size={{ base: "md", md: "lg" }} w="full" maxW="md" bg="white">
        <Chakra.CardBody>
          <Chakra.VStack spacing={10}>
            <Chakra.Box w="full" maxW={250}>
              <Image src={FormsIllus} alt="Linkify forms" style={{ width: "100%" }} />
            </Chakra.Box>
            <Chakra.VStack spacing={3} textAlign="center">
              <Chakra.Heading size="lg" color="purple.500">
                Contact form
              </Chakra.Heading>
              <Chakra.Text>
                Collect form submissions from your visitors and manage them from your dashboard.
              </Chakra.Text>
            </Chakra.VStack>
            <Chakra.Button isLoading={isLoading} onClick={toggle} colorScheme="purple" w="full">
              Get started
            </Chakra.Button>
          </Chakra.VStack>
        </Chakra.CardBody>
      </Chakra.Card>
    </Chakra.Center>
  );
}

type FormPageProps = {
  form?: Form | null;
  submissions: FormSubmission[];
};

const FormPage: NextPageWithLayout<FormPageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { form, submissions } = props;

  if (!form) return <GetStarted />;

  return (
    <Chakra.Container maxW="container.xl">
      <Chakra.VStack align="start" spacing={10}>
        <Chakra.HStack w="full" justify="space-between" align="center">
          <Chakra.Heading size="md" color="purple.500">
            Form
          </Chakra.Heading>
          <Chakra.HStack align="center" gap={5}>
            <EnableFormToggle isEnabled={!!form} />
            <FormSettingsModal form={form} />
          </Chakra.HStack>
        </Chakra.HStack>
        <FormSubmissionsTable />
      </Chakra.VStack>
    </Chakra.Container>
  );
};

export default FormPage;

FormPage.getLayout = (page) => {
  return <AppLayout hidePreviewPanel>{page}</AppLayout>;
};

export const getServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: {
      username: true,
      bio: true,
      form: true,
      formSubmissions: true,
    },
  });

  if (!user?.username || !user?.bio) {
    return {
      redirect: { destination: "/auth/onboarding", permanent: false },
    };
  }

  return {
    props: { form: user.form, submissions: user.formSubmissions },
  };
});
