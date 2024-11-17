import { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { csv } from "d3-fetch";
import { scaleSqrt } from "d3-scale";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Card } from "./ui/card";
import { useApi } from "@/hooks/useApi";
import { getTotalCases } from "@/api/getApis";
import Loader from "./ui/loader";

const geoUrl = "/features.json";

const chartCols = [
  {
    id: "total_cases",
    label: "Total Cases",
  },
  {
    id: "total_deaths",
    label: "Total Deaths",
  },
  { id: "total_tests", label: "Total Tests" },
];

type MergedDataType = {
  lat: number;
  lng: number;
  country: string;
  total: number;
};

const WorldMap = () => {
  const [mergedData, setMergedData] = useState<MergedDataType[]>([]);
  const [activeChart, setActiveChart] = useState(chartCols[0].id);

  const { data, loading } = useApi(() => {
    return getTotalCases(activeChart.toString());
  }, [activeChart]);

  useEffect(() => {
    // Load country centroids
    csv("/long_lat.csv").then((centroids) => {
      // Create a mapping from country name to coordinates
      const countryCoords: { [key: string]: { lat: number; lng: number } } = {};
      centroids.forEach((d) => {
        countryCoords[d.Country] = {
          lat: +d.Latitude,
          lng: +d.Longitude,
        };
      });

      // Merge COVID data with coordinates
      if (data && data.length > 0) {
        const dataWithCoords = data
          .map((d) => {
            const coords = countryCoords[d.country];
            if (coords) {
              return {
                ...d,
                ...coords,
              };
            } else {
              return null;
            }
          })
          .filter((d) => d !== null); // Remove entries without coordinates
        setMergedData(dataWithCoords);
      }
    });
  }, [data]);

  const maxCases = useMemo(
    () =>
      Math.max(
        ...mergedData.map((d) => (typeof d.total === "number" ? d.total : 0))
      ),
    [mergedData]
  );

  // Create a scale for marker sizes
  const sizeScale = useMemo(
    () => scaleSqrt().domain([0, maxCases]).range([0, 20]),
    [maxCases]
  );

  return (
    <Card className="flex flex-col items-center h-[43vw] overflow-y-hidden my-5">
      <div className="w-full flex flex-row flex-wrap ">
        {chartCols.map((key) => {
          const chart = key.id;
          return (
            <div
              key={chart}
              className={`cursor-pointer flex w-1/3 flex-col justify-center gap-1 border-t lg:px-6 py-4 text-center even:border-l ${activeChart === chart ? "bg-slate-50" : "hover:text-slate-500"}`}
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-sm font-bold text-muted-foreground">
                {key.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full py-4 h-full bg-slate-50">
        {loading ? (
          <Loader className="flex flex-row items-center justify-center w-full h-full" />
        ) : (
          <>
            <ComposableMap projectionConfig={{ center: [0, -60], scale: 120 }}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} fill="#DDD" />
                  ))
                }
              </Geographies>
              {mergedData.length > 0 &&
                mergedData.map(({ country, lng, lat, total }) => (
                  <Marker key={country} coordinates={[lng, lat]}>
                    <circle
                      fill="#F53"
                      stroke="#FFF"
                      strokeWidth={0.5}
                      r={sizeScale(total)}
                      data-tooltip-id="tooltip"
                      data-tooltip-content={`${country}: ${total} cases`}
                    />
                    {/* <title>{`${country}: ${totalCases} cases`}</title> */}
                  </Marker>
                ))}
            </ComposableMap>
            <ReactTooltip id="tooltip" />
          </>
        )}
      </div>
    </Card>
  );
};

export default WorldMap;
