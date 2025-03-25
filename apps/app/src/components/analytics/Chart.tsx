import { AnalyticsStartWrapper } from "@/pages/analytics";
import { AnalyticsWithin } from "@/services/analytics";
import { api } from "@/utils/api";
import { Heading, StatLabel, Text, VStack } from "@chakra-ui/react";
import { Icon } from "components";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import UpgradeButton from "../common/UpgradeButton";

const dummyFormData = [
  {
    date: "12/24",
    pageViews: 12,
    clicks: 5,
  },
  {
    date: "12/25",
    pageViews: 15,
    clicks: 7,
  },
  {
    date: "12/26",
    pageViews: 20,
    clicks: 10,
  },
  {
    date: "12/27",
    pageViews: 18,
    clicks: 9,
  },
  {
    date: "12/28",
    pageViews: 25,
    clicks: 12,
  },
  {
    date: "12/29",
    pageViews: 30,
    clicks: 15,
  },
  {
    date: "12/30",
    pageViews: 28,
    clicks: 14,
  },
  {
    date: "12/31",
    pageViews: 35,
    clicks: 18,
  },
];

export default function AnalyticsChart(props: { within: AnalyticsWithin }) {
  const { within } = props;
  const { data, isLoading, isError, error } = api.analytics.getChartDataAnalytics.useQuery({
    within,
  });
  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    isError: isSubscriptionError,
    error: subscriptionError,
  } = api.payment.getSubscription.useQuery();

  return (
    <AnalyticsStartWrapper
      isLoading={isLoading || isSubscriptionLoading}
      isError={isError || isSubscriptionError}
      errorMessage={error?.message || subscriptionError?.message}
    >
      {!subscription?.isPro && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <VStack spacing="6">
            <Text color="purple.500">
              <Icon name="Subscribe" size={48} />
            </Text>
            <VStack>
              <Heading size="md">Upgrade for Detailed Analytics</Heading>
              <Text color="GrayText">
                Measure your analytics more effectively with data visualization.
              </Text>
            </VStack>
            <UpgradeButton size="md" />
          </VStack>
        </div>
      )}
      <StatLabel fontSize="md" fontWeight="bold" mb={4}>
        Data Analytics
      </StatLabel>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={!subscription?.isPro ? dummyFormData : data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="date"
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pageViews" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="clicks" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsStartWrapper>
  );
}
