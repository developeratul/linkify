import FormsIllus from "@/assets/forms.svg";
import { EmptyMessage, ErrorMessage } from "@/components/app/common/Message";
import Loader from "@/components/common/Loader";
import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { formatDate } from "@/utils/date";
import * as Chakra from "@chakra-ui/react";
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
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const { mutateAsync, isLoading } = api.form.deleteSubmission.useMutation();
  const utils = api.useContext();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = Chakra.useToast();

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
    <Chakra.Box>
      <Chakra.Button onClick={onOpen} leftIcon={<Icon name="Delete" />} colorScheme="red">
        Delete
      </Chakra.Button>
      <Chakra.AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <Chakra.AlertDialogOverlay />
        <Chakra.AlertDialogContent>
          <Chakra.AlertDialogHeader>Delete submission?</Chakra.AlertDialogHeader>
          <Chakra.AlertDialogCloseButton />
          <Chakra.AlertDialogBody>
            Are you sure? This action will cause permanent data loss.
          </Chakra.AlertDialogBody>
          <Chakra.AlertDialogFooter>
            <Chakra.Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Chakra.Button>
            <Chakra.Button
              isLoading={isLoading}
              onClick={handleDeleteSubmission}
              colorScheme="purple"
            >
              Yes
            </Chakra.Button>
          </Chakra.AlertDialogFooter>
        </Chakra.AlertDialogContent>
      </Chakra.AlertDialog>
    </Chakra.Box>
  );
}

function SubmissionDetails(props: {
  submission: FormSubmission;
  enabledFields: Field[];
  lastHoveredItemId: string;
  setLastHoveredItemId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { submission, enabledFields, lastHoveredItemId, setLastHoveredItemId } = props;
  const { isOpen, onClose, onOpen } = Chakra.useDisclosure();

  const KeyValuePairDisplay = (props: { keyName: string; value: string | null }) => {
    const { keyName, value } = props;
    return (
      <Chakra.VStack>
        <Chakra.Text whiteSpace="normal" w="full">
          <b>{keyName}</b>
        </Chakra.Text>
        <Linkify
          options={{
            render({ attributes, content }) {
              return (
                <Chakra.Link {...attributes} target="_blank" color="purple.500">
                  {content}
                </Chakra.Link>
              );
            },
          }}
        >
          <Chakra.Text whiteSpace="pre-wrap" w="full">
            {value || "Not Provided"}
          </Chakra.Text>
        </Linkify>
      </Chakra.VStack>
    );
  };

  return (
    <React.Fragment>
      <Chakra.Tr
        onMouseOver={() => setLastHoveredItemId(submission.id)}
        bg={lastHoveredItemId === submission.id ? "purple.100" : "white"}
        cursor="pointer"
        key={submission.id}
        onClick={onOpen}
      >
        {enabledFields.map((field) => (
          <Chakra.Td maxW={200} key={field.name}>
            <Chakra.Text whiteSpace="normal" noOfLines={1} w="full">
              {submission[field.rawName]}
            </Chakra.Text>
          </Chakra.Td>
        ))}
        <Chakra.Td noOfLines={1}>{formatDate(submission.sentAt)}</Chakra.Td>
      </Chakra.Tr>
      <Chakra.Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
        <Chakra.DrawerOverlay />
        <Chakra.DrawerContent>
          <Chakra.DrawerCloseButton />
          <Chakra.DrawerHeader>Submission details</Chakra.DrawerHeader>
          <Chakra.DrawerBody>
            <Chakra.VStack w="full" align="start" spacing={10}>
              <Chakra.VStack spacing={5} w="full" align="start">
                <KeyValuePairDisplay keyName="Name" value={submission.name} />
                <KeyValuePairDisplay keyName="Phone" value={submission.phone} />
                <KeyValuePairDisplay keyName="Email" value={submission.email} />
                <KeyValuePairDisplay keyName="Subject" value={submission.subject} />
                <KeyValuePairDisplay keyName="Message" value={submission.message} />
              </Chakra.VStack>
              <DeleteSubmission submissionId={submission.id} />
            </Chakra.VStack>
          </Chakra.DrawerBody>
          <Chakra.DrawerFooter />
        </Chakra.DrawerContent>
      </Chakra.Drawer>
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
    <Chakra.TableContainer w="full">
      <Chakra.Table colorScheme="purple" bg="white" rounded="lg" size={{ base: "sm", md: "md" }}>
        <Chakra.Thead>
          <Chakra.Tr>
            {enabledFields.map((field) => (
              <Chakra.Th key={field.name}>{field.rawLabel}</Chakra.Th>
            ))}
            <Chakra.Th>Time</Chakra.Th>
          </Chakra.Tr>
        </Chakra.Thead>
        <Chakra.Tbody>
          {submissions.map((submission) => (
            <SubmissionDetails
              key={submission.id}
              lastHoveredItemId={lastHoveredItemId}
              setLastHoveredItemId={setLastHoveredItemId}
              submission={submission}
              enabledFields={enabledFields}
            />
          ))}
        </Chakra.Tbody>
        {hasNextPage && (
          <Chakra.TableCaption>
            <Chakra.Button
              isLoading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              colorScheme="purple"
              size="sm"
            >
              Load more
            </Chakra.Button>
          </Chakra.TableCaption>
        )}
      </Chakra.Table>
    </Chakra.TableContainer>
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
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const toast = Chakra.useToast();
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
                  <Chakra.FormLabel htmlFor={`label_${field.name}`}>
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
                    id={`label_${field.name}`}
                    defaultValue={form[field.labelName] || ""}
                    {...register(field.labelName)}
                  />
                  <Chakra.FormHelperText>
                    <Chakra.HStack justify="space-between">
                      <Chakra.Text>Custom label (optional)</Chakra.Text>
                      <Chakra.Checkbox
                        defaultChecked={form[field.requiredName]}
                        {...register(field.requiredName)}
                        colorScheme="purple"
                      >
                        Required
                      </Chakra.Checkbox>
                    </Chakra.HStack>
                  </Chakra.FormHelperText>
                </Chakra.FormControl>
              ))}
              <Chakra.Divider />
              <Chakra.FormControl>
                <Chakra.FormLabel>Form title</Chakra.FormLabel>
                <Chakra.Input {...register("title")} defaultValue={form.title || ""} />
              </Chakra.FormControl>
              <Chakra.FormControl>
                <Chakra.FormLabel>Form submit button text</Chakra.FormLabel>
                <Chakra.Input
                  {...register("submitButtonText")}
                  defaultValue={form.submitButtonText || ""}
                />
              </Chakra.FormControl>
              <Chakra.FormControl>
                <Chakra.FormLabel>Success message</Chakra.FormLabel>
                <Chakra.Input
                  {...register("submissionSuccessMessage")}
                  defaultValue={form.submissionSuccessMessage || ""}
                />
                <Chakra.FormHelperText>
                  This messages will be shown after a successful form submission
                </Chakra.FormHelperText>
              </Chakra.FormControl>
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
  const toast = Chakra.useToast();
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
    <Chakra.Button
      colorScheme={isAccepting ? "red" : "purple"}
      isLoading={isLoading}
      onClick={handleClick}
    >
      {isAccepting ? "Pause submissions" : "Resume submissions"}
    </Chakra.Button>
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
                Form
              </Chakra.Heading>
              <Chakra.Text>
                Collect form submissions from your visitors and manage them in one place.
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

type SortType = "desc" | "asc";

const FormPage: NextPageWithLayout<FormPageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { form } = props;
  const [sortType, setSortType] = React.useState<SortType>("desc");

  if (!form) return <GetStarted />;

  return (
    <Chakra.Container maxW="container.xl">
      <Chakra.VStack align="start" spacing={10}>
        <Chakra.HStack w="full" justify="space-between" align="center">
          <Chakra.HStack>
            <Chakra.Select
              variant="filled"
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Chakra.Select>
          </Chakra.HStack>
          <Chakra.HStack align="center" spacing={3}>
            <ToggleSubmissionAcceptance isAccepting={form.isAcceptingSubmissions} />
            <FormSettingsModal form={form} />
          </Chakra.HStack>
        </Chakra.HStack>
        <FormSubmissionsTable sortType={sortType} form={form} />
      </Chakra.VStack>
    </Chakra.Container>
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
