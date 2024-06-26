import { useState, useEffect } from 'react';
import { fetchAssetData } from '../api/ChartApi';
import { AxisConfig, BarChart } from '@mui/x-charts';
import { AxiosError } from 'axios';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import CircularWithValueLabel from './circularProgessBar';
import { axisClasses } from "@mui/x-charts";
import { ErrorResponse } from './types';

type Error = AxiosError<ErrorResponse>;

export default function BarChartHandler() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [assetData, setAssetData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetCountData = await fetchAssetData();
        const assetDataArray = Object.entries(assetCountData.asset_type_counts || {}).map(([name, count]) => ({
          name: name,
          count: count as number,
        }));
        setAssetData(assetDataArray);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <CircularWithValueLabel />;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  const xAxis: MakeOptional<AxisConfig, "id">[] = [
    { scaleType: "band", data: assetData.map(asset => asset.name) },
  ];

  const series = [{ data: assetData.map(asset => asset.count) }];

  const chartSetting = {
    sx: {
      [`.${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
        overflow: "visible !important",
      },
      '& .MuiLegend-root': {
        fontSize: '6px',
      },
    },
  };

  return (
    <div className='text-center items-center'>
      <span className='font-medium text-md sm:text-sm md:text-md lg:text-lg'>Individual Asset Count</span>
      <BarChart
        sx={chartSetting.sx}
        xAxis={xAxis}
        series={series}
        height={250}
      />
    </div>
  );
}
