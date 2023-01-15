import { type Group as GroupType } from "@/components/app/Groups";
import { type Link as LinkType } from "@/components/app/Links";
import { GroupSelections } from "@/server/api/routers/group";
import * as Chakra from "@chakra-ui/react";
import clsx from "clsx";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

export function Link(props: { link: LinkType }) {
  const { link } = props;
  return (
    <a
      target="_blank"
      referrerPolicy="no-referrer"
      className={clsx(
        "bg-[rgba(0, 0, 0, 0.6)] flex w-full items-center rounded-md p-1 filter backdrop-blur-md"
      )}
      href={link.url}
      rel="noreferrer"
    >
      {link.thumbnail && (
        <Chakra.Image
          rounded="md"
          boxSize={50}
          fallbackSrc="https://via.placeholder.com/50"
          fit="cover"
          src="https://d1fdloi71mui9q.cloudfront.net/VlhSQBNbSSK3Z4LosygC_sRj8B366YV898t4b"
          alt="Rock image"
        />
      )}
      <p className={clsx("w-full py-3 text-center font-medium text-white")}>
        {link.text}
      </p>
    </a>
  );
}

export function Group(props: { group: GroupType }) {
  const { group } = props;
  if (!group.links.length) return <></>;
  return (
    <Chakra.VStack align="start" w="full" spacing={5}>
      {group.name && (
        <Chakra.Heading size="md" color="white" fontWeight="normal">
          {group.name}
        </Chakra.Heading>
      )}
      {group.links.length > 0 && (
        <Chakra.VStack w="full" spacing={5}>
          {group.links.map((link) => (
            <Link link={link} key={link.id} />
          ))}
        </Chakra.VStack>
      )}
    </Chakra.VStack>
  );
}

const UserPage: NextPage<{ user: User }> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { user } = props;
  const { groups } = user;
  return (
    <Chakra.Box
      w="full"
      h="full"
      bgImage={user.image || ""}
      className={clsx(`bg-cover bg-fixed bg-center bg-no-repeat`)}
      overflow="hidden"
    >
      <Chakra.VStack
        w="full"
        h="full"
        overflowX="hidden"
        className="bg-black/75 filter backdrop-blur-3xl"
        py={50}
        px={5}
      >
        <Chakra.Box w="full" maxW="2xl">
          <Chakra.VStack spacing={10}>
            <Chakra.VStack spacing={5}>
              <Chakra.Avatar
                name={user.name || user.username}
                src={user.image || ""}
                size="xl"
              />
              <Chakra.VStack>
                <Chakra.Heading
                  className="text-white"
                  size="md"
                  fontWeight="medium"
                >
                  @{user.username}
                </Chakra.Heading>
                {user.bio && (
                  <Chakra.Text
                    whiteSpace="pre-wrap"
                    color="rgba(255, 255, 255, 0.6)"
                    fontWeight="medium"
                  >
                    {user.bio}
                  </Chakra.Text>
                )}
              </Chakra.VStack>
            </Chakra.VStack>

            {/* groups */}
            <Chakra.VStack w="full" spacing={10}>
              {groups.map((group) => (
                <Group group={group} key={group.id} />
              ))}
            </Chakra.VStack>
          </Chakra.VStack>
        </Chakra.Box>
      </Chakra.VStack>
    </Chakra.Box>
  );
};

export default UserPage;

export type User = {
  username: string;
  name?: string | null;
  bio: string;
  image?: string | null;
  groups: GroupType[];
};

import { prisma } from "@/server/db";

export const getServerSideProps: GetServerSideProps<{ user: User }> = async (
  ctx
) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: ctx.query.slug as string },
        { username: ctx.query.slug as string },
      ],
    },
    select: {
      username: true,
      name: true,
      bio: true,
      image: true,
      groups: {
        select: GroupSelections,
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  if (!user || !user.username || !user.bio) {
    return {
      notFound: true,
    };
  }

  return {
    props: { user: user as User },
  };
};
