// components/PieChartHardware.js
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axiosInstance from '../../config/AxiosConfig';
import { AssetCountData } from './types'; // Adjust the path as needed

export default function PieChartHardware() {
  const [isHidden, setIsHidden] = useState(false);

  // const fetchData = async () => {
  //   await axiosInstance.get('/asset/asset_count').then((res) => res)
  // };

  // Wrap the query key 'assetCount' in an object with appropriate options 
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['assetCount'],
    queryFn: ():Promise<{hardware:[], software:[]}> => axiosInstance.get('/asset/asset_count').then((res) => {
      console.log(res);
      return res.data.data
    }),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  const chartData = data.hardware.map((item: AssetCountData) => ({
    label: item.status,
    value: item.count,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Generate random color
  }));
  console.log(chartData);

  return (
    <Stack direction="row">
      <FormControlLabel
        control={
          <Checkbox
            checked={isHidden}
            onChange={(event) => setIsHidden(event.target.checked)}
          />
        }
        label="Hide Legend"
        labelPlacement="end"
      />
      
      <PieChart
        series={[
          {
            data: chartData,
            innerRadius: 60,
            outerRadius: 140,
            paddingAngle: 1,
            cornerRadius: 5,
            startAngle: 0,
            endAngle: 360,
            cx: 100,
            cy:150,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 80, additionalRadius: -50, color: 'gray' },
          },
        ]}
        width={500}
        height={300}
        legend={{
          direction: 'column',
          position: { vertical: 'middle', horizontal: 'right' },
          hidden: isHidden
        }}
      />
    </Stack>
  );
}
