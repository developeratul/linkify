import { EmptyMessage } from "@/components/app/common/Message";
import Rating from "@/components/common/Rating";
import { AppLayout } from "@/Layouts/app";
import type { NextPageWithLayout } from "@/pages/_app";
import { usePreviewContext } from "@/providers/preview";
import { getServerAuthSession, requireAuth } from "@/server/auth";
import { prisma } from "@/server/db";
import TestimonialService from "@/services/testimonial";
import type { Testimonial as TestimonialType } from "@/types";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "components";
import { saveAs } from "file-saver";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";

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
  const toast = useToast();
  const router = useRouter();
  const previewContext = usePreviewContext();

  const handleClick = async () => {
    try {
      await mutateAsync(testimonialId);
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
  const toast = useToast();
  const router = useRouter();
  const previewContext = usePreviewContext();

  const handleToggleTestimonialShow = async () => {
    try {
      await mutateAsync(testimonial.id);
      router.push(router.asPath);
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

const TestimonialsPage: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { testimonials } = props;
  const [sortType, setSortType] = React.useState("");

  const sortedTestimonials = React.useMemo(() => {
    if (sortType === "")
      return testimonials.sort(
        (a: TestimonialType, b: TestimonialType) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    return testimonials.sort(
      (a: TestimonialType, b: TestimonialType) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }, [sortType, testimonials]);

  if (!testimonials.length)
    return <EmptyMessage title="Empty" description="No testimonials to show yet" />;

  return (
    <Chakra.Box w="full">
      <Chakra.VStack align="start" spacing={5}>
        <Chakra.HStack w="full" align="center" justify="space-between">
          <Chakra.Heading size="md" color="purple.500">
            Testimonials
          </Chakra.Heading>
          <Chakra.HStack align="center">
            <Chakra.Select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              variant="filled"
            >
              <option value="">Latest</option>
              <option value="oldest">Oldest</option>
            </Chakra.Select>
            <ExportAsCSV />
          </Chakra.HStack>
        </Chakra.HStack>
        <Chakra.SimpleGrid w="full" columns={{ base: 1, lg: 2, xl: 3 }} spacing={5}>
          {sortedTestimonials.map((testimonial: TestimonialType) => (
            <Testimonial key={testimonial.id} testimonial={testimonial} />
          ))}
        </Chakra.SimpleGrid>
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
    select: {
      id: true,
      username: true,
      bio: true,
    },
  });

  if (!user?.username || !user?.bio) {
    return {
      redirect: { destination: "/auth/onboarding", permanent: false },
    };
  }

  const testimonials = await TestimonialService.findMany(user.id);

  return {
    props: { testimonials },
  };
});
