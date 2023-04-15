import { AppLayout } from "@/Layouts/app";
import { Conditional } from "@/components/common/Conditional";
import { AnalyticsWithin } from "@/services/analytics";
import { AppProps } from "@/types";
import { api } from "@/utils/api";
import { isPositiveNumber } from "@/utils/number";
import * as Chakra from "@chakra-ui/react";
import React from "react";
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

function VisitorStat(props: { within: AnalyticsWithin }) {
  const { within } = props;
  const { data, isLoading, isError, error } = api.analytics.getEventData.useQuery({
    event: "UNIQUE_VIEW",
    within,
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <Chakra.StatLabel>Visitors</Chakra.StatLabel>
      <Chakra.StatNumber>{data?.currentCount}</Chakra.StatNumber>
      {(data?.increasedPercentage as number) !== 0 && (
        <Chakra.StatHelpText>
          <Chakra.StatArrow
            type={isPositiveNumber(data?.increasedPercentage as number) ? "increase" : "decrease"}
          />
          {data?.increasedPercentage}%
        </Chakra.StatHelpText>
      )}
    </StatWrapper>
  );
}

function PageViewStat(props: { within: AnalyticsWithin }) {
  const { within } = props;
  const { data, isLoading, isError, error } = api.analytics.getEventData.useQuery({
    event: "VIEW",
    within,
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <Chakra.StatLabel>Page views</Chakra.StatLabel>
      <Chakra.StatNumber>{data?.currentCount}</Chakra.StatNumber>
      {(data?.increasedPercentage as number) !== 0 && (
        <Chakra.StatHelpText>
          <Chakra.StatArrow
            type={isPositiveNumber(data?.increasedPercentage as number) ? "increase" : "decrease"}
          />
          {data?.increasedPercentage}%
        </Chakra.StatHelpText>
      )}
    </StatWrapper>
  );
}

function CTRStat(props: { within: AnalyticsWithin }) {
  const { within } = props;
  const { data, isLoading, isError, error } = api.analytics.getCTRData.useQuery({
    within,
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <Chakra.StatLabel>CTR</Chakra.StatLabel>
      <Chakra.StatNumber>{data?.currentCTR}%</Chakra.StatNumber>
    </StatWrapper>
  );
}

function LinkClickStat(props: { within: AnalyticsWithin }) {
  const { within } = props;
  const { data, isLoading, isError, error } = api.analytics.getEventData.useQuery({
    event: "CLICK",
    within,
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <Chakra.StatLabel>Link clicks</Chakra.StatLabel>
      <Chakra.StatNumber>{data?.currentCount}</Chakra.StatNumber>
      {(data?.increasedPercentage as number) !== 0 && (
        <Chakra.StatHelpText>
          <Chakra.StatArrow
            type={isPositiveNumber(data?.increasedPercentage as number) ? "increase" : "decrease"}
          />
          {data?.increasedPercentage}%
        </Chakra.StatHelpText>
      )}
    </StatWrapper>
  );
}

const AnalyticsPage: NextPageWithLayout = () => {
  const [analyticsWithin, setAnalyticsWithin] = React.useState<AnalyticsWithin>("WEEK");
  const handleSelectInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setAnalyticsWithin(value as AnalyticsWithin);
  };
  return (
    <Chakra.Container maxW="container.xl">
      <Chakra.VStack spacing={5}>
        <Chakra.HStack w="full" justify="space-between" align="center">
          <Chakra.Box>
            <Chakra.Select
              variant="filled"
              value={analyticsWithin}
              onChange={handleSelectInputChange}
            >
              <option value="WEEK">Last 7 days</option>
              <option value="MONTH">Last 30 days</option>
              <option value="ALL_TIME">All time</option>
            </Chakra.Select>
          </Chakra.Box>
        </Chakra.HStack>
        <Chakra.SimpleGrid w="full" spacing={5} columns={4}>
          <VisitorStat within={analyticsWithin} />
          <PageViewStat within={analyticsWithin} />
          <LinkClickStat within={analyticsWithin} />
          <CTRStat within={analyticsWithin} />
        </Chakra.SimpleGrid>
      </Chakra.VStack>
    </Chakra.Container>
  );
};

AnalyticsPage.getLayout = (page) => <AppLayout hidePreviewPanel>{page}</AppLayout>;

export default AnalyticsPage;
