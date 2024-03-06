import { useState } from 'react'; 
import { useQuery } from '@tanstack/react-query'; 
import Stack from "@mui/material/Stack"; 
import { PieChart } from "@mui/x-charts/PieChart"; 
import FormControlLabel from '@mui/material/FormControlLabel'; 
import Checkbox from '@mui/material/Checkbox';
import axiosInstance from '../../config/AxiosConfig'; 
import { AssetCountData } from './types'; 

export default function PieChartGraph() {
  const [legendHidden, setLegendHidden] = useState(false); // State for controlling legend visibility

  const { data, isLoading, isError } = useQuery<{ hardware: AssetCountData[], software: AssetCountData[] }>({ // Fetching data using useQuery hook
    queryKey: ['assetCount'], // Key for identifying the query
    queryFn: (): Promise<{ hardware: AssetCountData[], software: AssetCountData[] }> => axiosInstance.get('/asset/asset_count').then((res) => { // Function to execute the query
      console.log(res); // Logging the response from the API
      return res.data.data; // Returning the data from the response
    }),
  });
  
  if (isLoading) return <div>Loading...</div>; // Render loading indicator while data is being fetched
  if (isError) return <div>Error fetching data</div>; // Render error message if data fetching fails
  
  const Shades = ['#304069', '#455e90', '#4f92ef', '#7db1fb', '#b3d2f8']; 
  const chartData = data.hardware.map((item: AssetCountData, index: number) => ({ // Processing data for chart
    label: item.status,
    value: item.count,
    color: Shades[index % Shades.length] // Assigning shades of blue without repetition
  }));
  console.log(chartData); // Logging the chart data

  return (
    <Stack direction="row"> {/* Stack for arranging components horizontally */}
      <FormControlLabel // Checkbox for toggling legend visibility
        control={
          <Checkbox
            checked={legendHidden}
            onChange={() => setLegendHidden(!legendHidden)} // Toggle legend visibility when checkbox state changes
          />
        }
        label="Hide Legend" // Label for the checkbox
        labelPlacement="end" // Positioning of the label
      />
      
      <PieChart // Rendering the PieChart component
        series={[
          {
            data: chartData, // Data for the chart
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
          hidden: legendHidden // Hiding legend based on state
        }}
      />
    </Stack>
  );
}
