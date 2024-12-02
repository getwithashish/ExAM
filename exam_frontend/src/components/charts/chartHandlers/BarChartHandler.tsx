import { useState, useEffect } from "react";
import { fetchAssetData } from "../api/ChartApi";
import { AxisConfig, BarChart, barElementClasses } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import "./BarChart.css";
import { AxiosError } from "axios";
import { ErrorResponse } from "./types";
import { createTheme } from "@mui/material/styles";
import { DataError, DataLoading } from "./assets";
import { motion } from "framer-motion";
import { Skeleton } from "@mui/material";
import { useTheme } from "../../CustomThemeContext/CustomThemeContext";

type Error = AxiosError<ErrorResponse>;

export default function BarChartHandler({
  triggerRefresh,
  handleBarItemClick,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [assetData, setAssetData] = useState<{ name: string; count: number }[]>(
    []
  );

  const fetchData = async () => {
    try {
      const assetCountData = await fetchAssetData();
      const assetDataArray = Object.entries(
        assetCountData.asset_type_counts || {}
      )
        .map(([name, idAndCount]) => ({
          name: name,
          id: idAndCount.id,
          count: idAndCount.count as number,
        }))
        .sort((a, b) => b.count - a.count);
      setAssetData(assetDataArray);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const xAxis: AxisConfig[] = [
    {
      id: "x-axis",
      scaleType: "band",
      data: assetData.map((asset) => asset.name),
    },
  ];

  const yAxis: AxisConfig[] = [
    {
      id: "y-axis",
      tickNumber: 5,
    },
  ];

  const series = [{ data: assetData.map((asset) => asset.count) }];

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleRefreshOnClick = () => {
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 2000);
  };

  useEffect(() => {
    handleRefreshOnClick();
  }, [triggerRefresh]);

  const handleBarClick = (_, barItem) => {
    handleBarItemClick(assetData[barItem.dataIndex].id);
  };

  const { theme } = useTheme();

  return (
    <div className="text-center items-center">
      {loading || error ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75 }}
        >
          <Skeleton
            className="rounded-lg"
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={200}
            sx={{
              bgcolor: `${
                theme.theme === "dark" ? "transparent" : "rgba(0, 0, 0, 0.05)"
              }`,
              backdropFilter: "blur(10px)",
              border: `${
                theme.theme === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.2)"
                  : "1px solid rgba(0, 0, 0, 0.1)"
              }`,
              boxShadow: `${
                theme.theme === "dark"
                  ? "0px 4px 12px rgba(0, 0, 0, 0.4)"
                  : "0px 4px 12px rgba(0, 0, 0, 0.1)"
              }`,
              "& .MuiSkeleton-wave": {
                background: `${
                  theme.theme === "dark"
                    ? "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0) 100%)"
                    : "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0) 100%)"
                }`,
                animationDuration: "1.5s",
              },
            }}
          />
        </motion.div>
      ) : (
        <div
          className="dark:bg-custom-500 rounded-lg scrollable"
          style={{ overflowX: "auto", boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            <BarChart
              sx={() => ({
                [`.${barElementClasses.root}`]: {
                  fill: "dark:#075985",
                  strokeWidth: 0,
                },
                [`.${axisClasses.root}`]: {
                  ".MuiChartsAxis-line, .MuiChartsAxis-tick": {
                    stroke: "dark:#ffffff",
                    strokeWidth: 0,
                  },
                  ".MuiChartsAxis-tickLabel": {
                    fill: "dark:#ffffff",
                    fontFamily: "Inter",
                  },
                },
              })}
              xAxis={xAxis}
              yAxis={yAxis}
              series={series}
              onAxisClick={handleBarClick}
              height={200}
              width={2800}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
