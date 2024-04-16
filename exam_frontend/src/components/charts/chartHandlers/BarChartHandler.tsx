import React, { useState, useEffect } from 'react';
import { fetchAssetData } from '../api/ChartApi';
import { AxisConfig, BarChart, LineChart } from '@mui/x-charts';
import { AxiosError } from 'axios';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

interface ErrorResponse {
  message: string;  
}

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
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }
  
  return (
    <Box sx={{ width: '100%', height: 280 }}>
    <ResponsiveChartContainer
      series={[
        {
          type: 'bar',
          data: assetData.map(asset => asset.count),
        },
      ]}
      xAxis={[
        {
          data: assetData.map(asset => asset.name) ,
          scaleType: 'band',
          id: 'x-axis-id',
        },
      ]}
    >
      <BarPlot />
      <LinePlot />
      <MarkPlot />
      <ChartsXAxis 
        label="Individual Asset Count" 
        position="bottom" 
        axisId="x-axis-id" 
      />   
    </ResponsiveChartContainer>
  </Box>
  );
}
