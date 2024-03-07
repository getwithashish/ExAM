import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../config/AxiosConfig';
import { AssetCountData, PieChartGraphProps, ApiResponse, CheckboxChangeEvent } from './types/ChartTypes';

const PieChartGraph: React.FC<PieChartGraphProps> = ({ type }) => {
  const [legendHidden, setLegendHidden] = useState(false);

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['assetCount'],
    queryFn: (): Promise<ApiResponse> => axiosInstance.get('/asset/asset_count').then((res) => {
      console.log(res);
      return res.data.data;
    }),
  });

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  );

  if (isError) return <div>Error fetching data</div>;

  const Shades = ['#304069', '#455e90', '#4f92ef', '#7db1fb', '#b3d2f8'];
  const chartData = type === 'hardware' ? data.hardware.map((item: AssetCountData, index: number) => ({
    label: item.status,
    value: item.count,
    color: Shades[index % Shades.length]
  })) : data.software.map((item: AssetCountData, index: number) => ({
    label: item.status,
    value: item.count,
    color: Shades[index % Shades.length]
  }));

  const handleCheckboxChange = (event: CheckboxChangeEvent) => {
    setLegendHidden(event.target.checked);
  };

  return (
    <Stack direction="row">
      <FormControlLabel
        control={
          <Checkbox
            checked={legendHidden}
            onChange={handleCheckboxChange}
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
          hidden: legendHidden
        }}
      />
    </Stack>
  );
}

export default PieChartGraph;
