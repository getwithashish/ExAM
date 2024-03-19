import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import axiosInstance from '../../../config/AxiosConfig'; // Import your axios instance here

export default function BarAnimation() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [assetTypeCounts, setAssetTypeCounts] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/asset/asset_count');
        setAssetTypeCounts(response.data.data.asset_type_counts);
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
    return <div>Error....</div>;
  }

  // Extract asset type names and counts from the response
  const types = Object.keys(assetTypeCounts);
  const counts = Object.values(assetTypeCounts);

  return (
    <Box sx={{ width: '100%' }}>
      <BarChart
        height={300}
        series={[
          {
            label: 'Asset Type Counts',
            data: counts,
          },
        ]}
        labels={types} // Set labels as the asset type names
      />
    </Box>
  );
}
