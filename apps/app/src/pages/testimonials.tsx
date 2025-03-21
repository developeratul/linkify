import { EmptyMessage, ErrorMessage } from "@/components/app/common/Message";
import Loader from "@/components/common/Loader";
import Rating from "@/components/common/Rating";
import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";
import { usePreviewContext } from "@/providers/preview";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { prisma } from "@/server/db";
import type { Testimonial as TestimonialType } from "@/types";
import { api } from "@/utils/api";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import { saveAs } from "file-saver";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";

function ToggleTestimonialAcceptance(props: { isAccepting: boolean }) {
  const { isAccepting } = props;
  const { mutateAsync, isLoading } = api.testimonial.toggleTestimonialAcceptance.useMutation();
  const toast = useToast();
  const previewContext = usePreviewContext();
  const utils = api.useContext();

  const handleToggle = async () => {
    try {
      const message = await mutateAsync();
      await utils.testimonial.findMany.invalidate();
      previewContext?.reload();
      toast({ status: "info", description: message });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <Switch
        disabled={isLoading}
        onChange={handleToggle}
        colorScheme="purple"
        defaultChecked={isAccepting}
      >
        Accepting
      </Switch>
    </Box>
  );
}

function ExportAsCSV() {
  const { mutateAsync, isLoading } = api.testimonial.exportAsCSV.useMutation();
  const toast = useToast();

  const handleClick = async () => {
    try {
      const data = await mutateAsync();
      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
      saveAs(blob);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <Button
        isLoading={isLoading}
        onClick={handleClick}
        colorScheme="purple"
        leftIcon={<Icon name="Export" />}
      >
        Export
      </Button>
    </Box>
  );
}

function DeleteTestimonial(props: { testimonialId: string }) {
  const { testimonialId } = props;
  const { isLoading, mutateAsync } = api.testimonial.deleteOne.useMutation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = useToast();
  const router = useRouter();
  const previewContext = usePreviewContext();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(testimonialId);
      await utils.testimonial.findMany.invalidate();
      router.push(router.asPath);
      previewContext?.reload();
      onClose();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Box>
      <Tooltip hasArrow label="Delete testimonial">
        <IconButton
          isLoading={isLoading}
          onClick={onOpen}
          colorScheme="red"
          variant="ghost"
          icon={<Icon name="Delete" />}
          aria-label="Delete testimonial"
        />
      </Tooltip>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Testimonial?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure? This action will cause permanent data loss.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button isLoading={isLoading} onClick={handleClick} colorScheme="purple">
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}

function Testimonial(props: { testimonial: TestimonialType }) {
  const { testimonial } = props;
  const { mutateAsync, isLoading } = api.testimonial.toggleShow.useMutation();
  const toast = useToast();
  const previewContext = usePreviewContext();
  const utils = api.useContext();

  const handleToggleTestimonialShow = async () => {
    try {
      await mutateAsync(testimonial.id);
      await utils.testimonial.findMany.invalidate();
      previewContext?.reload();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <Card bg="white">
      <CardHeader>
        <Avatar src={testimonial.avatar || ""} name={testimonial.name} />
      </CardHeader>
      <CardBody>
        <VStack align="start" spacing={3}>
          <VStack align="start" spacing={1}>
            <Heading size="md">{testimonial.name}</Heading>
            <Text fontSize="sm">{testimonial.email}</Text>
          </VStack>
          <Text whiteSpace="pre-wrap">{testimonial.message}</Text>
          <Rating rating={testimonial.rating} starDimension="20px" starSpacing="3px" />
        </VStack>
      </CardBody>
      <CardFooter>
        <HStack w="full" align="center" justify="space-between">
          <Switch
            defaultChecked={testimonial.shouldShow}
            disabled={isLoading}
            onChange={handleToggleTestimonialShow}
            colorScheme="purple"
          />
          <DeleteTestimonial testimonialId={testimonial.id} />
        </HStack>
      </CardFooter>
    </Card>
  );
}

type SortType = "desc" | "asc";

const TestimonialsPage: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { isAcceptingTestimonials, totalTestimonials } = props;
  const [sortType, setSortType] = React.useState<SortType>("desc");
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.testimonial.findMany.useInfiniteQuery(
      { limit: 12, orderBy: sortType },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage description={error.message} />;

  const testimonials = data.pages
    .map((page) => page.testimonials.map((testimonial) => testimonial))
    .flat();

  if (!testimonials.length)
    return (
      <EmptyMessage title="Empty" description="You haven't been left with a testimonial yet :)" />
    );

  return (
    <Box w="full">
      <VStack align="start" spacing={5}>
        <Stack
          w="full"
          spacing={5}
          flexDir={{ base: "column", sm: "row", md: "column", lg: "row" }}
          justify={{ base: "stretch", sm: "space-between", md: "stretch", lg: "space-between" }}
        >
          <HStack align="center" spacing={3}>
            <ToggleTestimonialAcceptance isAccepting={isAcceptingTestimonials} />
            <Text>({totalTestimonials})</Text>
          </HStack>
          <HStack align="center">
            <Select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              variant="filled"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
            <ExportAsCSV />
          </HStack>
        </Stack>
        <SimpleGrid w="full" columns={{ base: 1, sm: 2, md: 1, lg: 2, "2xl": 3 }} spacing={5}>
          {testimonials.map((testimonial) => (
            <Testimonial key={testimonial.id} testimonial={testimonial} />
          ))}
        </SimpleGrid>
        {hasNextPage && (
          <Stack justify="center" align="center" w="full">
            <Button
              size="sm"
              isLoading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              colorScheme="purple"
            >
              Load more
            </Button>
          </Stack>
        )}
      </VStack>
    </Box>
  );
};

TestimonialsPage.getLayout = (page) => {
  return <AppLayout>{page}</AppLayout>;
};

export default TestimonialsPage;

export const getServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const user = await prisma?.user.findUnique({
    where: { id: session?.user?.id },
    include: { _count: { select: { testimonials: true } } },
  });

  if (!user?.username || !user?.bio) {
    return {
      redirect: { destination: "/auth/onboarding", permanent: false },
    };
  }

  return {
    props: {
      isAcceptingTestimonials: user.isAcceptingTestimonials,
      totalTestimonials: user._count.testimonials,
    },
  };
});
