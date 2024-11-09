import { useState, useEffect } from "react";
import { fetchAssetData } from "../api/ChartApi";
import { AxisConfig, BarChart, barElementClasses } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import "./BarChart.css";
import { AxiosError } from "axios";
import { ErrorResponse } from "./types";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataError, DataLoading } from "./assets";
import { motion } from "framer-motion";
import { Skeleton } from "@mui/material";

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

  if (error) {
    return <DataError />;
  }

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

  return (
    <div className="text-center items-center">
      {loading ? (
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
          />
        </motion.div>
      ) : (
        <div
          className="bg-custom-500 rounded-lg scrollable"
          style={{ overflowX: "auto", boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
        >
          <ThemeProvider theme={darkTheme}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
            >
              <BarChart
                sx={() => ({
                  [`.${barElementClasses.root}`]: {
                    fill: "#075985",
                    strokeWidth: 0,
                  },
                  [`.${axisClasses.root}`]: {
                    ".MuiChartsAxis-line, .MuiChartsAxis-tick": {
                      stroke: "#ffffff",
                      strokeWidth: 0,
                    },
                    ".MuiChartsAxis-tickLabel": {
                      fill: "#ffffff",
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
          </ThemeProvider>
        </div>
      )}
    </div>
  );
}
