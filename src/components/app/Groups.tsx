import { SectionLoader } from "@/components/common/Loader";
import { EmptyMessage, ErrorMessage } from "@/components/common/Message";
import { Icons } from "@/Icons";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import type { Link } from "./Link";
import Links, { CreateLinkModal } from "./Link";

export type Group = {
  id: string;
  name: string | null;
  links: Link[];
};

export type GroupProps = {
  group: Group;
};

export function Group(props: GroupProps) {
  const { group } = props;
  return (
    <Chakra.VStack
      w="full"
      spacing={3}
      borderWidth={2}
      borderStyle="dashed"
      borderColor="gray.300"
      p={5}
      rounded="md"
    >
      <Chakra.Editable
        defaultValue={group.name ?? "Untitled"}
        fontSize="lg"
        fontWeight="medium"
        w="full"
      >
        <Chakra.EditablePreview />
        <Chakra.EditableInput />
      </Chakra.Editable>

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
