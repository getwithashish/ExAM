import { useState, useEffect } from 'react';
import { fetchAssetData } from '../api/ChartApi';
import { AxisConfig, BarChart, barElementClasses } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { AxiosError } from 'axios';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import CircularWithValueLabel from './circularProgessBar';
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

  return (
    <div className='text-center pt-4 items-center'>
      <span className='font-bold font-display text-gray-200 sm:text-sm md:text-md lg:text-lg'>
        INDIVIDUAL ASSET COUNT
      </span>
      <BarChart
        sx={() => ({
          [`.${barElementClasses.root}`]: {
            fill: '#075985',
            strokeWidth: 0,
          },
          [`.${axisClasses.root}`]: {
            '.MuiChartsAxis-line, .MuiChartsAxis-tick': {
              stroke: '#ffffff',
              strokeWidth: 0,
            },
            '.MuiChartsAxis-tickLabel': { 
              fill: '#ffffff',
              fontFamily:'Inter'
            },
          },
        })}
          xAxis={xAxis}
          series={series}
          height={350}
        />
    </div>
  );
}
