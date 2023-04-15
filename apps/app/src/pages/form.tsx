import FormsIllus from "@/assets/forms.svg";
import { EmptyMessage, ErrorMessage } from "@/components/app/common/Message";
import Loader from "@/components/common/Loader";
import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { formatDate } from "@/utils/date";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Checkbox,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
  Select,
  Switch,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Form, FormSubmission } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import Linkify from "linkify-react";
import type { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Field = {
  name: "nameField" | "emailField" | "subjectField" | "phoneField" | "messageField";
  rawName: "name" | "email" | "subject" | "phone" | "message";
  label: string;
  rawLabel: string;
  labelName:
    | "nameFieldLabel"
    | "emailFieldLabel"
    | "subjectFieldLabel"
    | "phoneFieldLabel"
    | "messageFieldLabel";
  requiredName:
    | "nameFieldRequired"
    | "emailFieldRequired"
    | "subjectFieldRequired"
    | "phoneFieldRequired"
    | "messageFieldRequired";
};

const fields: Field[] = [
  {
    name: "nameField",
    rawName: "name",
    label: "Name field",
    rawLabel: "Name",
    labelName: "nameFieldLabel",
    requiredName: "nameFieldRequired",
  },
  {
    name: "emailField",
    rawName: "email",
    label: "Email field",
    rawLabel: "Email",
    labelName: "emailFieldLabel",
    requiredName: "emailFieldRequired",
  },
  {
    name: "subjectField",
    rawName: "subject",
    label: "Subject field",
    rawLabel: "Subject",
    labelName: "subjectFieldLabel",
    requiredName: "subjectFieldRequired",
  },
  {
    name: "phoneField",
    rawName: "phone",
    label: "Phone field",
    rawLabel: "Phone",
    labelName: "phoneFieldLabel",
    requiredName: "phoneFieldRequired",
  },
  {
    name: "messageField",
    rawName: "message",
    label: "Message field",
    rawLabel: "Message",
    labelName: "messageFieldLabel",
    requiredName: "messageFieldRequired",
  },
];

function DeleteSubmission(props: { submissionId: string }) {
  const { submissionId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync, isLoading } = api.form.deleteSubmission.useMutation();
  const utils = api.useContext();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = useToast();

  const handleDeleteSubmission = async () => {
    try {
      const message = await mutateAsync({ submissionId });
      await utils.form.findMany.invalidate();
      onClose();
      toast({ status: "success", description: message });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <Button onClick={onOpen} leftIcon={<Icon name="Delete" />} colorScheme="red">
        Delete
      </Button>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete submission?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure? This action will cause permanent data loss.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button isLoading={isLoading} onClick={handleDeleteSubmission} colorScheme="purple">
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}

function SubmissionDetails(props: {
  submission: FormSubmission;
  enabledFields: Field[];
  lastHoveredItemId: string;
  setLastHoveredItemId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { submission, enabledFields, lastHoveredItemId, setLastHoveredItemId } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();

  const KeyValuePairDisplay = (props: { keyName: string; value: string | null }) => {
    const { keyName, value } = props;
    return (
      <VStack>
        <Text whiteSpace="normal" w="full">
          <b>{keyName}</b>
        </Text>
        <Linkify
          options={{
            render({ attributes, content }) {
              return (
                <Link {...attributes} target="_blank" color="purple.500">
                  {content}
                </Link>
              );
            },
          }}
        >
          <Text whiteSpace="pre-wrap" w="full">
            {value || "Not Provided"}
          </Text>
        </Linkify>
      </VStack>
    );
  };

  return (
    <React.Fragment>
      <Tr
        onMouseOver={() => setLastHoveredItemId(submission.id)}
        bg={lastHoveredItemId === submission.id ? "purple.100" : "white"}
        cursor="pointer"
        key={submission.id}
        onClick={onOpen}
      >
        {enabledFields.map((field) => (
          <Td maxW={200} key={field.name}>
            <Text whiteSpace="normal" noOfLines={1} w="full">
              {submission[field.rawName]}
            </Text>
          </Td>
        ))}
        <Td noOfLines={1}>{formatDate(submission.sentAt)}</Td>
      </Tr>
      <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Submission details</DrawerHeader>
          <DrawerBody>
            <VStack w="full" align="start" spacing={10}>
              <VStack spacing={5} w="full" align="start">
                <KeyValuePairDisplay keyName="Name" value={submission.name} />
                <KeyValuePairDisplay keyName="Phone" value={submission.phone} />
                <KeyValuePairDisplay keyName="Email" value={submission.email} />
                <KeyValuePairDisplay keyName="Subject" value={submission.subject} />
                <KeyValuePairDisplay keyName="Message" value={submission.message} />
              </VStack>
              <DeleteSubmission submissionId={submission.id} />
            </VStack>
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
}

function FormSubmissionsTable(props: { form: Form; sortType: SortType }) {
  const { form, sortType } = props;
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.form.findMany.useInfiniteQuery(
      { limit: 20, orderBy: sortType },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  const [lastHoveredItemId, setLastHoveredItemId] = React.useState("");

  const enabledFields = React.useMemo(() => {
    return fields.filter((field) => !!form[field.name]);
  }, [form]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage description={error.message} />;

  const submissions = data.pages
    .map((page) => page.submissions.map((submission) => submission))
    .flat();

  if (!submissions.length)
    return <EmptyMessage title="Empty" description="No form submissions yet" />;

  return (
    <TableContainer w="full">
      <Table colorScheme="purple" bg="white" rounded="lg" size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            {enabledFields.map((field) => (
              <Th key={field.name}>{field.rawLabel}</Th>
            ))}
            <Th>Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {submissions.map((submission) => (
            <SubmissionDetails
              key={submission.id}
              lastHoveredItemId={lastHoveredItemId}
              setLastHoveredItemId={setLastHoveredItemId}
              submission={submission}
              enabledFields={enabledFields}
            />
          ))}
        </Tbody>
        {hasNextPage && (
          <TableCaption>
            <Button
              isLoading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              colorScheme="purple"
              size="sm"
            >
              Load more
            </Button>
          </TableCaption>
        )}
      </Table>
    </TableContainer>
  );
}

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
  nameFieldRequired: z.boolean().optional(),
  emailFieldRequired: z.boolean().optional(),
  subjectFieldRequired: z.boolean().optional(),
  phoneFieldRequired: z.boolean().optional(),
  messageFieldRequired: z.boolean().optional(),
  title: z.string().optional(),
  submitButtonText: z.string().optional(),
  submissionSuccessMessage: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

function FormSettingsModal(props: { form: Form }) {
  const { form } = props;
  const { register, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const { mutateAsync, isLoading } = api.form.updateForm.useMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();

  const handleSaveChanges = async (values: FormSchema) => {
    console.log({ values });
    try {
      const message = await mutateAsync(values);
      router.push(router.asPath);
      onClose();
      toast({ status: "success", description: message });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <IconButton
        onClick={onOpen}
        aria-label="Form Settings"
        icon={<Icon name="Settings" />}
        colorScheme="purple"
      />
      <Drawer placement="right" size="sm" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Fom settings</DrawerHeader>
          <DrawerBody>
            <VStack
              id="form-settings"
              as="form"
              onSubmit={handleSubmit(handleSaveChanges)}
              spacing={10}
            >
              {fields.map((field) => (
                <FormControl key={field.name}>
                  <FormLabel htmlFor={`label_${field.name}`}>
                    <HStack justify="space-between" align="center">
                      <Text>{field.label}</Text>
                      <Switch
                        defaultChecked={!!form[field.name]}
                        {...register(field.name)}
                        colorScheme="purple"
                      />
                    </HStack>
                  </FormLabel>
                  <Input
                    id={`label_${field.name}`}
                    defaultValue={form[field.labelName] || ""}
                    {...register(field.labelName)}
                  />
                  <FormHelperText>
                    <HStack justify="space-between">
                      <Text>Custom label (optional)</Text>
                      <Checkbox
                        defaultChecked={form[field.requiredName]}
                        {...register(field.requiredName)}
                        colorScheme="purple"
                      >
                        Required
                      </Checkbox>
                    </HStack>
                  </FormHelperText>
                </FormControl>
              ))}
              <Divider />
              <FormControl>
                <FormLabel>Form title</FormLabel>
                <Input {...register("title")} defaultValue={form.title || ""} />
              </FormControl>
              <FormControl>
                <FormLabel>Form submit button text</FormLabel>
                <Input
                  {...register("submitButtonText")}
                  defaultValue={form.submitButtonText || ""}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Success message</FormLabel>
                <Input
                  {...register("submissionSuccessMessage")}
                  defaultValue={form.submissionSuccessMessage || ""}
                />
                <FormHelperText>
                  This messages will be shown after a successful form submission
                </FormHelperText>
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={onClose} mr={3}>
              Close
            </Button>
            <Button
              type="submit"
              form="form-settings"
              isLoading={isLoading}
              leftIcon={<Icon name="Save" />}
              colorScheme="purple"
            >
              Save changes
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

function useEnableFormToggle() {
  const { mutateAsync, isLoading } = api.form.enableFormToggle.useMutation();
  const toast = useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync();
      await utils.form.findMany.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return { toggle: handleClick, isLoading };
}

function ToggleSubmissionAcceptance(props: { isAccepting: boolean }) {
  const { isAccepting } = props;
  const { mutateAsync, isLoading } = api.form.toggleSubmissionAcceptance.useMutation();
  const toast = useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      const message = await mutateAsync();
      await utils.form.findMany.invalidate();
      toast({ status: "info", description: message });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Button
      colorScheme={isAccepting ? "red" : "purple"}
      isLoading={isLoading}
      onClick={handleClick}
    >
      {isAccepting ? "Pause submissions" : "Resume submissions"}
    </Button>
  );
}

function GetStarted() {
  const { isLoading, toggle } = useEnableFormToggle();
  return (
    <Center w="full" h="calc(100vh - 120px)">
      <Card size={{ base: "md", md: "lg" }} w="full" maxW="md" bg="white">
        <CardBody>
          <VStack spacing={10}>
            <Box w="full" maxW={250}>
              <Image src={FormsIllus} alt="Linkify forms" style={{ width: "100%" }} />
            </Box>
            <VStack spacing={3} textAlign="center">
              <Heading size="lg" color="purple.500">
                Form
              </Heading>
              <Text>Collect form submissions from your visitors and manage them in one place.</Text>
            </VStack>
            <Button isLoading={isLoading} onClick={toggle} colorScheme="purple" w="full">
              Get started
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Center>
  );
}

type FormPageProps = {
  form?: Form | null;
  submissions: FormSubmission[];
};

type SortType = "desc" | "asc";

const FormPage: NextPageWithLayout<FormPageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { form } = props;
  const [sortType, setSortType] = React.useState<SortType>("desc");

  if (!form) return <GetStarted />;

  return (
    <Container maxW="container.xl">
      <VStack align="start" spacing={10}>
        <HStack w="full" justify="space-between" align="center">
          <HStack>
            <Select
              variant="filled"
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </HStack>
          <HStack align="center" spacing={3}>
            <ToggleSubmissionAcceptance isAccepting={form.isAcceptingSubmissions} />
            <FormSettingsModal form={form} />
          </HStack>
        </HStack>
        <FormSubmissionsTable sortType={sortType} form={form} />
      </VStack>
    </Container>
  );
};

FormPage.getLayout = (page) => <AppLayout hidePreviewPanel>{page}</AppLayout>;

export default FormPage;

export const getServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: {
      username: true,
      bio: true,
      form: true,
    },
  });

  if (!user?.username || !user?.bio) {
    return { redirect: { destination: "/auth/onboarding", permanent: false } };
  }

  return { props: { form: user.form } };
});
