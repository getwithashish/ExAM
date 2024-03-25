import { useState, useEffect } from 'react';
import { fetchAssetData } from '../api/ChartApi';
import { AxisConfig, BarChart } from '@mui/x-charts';
import { AxiosError } from 'axios';
import { MakeOptional } from '@mui/x-charts/models/helpers';

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

  const xAxis: MakeOptional<AxisConfig, "id">[] = [
    { scaleType: "band", data: assetData.map(asset => asset.name) }
  ];
  const series = [{ data: assetData.map(asset => asset.count) }];

  return (
    <div>
      <BarChart
        xAxis={xAxis}
        series={series}
        width={1000}
        height={300}
      />
    </div>
  );
}