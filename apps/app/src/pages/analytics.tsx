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
  Image,
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
    <Flex direction="column" justify="center" borderWidth={1} rounded="lg" bg="white" p={5}>
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

function CountryAnalytics(props: { within: AnalyticsWithin }) {
  const { within } = props;
  const { data, isLoading, isError, error } = api.analytics.getCountryAnalytics.useQuery({
    within,
  });

  return (
    <StatWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <StatLabel fontSize="lg" fontWeight="bold" mb={4}>
        Top Countries
      </StatLabel>
      <VStack w="full" align="stretch" spacing={2} bg="white" p={4} rounded="lg">
        {data?.slice(0, 5).map((item, index) => (
          <HStack
            key={item.country}
            justify="space-between"
            p={2}
            bg={index % 2 === 0 ? "gray.50" : "white"}
            rounded="md"
          >
            <HStack spacing={3}>
              <Text color="gray.500" fontSize="sm">
                {index + 1}.
              </Text>
              <Image
                alt={`${item.country} flag`}
                width={6}
                height={4}
                src={`https://flagcdn.com/w20/${item.country?.toLowerCase()}.png`}
              />
              <Text fontWeight="medium">{item.country}</Text>
            </HStack>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {item.count} views
            </Text>
          </HStack>
        ))}
      </VStack>
    </StatWrapper>
  );
}

function DataChart() {
  return <Flex placeItems="center" bg="white" w="full" p={10} rounded="lg"></Flex>;
}

const AnalyticsPage: NextPageWithLayout = () => {
  const [analyticsWithin, setAnalyticsWithin] = React.useState<AnalyticsWithin>("WEEK");
  const handleSelectInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setAnalyticsWithin(value as AnalyticsWithin);
  };
  return (
    <Container maxW="container.xl">
      <VStack spacing={5} w="full">
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
          <SimpleGrid w="full" spacing={5} columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            <VisitorStat within={analyticsWithin} />
            <PageViewStat within={analyticsWithin} />
            <LinkClickStat within={analyticsWithin} />
            <CTRStat within={analyticsWithin} />
          </SimpleGrid>
          <SimpleGrid w="full" spacing={5} columns={{ base: 1, sm: 2 }}>
            <CountryAnalytics within={analyticsWithin} />
          </SimpleGrid>
        </VStack>
        <DataChart />
      </VStack>
    </Container>
  );
};

AnalyticsPage.getLayout = (page) => <AppLayout hidePreviewPanel>{page}</AppLayout>;

export default AnalyticsPage;
