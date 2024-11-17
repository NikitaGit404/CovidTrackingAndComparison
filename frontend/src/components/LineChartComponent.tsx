import { getCountryCases } from "@/api/getApis";
import { useApi } from "@/hooks/useApi";
import { useRootStore } from "@/store/store";
import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { ChartConfig, ChartContainer } from "./ui/chart";
import Loader from "./ui/loader";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const chartCols = [
  {
    id: "new_cases",
    label: "New Cases",
    subtitle: "Daily new confirmed cases of COVID-19",
  },
  {
    id: "new_deaths",
    label: "New Deaths",
    subtitle: "Daily new confirmed deaths due to COVID-19",
  },
  {
    id: "new_vaccinations",
    label: "New Vaccinations",
    subtitle: "COVID-19 doses administered daily",
  },
  {
    id: "new_tests",
    label: "New Tests",
    subtitle: "Daily COVID-19 tests",
  },
  {
    id: "icu_patients",
    label: "ICU Patients",
    subtitle: "Daily ICU occupancy",
  },
];

const LineChartComponent = () => {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>(
    chartCols[0].id
  );

  const { countries, dateFrom, dateTo } = useRootStore((state) => state);
  const { data, loading, error } = useApi(() => {
    if (countries.length > 0 && dateFrom && dateTo) {
      return getCountryCases(
        format(dateFrom, "yyyy-MM-dd"),
        format(dateTo, "yyyy-MM-dd"),
        countries,
        activeChart.toString()
      );
    }
    return Promise.resolve(undefined);
  }, [dateFrom, dateTo, countries, activeChart]);

  const getColor = (index: number) => `hsl(${(index * 137.5) % 360}, 70%, 50%)`;

  const chartConfig = useMemo(() => {
    return countries.reduce(
      (config, country, index) => {
        config[country] = {
          label: country,
          color: getColor(index),
        };
        return config;
      },
      {} as { [key: string]: { label: string; color: string } }
    );
  }, [countries]);

  return (
    <Card className="flex flex-col lg:flex-row items-center">
      <div className="w-full lg:w-1/4 flex flex-row flex-wrap lg:flex-col ">
        {chartCols.map((key) => {
          const chart = key.id as keyof typeof chartConfig;
          return (
            <div
              key={chart}
              className={`rounded lg:rounded-none cursor-pointer text-center flex lg:flex-1 w-1/2 lg:w-full flex-col justify-center gap-1 lg:px-6 py-4 even:border-l ${activeChart === chart ? "bg-slate-50 border border-b-2 lg:border-t-0 lg:border-x-0" : "border-none"}`}
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-sm font-bold text-muted-foreground">
                {key.label}
              </span>
              <span className="text-[10px] xl:text-sm hidden lg:block">
                {key.subtitle}
              </span>
            </div>
          );
        })}
      </div>
      {countries.length === 0 || !dateFrom || !dateTo ? (
        <div className="flex flex-col font-thin items-center h-[400px] italic w-full lg:w-3/4 py-4 bg-slate-50">
          Add country and select dates to view this Chart!
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full lg:w-3/4 py-4 bg-slate-50"
        >
          {loading ? (
            <Loader className="flex flex-row items-center justify-center w-full h-[400px]" />
          ) : (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [`${value}`, name]}
              />
              <Legend />
              {countries.map((country, index) => (
                <Line
                  key={country}
                  type="monotone"
                  dataKey={country}
                  stroke={getColor(index)}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          )}
        </ChartContainer>
      )}
    </Card>
  );
};

export default LineChartComponent;
