import { getTotalCases } from "@/api/getApis";
import { useApi } from "@/hooks/useApi";
import { scaleLinear } from "d3-scale";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Loader from "./ui/loader";
import { Card } from "./ui/card";
import { useState } from "react";

const geoUrl = "/features.json";

const chartCols = [
  {
    id: "total_cases_per_million",
    label: "Total Cases per Million",
    range: ["#ffedea", "#ff5233"],
  },
  {
    id: "total_deaths_per_million",
    label: "Total Deaths per Million",
    range: ["#f0f0f0", "#333"],
  },
  {
    id: "total_tests_per_thousand",
    label: "Total Tests per Thousand",
    range: ["#f0f9e8", "#0868ac"],
  },
];

const HeatMapChart = () => {
  const [activeChart, setActiveChart] = useState(chartCols[0].id);

  const { data, loading } = useApi(() => {
    return getTotalCases(activeChart);
  }, [activeChart]);

  const maxValue =
    data && data.length > 0 ? Math.max(...data.map((d) => d.total)) : 0;

  const colorRange = chartCols.find((c) => c.id === activeChart)?.range || [
    "#f0f9e8",
    "#0868ac",
  ];
  //@ts-expect-error - TS doesn't know about d3-scale
  const colorScale = scaleLinear().domain([0, maxValue]).range(colorRange);

  return (
    <Card className="flex flex-col my-5">
      <div className="w-full flex flex-row flex-wrap ">
        {chartCols.map((key) => {
          const chart = key.id;
          return (
            <div
              key={chart}
              className={`flex cursor-pointer w-1/3 flex-col justify-center gap-1 border-t lg:px-6 py-4 text-center even:border-l ${activeChart === chart ? "bg-slate-50" : "hover:text-slate-500"}`}
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-sm font-bold text-muted-foreground">
                {key.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-[40vw] overflow-y-hidden bg-slate-50">
        <div className="absolute left-4 bg-white shadow-md p-4 rounded-lg">
          <h4 className="text-sm font-bold mb-2 text-gray-800">Intensity</h4>
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: chartCols.find((c) => c.id === activeChart)
                  ?.range[0],
              }}
            ></div>
            <span className="text-sm text-gray-600">Least</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: chartCols.find((c) => c.id === activeChart)
                  ?.range[1],
              }}
            ></div>
            <span className="text-sm text-gray-600">Most</span>
          </div>
        </div>
        {loading ? (
          <Loader className="flex flex-row items-center justify-center w-full h-full" />
        ) : (
          <ComposableMap projectionConfig={{ center: [0, -60], scale: 120 }}>
            {data && data.length > 0 && (
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const d = data.find((s) => s.code === geo.id);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={d ? String(colorScale(d["total"])) : "#F5F4F6"}
                      />
                    );
                  })
                }
              </Geographies>
            )}
          </ComposableMap>
        )}
      </div>
    </Card>
  );
};

export default HeatMapChart;
