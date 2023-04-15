import { AppLayout } from "@/Layouts/app";
import { Conditional } from "@/components/common/Conditional";
import { AppProps } from "@/types";
import { api } from "@/utils/api";
import { isPositiveNumber } from "@/utils/number";
import * as Chakra from "@chakra-ui/react";
import type { NextPageWithLayout } from "./_app";

function StatWrapper(
  props: AppProps & {
    isLoading: boolean;
    isError: boolean;
    errorMessage?: string | null;
  }
) {
  const { children, isLoading, isError, errorMessage } = props;
  return (
    <Chakra.Flex direction="column" justify="center" borderWidth={1} rounded="md" bg="white" p={5}>
      <Conditional
        condition={!isLoading}
        fallback={<Chakra.Spinner mx="auto" my="35px" />}
        component={
          <Conditional
            condition={!isError}
            component={<Chakra.Stat>{children}</Chakra.Stat>}
            fallback={
              <Chakra.Text color="red.500" whiteSpace="normal" noOfLines={1}>
                {errorMessage}
              </Chakra.Text>
            }
          />
        }
      />
    </Chakra.Flex>
  );
}

function VisitorStat() {
  const { data, isLoading, isError, error } = api.analytics.getEventData.useQuery({
    event: "UNIQUE_VIEW",
    within: "WEEK",
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <Chakra.StatLabel>Visitors</Chakra.StatLabel>
      <Chakra.StatNumber>{data?.currentCount}</Chakra.StatNumber>
      {(data?.increasePercentage as number) !== 0 && (
        <Chakra.StatHelpText>
          <Chakra.StatArrow
            type={isPositiveNumber(data?.increasePercentage as number) ? "increase" : "decrease"}
          />
          {data?.increasePercentage}%
        </Chakra.StatHelpText>
      )}
    </StatWrapper>
  );
}

function PageViewStat() {
  const { data, isLoading, isError, error } = api.analytics.getEventData.useQuery({
    event: "VIEW",
    within: "WEEK",
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <Chakra.StatLabel>Page views</Chakra.StatLabel>
      <Chakra.StatNumber>{data?.currentCount}</Chakra.StatNumber>
      {(data?.increasePercentage as number) !== 0 && (
        <Chakra.StatHelpText>
          <Chakra.StatArrow
            type={isPositiveNumber(data?.increasePercentage as number) ? "increase" : "decrease"}
          />
          {data?.increasePercentage}%
        </Chakra.StatHelpText>
      )}
    </StatWrapper>
  );
}

function CTRStat() {
  const { data, isLoading, isError, error } = api.analytics.getCTRData.useQuery({
    within: "WEEK",
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <Chakra.StatLabel>CTR</Chakra.StatLabel>
      <Chakra.StatNumber>{data?.currentCTR}%</Chakra.StatNumber>
    </StatWrapper>
  );
}

function LinkClickStat() {
  const { data, isLoading, isError, error } = api.analytics.getEventData.useQuery({
    event: "CLICK",
    within: "WEEK",
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <Chakra.StatLabel>Link clicks</Chakra.StatLabel>
      <Chakra.StatNumber>{data?.currentCount}</Chakra.StatNumber>
      {(data?.increasePercentage as number) !== 0 && (
        <Chakra.StatHelpText>
          <Chakra.StatArrow
            type={isPositiveNumber(data?.increasePercentage as number) ? "increase" : "decrease"}
          />
          {data?.increasePercentage}%
        </Chakra.StatHelpText>
      )}
    </StatWrapper>
  );
}

const AnalyticsPage: NextPageWithLayout = () => {
  return (
    <Chakra.Container maxW="container.xl">
      <Chakra.VStack>
        <Chakra.SimpleGrid w="full" spacing={5} columns={4}>
          <VisitorStat />
          <PageViewStat />
          <LinkClickStat />
          <CTRStat />
        </Chakra.SimpleGrid>
      </Chakra.VStack>
    </Chakra.Container>
  );
};

AnalyticsPage.getLayout = (page) => <AppLayout hidePreviewPanel>{page}</AppLayout>;

export default AnalyticsPage;
