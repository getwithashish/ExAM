import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../config/AxiosConfig';
import { AssetCountData, ChartData, PieChartGraphProps, AssetTypeData } from './types/ChartTypes';

export const PieChartGraph: React.FC<PieChartGraphProps> = () => {
  const [assetTypeData, setAssetTypeData] = useState<AssetTypeData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  const { data: assetCountData, isLoading: assetCountLoading, isError: assetCountError } = useQuery<AssetCountData>({
    queryKey: ['assetCount'],
    queryFn: (): Promise<AssetCountData> => axiosInstance.get('/asset/asset_count').then((res) => {
      console.log(res);
      return res.data.data;
    }),
  });

  // Fetch asset types
  useQuery<AssetTypeData[]>({
    queryKey: ['assetType'],
    queryFn: (): Promise<AssetTypeData[]> => axiosInstance.get('/asset/asset_type').then((res) => {
      console.log(res.data.data); // Log the response data
      setAssetTypeData(res.data.data);
      return res.data.data;
    }),
  });

  // Handling loading and error states
  if (assetCountLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  );

  if (assetCountError) return <div>Error fetching data</div>;

  const customColors = ['#FF8C01', '#FFE733', '#65FE08', '#808080', '#ED2938'];

  // Filter asset count data based on selected asset type
  const filteredChartData: ChartData[] = Object.entries(assetCountData?.asset_status ?? {}).map(([label, value], index) => ({
    label,
    value,
    color: customColors[index % customColors.length], // Apply custom colors
  }));

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  return (
    <Stack direction="row">
      <div>
        <h3 className="text-right font-normal text-gray-600 dark:text-gray-400">
          Asset count: {assetCountData?.total_assets ?? 0} {/* Display total asset count */}
        </h3>
        <select value={selectedType} onChange={handleSelectChange}>
          <option value="">Select Asset Type</option>
          {assetTypeData.map((assetType) => (
            <option key={assetType.id} value={assetType.asset_type_name}>{assetType.asset_type_name}</option>
          ))}
        </select>
        <PieChart
          series={[
            {
              data: filteredChartData,
              innerRadius: 60,
              outerRadius: 140,
              paddingAngle: 1,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: 300,
              cy: 150,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 80, additionalRadius: -50, color: 'gray' },
            },
          ]}
          width={700}
          height={300}
          legend={{
            direction: 'column',
            position: { vertical: 'middle', horizontal: 'right' },
            hidden: false
          }}
        />
      </div>
    </Stack>
  );
}
