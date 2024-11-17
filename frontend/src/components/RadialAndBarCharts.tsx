import {
  RadialBar,
  RadialBarChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useApi } from "@/hooks/useApi";
import { useRootStore } from "@/store/store";
import { getVaccinationPercentage } from "@/api/getApis";
import { useMemo } from "react";
import Loader from "./ui/loader";

export default function RadialAndBarCharts() {
  const { countries } = useRootStore((state) => state);

  const { data, loading, error } = useApi(() => {
    if (countries.length > 0) {
      return getVaccinationPercentage(countries);
    }
    return Promise.resolve(undefined);
  }, [countries]);

  //   const getColor = (index: number) => `hsl(${(index * 137.5) % 360}, 50%, 50%)`;
  const getColor = (index: number) => `hsl(${(index * 137.5) % 360}, 55%, 55%)`;

  const chartData = useMemo(() => {
    return data
      ? data.map((item, index) => ({
          country: item.country,
          percentage: item.percentage,
          avgLifeExpectancy: item.avgLifeExpectancy,
          fill: `var(--color-${item.country})`,
        }))
      : [];
  }, [data]);

  const chartConfig = useMemo(() => {
    return chartData.reduce(
      (config, { country }, index) => {
        config[country] = {
          label: country,
          color: getColor(index),
        };
        return config;
      },
      {} as { [key: string]: { label: string; color: string } }
    );
  }, [chartData]);

  return (
    <Card className="my-5">
      {countries.length === 0 ? (
        <div className="flex flex-col font-thin items-center h-[400px] italic w-full  py-4">
          Add country to view this Chart!
        </div>
      ) : loading ? (
        <Loader className="flex flex-row items-center justify-center w-full h-[988px] lg:h-[450px]" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex flex-col gap-4 border-b lg:border-r">
            <span className="font-bold text-base w-full px-4 pt-4">
              Vaccination Percentage
            </span>
            <ChartContainer config={chartConfig}>
              <RadialBarChart
                data={chartData}
                innerRadius={30}
                //   outerRadius={110}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="country" />}
                />
                <RadialBar dataKey="percentage" background />
              </RadialBarChart>
            </ChartContainer>
          </div>
          {/* Bar Chart for Average Life Expectancy */}
          <div className="flex flex-col">
            <span className="font-bold text-base w-full px-4 pt-4">
              Average Life Expectancy
            </span>
            <div className="max-h-[400px] m-4 pt-4 rounded-sm overflow-y-scroll">
              <ChartContainer
                config={chartConfig}
                style={{
                  height: `${chartData.length * 50}px`,
                  width: "90%",
                }}
              >
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 25 }}
                  barSize={20}
                  barGap={0}
                >
                  <YAxis
                    dataKey="country"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={true}
                    tickFormatter={(value) =>
                      chartConfig[value as keyof typeof chartConfig]?.label
                    }
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="avgLifeExpectancy" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="avgLifeExpectancy"
                    layout="vertical"
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
