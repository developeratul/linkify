import { AnalyticsStartWrapper } from "@/pages/analytics";
import { AnalyticsWithin } from "@/services/analytics";
import { api } from "@/utils/api";
import { StatLabel } from "@chakra-ui/react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function AnalyticsChart(props: { within: AnalyticsWithin }) {
  const { within } = props;
  const { data, isLoading, isError, error } = api.analytics.getChartDataAnalytics.useQuery({
    within,
  });

  return (
    <AnalyticsStartWrapper isLoading={isLoading} isError={isError} errorMessage={error?.message}>
      <StatLabel fontSize="md" fontWeight="bold" mb={4}>
        Data Analytics
      </StatLabel>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={data}
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
