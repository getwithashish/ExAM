import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosConfig'; // Import your axios instance here
import { BarChart } from '@mui/x-charts';
import { AxiosError } from 'axios';

export default function BarAnimation() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [assetData, setAssetData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/asset/asset_count');
        const assetCountData = response.data.data;
        const assetDataArray = Object.entries(assetCountData.asset_type_counts || {}).map(([name, count]) => ({
          name: name,
          count: count as number,
        }));
        setAssetData(assetDataArray);
        setLoading(false);
      } catch (error) {
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
    return <div>Error: {error}</div>;
  }

  const xAxis = [{ scaleType: 'band', data: assetData.map(asset => asset.name) }];
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
