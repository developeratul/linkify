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
import * as Chakra from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import { saveAs } from "file-saver";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";

function LimitExceededAlert() {
  const { isLoading, data, isError, error } = api.testimonial.hasLimitExceeded.useQuery();

  if (isLoading) return <></>;
  if (isError) return <ErrorMessage description={error.message} />;

  const { hasExceeded, isPro } = data;

  if (!hasExceeded) return <></>;

  const hasExceededMessage = isPro
    ? "Your monthly limit to accept testimonials has been exceeded in your pro plan. Please contact the team to request a new plan."
    : "Your monthly limit to accept testimonials has been exceeded. Please upgrade to pro.";

  return (
    <Chakra.Alert status="warning">
      <Chakra.AlertIcon />
      <Chakra.AlertTitle>Attention</Chakra.AlertTitle>
      <Chakra.AlertDescription>{hasExceededMessage}</Chakra.AlertDescription>
    </Chakra.Alert>
  );
}

function ToggleTestimonialAcceptance(props: { isAccepting: boolean }) {
  const { isAccepting } = props;
  const { mutateAsync, isLoading } = api.testimonial.toggleTestimonialAcceptance.useMutation();
  const toast = Chakra.useToast();
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
    <Chakra.Box>
      <Chakra.Switch
        disabled={isLoading}
        onChange={handleToggle}
        colorScheme="purple"
        defaultChecked={isAccepting}
      >
        Accepting
      </Chakra.Switch>
    </Chakra.Box>
  );
}

function ExportAsCSV() {
  const { mutateAsync, isLoading } = api.testimonial.exportAsCSV.useMutation();
  const toast = Chakra.useToast();

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
    <Chakra.Box>
      <Chakra.Button
        isLoading={isLoading}
        onClick={handleClick}
        colorScheme="purple"
        leftIcon={<Icon name="Export" />}
      >
        Export
      </Chakra.Button>
    </Chakra.Box>
  );
}

function DeleteTestimonial(props: { testimonialId: string }) {
  const { testimonialId } = props;
  const { isLoading, mutateAsync } = api.testimonial.deleteOne.useMutation();
  const { isOpen, onClose, onOpen } = Chakra.useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const toast = Chakra.useToast();
  const router = useRouter();
  const previewContext = usePreviewContext();
  const utils = api.useContext();

  const handleClick = async () => {
    try {
      await mutateAsync(testimonialId);
      await utils.testimonial.findMany.invalidate();
      await utils.testimonial.hasLimitExceeded.invalidate();
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
    <Chakra.Box>
      <Chakra.Tooltip hasArrow label="Delete testimonial">
        <Chakra.IconButton
          isLoading={isLoading}
          onClick={onOpen}
          colorScheme="red"
          variant="ghost"
          icon={<Icon name="Delete" />}
          aria-label="Delete testimonial"
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
          <Chakra.AlertDialogHeader>Delete Testimonial?</Chakra.AlertDialogHeader>
          <Chakra.AlertDialogCloseButton />
          <Chakra.AlertDialogBody>
            Are you sure? This action will cause permanent data loss.
          </Chakra.AlertDialogBody>
          <Chakra.AlertDialogFooter>
            <Chakra.Button mr={3} ref={cancelRef} onClick={onClose}>
              No
            </Chakra.Button>
            <Chakra.Button isLoading={isLoading} onClick={handleClick} colorScheme="purple">
              Yes
            </Chakra.Button>
          </Chakra.AlertDialogFooter>
        </Chakra.AlertDialogContent>
      </Chakra.AlertDialog>
    </Chakra.Box>
  );
}

function Testimonial(props: { testimonial: TestimonialType }) {
  const { testimonial } = props;
  const { mutateAsync, isLoading } = api.testimonial.toggleShow.useMutation();
  const toast = Chakra.useToast();
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
    <Chakra.Card bg="white">
      <Chakra.CardHeader>
        <Chakra.Avatar src={testimonial.avatar || ""} name={testimonial.name} />
      </Chakra.CardHeader>
      <Chakra.CardBody>
        <Chakra.VStack align="start" spacing={3}>
          <Chakra.VStack align="start" spacing={1}>
            <Chakra.Heading size="md">{testimonial.name}</Chakra.Heading>
            <Chakra.Text fontSize="sm">{testimonial.email}</Chakra.Text>
          </Chakra.VStack>
          <Chakra.Text whiteSpace="pre-wrap">{testimonial.message}</Chakra.Text>
          <Rating rating={testimonial.rating} starDimension="20px" starSpacing="3px" />
        </Chakra.VStack>
      </Chakra.CardBody>
      <Chakra.CardFooter>
        <Chakra.HStack w="full" align="center" justify="space-between">
          <Chakra.Switch
            defaultChecked={testimonial.shouldShow}
            disabled={isLoading}
            onChange={handleToggleTestimonialShow}
            colorScheme="purple"
          />
          <DeleteTestimonial testimonialId={testimonial.id} />
        </Chakra.HStack>
      </Chakra.CardFooter>
    </Chakra.Card>
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
    return <EmptyMessage title="Empty" description="No testimonials to show yet" />;

  return (
    <Chakra.Box w="full">
      <Chakra.VStack align="start" spacing={5}>
        <LimitExceededAlert />
        <Chakra.Stack
          w="full"
          spacing={5}
          flexDir={{ base: "column", sm: "row", md: "column", lg: "row" }}
          justify={{ base: "stretch", sm: "space-between", md: "stretch", lg: "space-between" }}
        >
          <Chakra.HStack align="center" spacing={3}>
            <ToggleTestimonialAcceptance isAccepting={isAcceptingTestimonials} />
            <Chakra.Text>({totalTestimonials})</Chakra.Text>
          </Chakra.HStack>
          <Chakra.HStack align="center">
            <Chakra.Select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              variant="filled"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Chakra.Select>
            <ExportAsCSV />
          </Chakra.HStack>
        </Chakra.Stack>
        <Chakra.SimpleGrid
          w="full"
          columns={{ base: 1, sm: 2, md: 1, lg: 2, "2xl": 3 }}
          spacing={5}
        >
          {testimonials.map((testimonial) => (
            <Testimonial key={testimonial.id} testimonial={testimonial} />
          ))}
        </Chakra.SimpleGrid>
        {hasNextPage && (
          <Chakra.Stack justify="center" align="center" w="full">
            <Chakra.Button
              size="sm"
              isLoading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              colorScheme="purple"
            >
              Load more
            </Chakra.Button>
          </Chakra.Stack>
        )}
      </Chakra.VStack>
    </Chakra.Box>
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
