import { SectionLoader } from "@/components/common/Loader";
import { EmptyMessage, ErrorMessage } from "@/components/common/Message";
import { Icons } from "@/Icons";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Link } from "./Link";
import Links, { CreateLinkModal } from "./Link";

export type Group = {
  id: string;
  name?: string | null;
  links: Link[];
};

export function DeleteGroup(props: { groupId: string }) {
  const { groupId } = props;
  const { mutateAsync, isLoading } = api.app.deleteGroup.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = Chakra.useToast();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(groupId);
      onClose();
      await utils.app.getGroupsWithLinks.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", title: "Error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box>
      <Chakra.Tooltip hasArrow label="Delete group">
        <Chakra.IconButton
          isLoading={isLoading}
          onClick={onOpen}
          colorScheme="red"
          icon={Icons.Delete}
          aria-label="Delete group"
        />
      </Chakra.Tooltip>
      <Chakra.AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <Chakra.AlertDialogOverlay />
        <Chakra.AlertDialogContent>
          <Chakra.AlertDialogHeader>Delete Group?</Chakra.AlertDialogHeader>
          <Chakra.AlertDialogCloseButton />
          <Chakra.AlertDialogBody>
            Are you sure? This action will cause permanent data loss. All the
            links inside this group will also get deleted.
          </Chakra.AlertDialogBody>
          <Chakra.AlertDialogFooter>
            <Chakra.Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Chakra.Button>
            <Chakra.Button
              isLoading={isLoading}
              onClick={handleClick}
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

export const editGroupSchema = z.object({
  name: z.string().nullable(),
});

export type EditGroupSchema = z.infer<typeof editGroupSchema>;

export function EditGroup(props: { group: Group }) {
  const { group } = props;
  const { register, formState, handleSubmit } = useForm<EditGroupSchema>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: group,
  });
  const { mutateAsync, isLoading } = api.app.editGroup.useMutation();
  const { isOpen, onOpen, onClose } = Chakra.useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const utils = api.useContext();

  const onSubmit = async (values: EditGroupSchema) => {
    try {
      await mutateAsync({ ...values, groupId: group.id });
      await utils.app.getGroupsWithLinks.invalidate();
      onClose();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Chakra.Box>
      <Chakra.IconButton
        isLoading={isLoading}
        ref={btnRef}
        onClick={onOpen}
        colorScheme="blue"
        aria-label="Edit Group"
        icon={Icons.Edit}
      />
      <Chakra.Drawer
        size="md"
        placement="right"
        finalFocusRef={btnRef}
        onClose={onClose}
        isOpen={isOpen}
      >
        <Chakra.DrawerOverlay />
        <Chakra.DrawerContent>
          <Chakra.DrawerHeader>
            Edit &quot;{group.name ?? "Untitled"}&quot; group
          </Chakra.DrawerHeader>
          <Chakra.DrawerCloseButton />
          <Chakra.DrawerBody>
            <Chakra.VStack
              as="form"
              id="edit-group-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Chakra.FormControl isInvalid={!!formState.errors.name}>
                <Chakra.FormLabel>Name</Chakra.FormLabel>
                <Chakra.Input {...register("name")} />
                <Chakra.FormErrorMessage>
                  {formState.errors.name?.message}
                </Chakra.FormErrorMessage>
              </Chakra.FormControl>
            </Chakra.VStack>
          </Chakra.DrawerBody>
          <Chakra.DrawerFooter>
            <Chakra.Button mr={3} onClick={onClose}>
              Cancel
            </Chakra.Button>
            <Chakra.Button
              type="submit"
              form="edit-group-form"
              colorScheme="purple"
              isLoading={isLoading}
              leftIcon={Icons.Save}
            >
              Save changes
            </Chakra.Button>
          </Chakra.DrawerFooter>
        </Chakra.DrawerContent>
      </Chakra.Drawer>
    </Chakra.Box>
  );
}

export type GroupProps = {
  group: Group;
};

export function Group(props: GroupProps) {
  const { group } = props;
  return (
    <Chakra.VStack
      w="full"
      spacing={5}
      borderWidth={2}
      borderStyle="dashed"
      borderColor="gray.300"
      p={5}
      rounded="md"
    >
      <Chakra.HStack justify="space-between" align="center" w="full">
        <Chakra.HStack>
          <Chakra.Heading size="md">{group.name ?? "Untitled"}</Chakra.Heading>
        </Chakra.HStack>
        <Chakra.HStack align="center" spacing={3}>
          <EditGroup group={group} />
          <DeleteGroup groupId={group.id} />
        </Chakra.HStack>
      </Chakra.HStack>
      <Chakra.VStack w="full" spacing={5}>
        <Links links={group.links} />
        <CreateLinkModal groupId={group.id} />
      </Chakra.VStack>
    </Chakra.VStack>
  );
}

export default function Groups() {
  const { data, isLoading, isError, error } =
    api.app.getGroupsWithLinks.useQuery();

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorMessage description={error.message} />;
  if (!data?.length)
    return (
      <EmptyMessage
        title="No groups created"
        description="Group are sections where your links will be shown. Start by creating a group."
      />
    );
  return (
    <>
      {data.map((group) => (
        <Group group={group} key={group.id} />
      ))}
    </>
  );
}

export function CreateGroup() {
  const { isLoading, mutateAsync } = api.app.createGroup.useMutation();
  const utils = api.useContext();

  const handleClick = async () => {
    await mutateAsync();
    await utils.app.getGroupsWithLinks.invalidate();
  };
  return (
    <Chakra.Button
      isLoading={isLoading}
      onClick={handleClick}
      colorScheme="purple"
      w="full"
      leftIcon={Icons.Create}
    >
      Create new group
    </Chakra.Button>
  );
}
