import { useState, useEffect } from 'react';
import { fetchAssetData } from '../api/ChartApi';
import { AxisConfig, BarChart, barElementClasses } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { AxiosError } from 'axios';
import { ErrorResponse } from './types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RefreshTwoTone } from '@mui/icons-material';
import { DataError, DataLoading } from './assets';

type Error = AxiosError<ErrorResponse>;

export default function BarChartHandler() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [assetData, setAssetData] = useState<{ name: string; count: number }[]>([]);

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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <DataLoading />;
  }

  if (error) {
    return <DataError />;
  }

  const xAxis: AxisConfig[] = [
    { id: 'x-axis', scaleType: 'band', data: assetData.map(asset => asset.name) },
  ];
  const series = [{ data: assetData.map(asset => asset.count) }];

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleRefreshOnClick = () => {
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 2000);
  };

  return (
    <div className='text-center pt-4 items-center'>
      <div className="flex">
        <div className='flex-1 font-bold text-center items-center justify-center font-display text-gray-200 sm:text-sm md:text-md lg:text-lg'>
          Individual Asset Count
        </div>
        <div className='items-center justify-end mx-4'>
          <RefreshTwoTone
            onClick={handleRefreshOnClick}
            style={{
              cursor: "pointer",
              marginLeft: "10px",
              width: "30px",
              height: "40px",
              color: '#ffffff'
            }}
          />
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <ThemeProvider theme={darkTheme}>
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
                  fontFamily: 'Inter'
                },
              },
            })}
            xAxis={xAxis}
            series={series}
            height={350}
            width={2500}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
