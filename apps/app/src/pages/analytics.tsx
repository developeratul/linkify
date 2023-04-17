import { AppLayout } from "@/Layouts/app";
import { Conditional } from "@/components/common/Conditional";
import { AnalyticsWithin } from "@/services/analytics";
import { AppProps } from "@/types";
import { api } from "@/utils/api";
import { isPositiveNumber } from "@/utils/number";
import {
  Box,
  Container,
  Flex,
  HStack,
  Select,
  SimpleGrid,
  Spinner,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
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
    <Flex direction="column" justify="center" borderWidth={1} rounded="md" bg="white" p={5}>
      <Conditional
        condition={!isLoading}
        fallback={<Spinner mx="auto" my="35px" />}
        component={
          <Conditional
            condition={!isError}
            component={<Stat>{children}</Stat>}
            fallback={
              <Text color="red.500" whiteSpace="normal" noOfLines={1}>
                {errorMessage}
              </Text>
            }
          />
        }
      />
    </Flex>
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
      <StatLabel>Visitors</StatLabel>
      <StatNumber>{data?.currentCount}</StatNumber>
      <Conditional
        condition={(data?.increasedPercentage as number) !== 0}
        fallback="--"
        component={
          <StatHelpText>
            <StatArrow
              type={isPositiveNumber(data?.increasedPercentage as number) ? "increase" : "decrease"}
            />
            {data?.increasedPercentage}%
          </StatHelpText>
        }
      />
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
      <StatLabel>Page views</StatLabel>
      <StatNumber>{data?.currentCount}</StatNumber>
      <Conditional
        condition={(data?.increasedPercentage as number) !== 0}
        fallback="--"
        component={
          <StatHelpText>
            <StatArrow
              type={isPositiveNumber(data?.increasedPercentage as number) ? "increase" : "decrease"}
            />
            {data?.increasedPercentage}%
          </StatHelpText>
        }
      />
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
      <StatLabel>CTR</StatLabel>
      <StatNumber>{data?.currentCTR}%</StatNumber>
      <Conditional
        condition={(data?.increasedPercentage as number) !== 0}
        fallback="--"
        component={
          <StatHelpText>
            <StatArrow
              type={isPositiveNumber(data?.increasedPercentage as number) ? "increase" : "decrease"}
            />
            {data?.increasedPercentage}%
          </StatHelpText>
        }
      />
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
      <StatLabel>Link clicks</StatLabel>
      <StatNumber>{data?.currentCount}</StatNumber>
      <Conditional
        condition={(data?.increasedPercentage as number) !== 0}
        fallback="--"
        component={
          <StatHelpText>
            <StatArrow
              type={isPositiveNumber(data?.increasedPercentage as number) ? "increase" : "decrease"}
            />
            {data?.increasedPercentage}%
          </StatHelpText>
        }
      />
    </StatWrapper>
  );
}

const data = [
  { name: "Yesterday", visitors: 1000, pageViews: 5600, clicks: 340 },
  { name: "12 July", visitors: 600, pageViews: 1200, clicks: 500 },
  { name: "11 July", visitors: 700, pageViews: 7000, clicks: 120 },
  { name: "10 July", visitors: 560, pageViews: 8000, clicks: 904 },
  { name: "9 July", visitors: 1200, pageViews: 5560, clicks: 493 },
  { name: "8 July", visitors: 600, pageViews: 5560, clicks: 858 },
  { name: "7 July", visitors: 809, pageViews: 9059, clicks: 430 },
];

function DataChart() {
  return (
    <LineChart width={1000} height={400} data={data}>
      <Line type="monotone" dataKey="clicks" stroke="#FF0000" />
      <Line type="monotone" dataKey="visitors" stroke="#8000ff" />
      <Line type="monotone" dataKey="pageViews" stroke="#ff7b00" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip useTranslate3d />
    </LineChart>
  );
}

const AnalyticsPage: NextPageWithLayout = () => {
  const [analyticsWithin, setAnalyticsWithin] = React.useState<AnalyticsWithin>("WEEK");
  const handleSelectInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setAnalyticsWithin(value as AnalyticsWithin);
  };
  return (
    <Container maxW="container.xl">
      <VStack spacing={36} w="full">
        <VStack spacing={5} w="full">
          <HStack w="full" justify="space-between" align="center">
            <Box>
              <Select variant="filled" value={analyticsWithin} onChange={handleSelectInputChange}>
                <option value="WEEK">Last 7 days</option>
                <option value="MONTH">Last 30 days</option>
                <option value="ALL_TIME">All time</option>
              </Select>
            </Box>
          </HStack>
          <SimpleGrid w="full" spacing={5} columns={4}>
            <VisitorStat within={analyticsWithin} />
            <PageViewStat within={analyticsWithin} />
            <LinkClickStat within={analyticsWithin} />
            <CTRStat within={analyticsWithin} />
          </SimpleGrid>
        </VStack>
        <DataChart />
      </VStack>
    </Container>
  );
};

AnalyticsPage.getLayout = (page) => <AppLayout hidePreviewPanel>{page}</AppLayout>;

export default AnalyticsPage;
