import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../config/AxiosConfig';
import { AssetCountData, ChartData, PieChartGraphProps, AssetTypeData } from './types/ChartTypes';

export const PieChartStatusGraph: React.FC<PieChartGraphProps> = () => {
  const [assetTypeData, setAssetTypeData] = useState<AssetTypeData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [filteredChartData, setFilteredChartData] = useState<ChartData[]>([]);
  const [allChartData, setAllChartData] = useState<ChartData[]>([]); // Store all data initially

  const { data: assetCountData, isLoading: assetCountLoading, isError: assetCountError } = useQuery<AssetCountData>({
    queryKey: ['assetCount'],
    queryFn: (): Promise<AssetCountData> => axiosInstance.get('/asset/asset_count').then((res) => {
      console.log(res);
      return res.data.data;
    }),
  });

  const statusColors: { [key: string]: string } = {
    'IN STORE': '#FD6A02', 
    'IN REPAIR': '#FCE205',
    'IN USE': '#3BB143', 
    'DISPOSED': '#808080', 
    'EXPIRED': '#ED2938', 
  };

  useEffect(() => {
    // Fetch asset type data once initially
    axiosInstance.get('/asset/asset_type')
      .then((res) => {
        console.log(res.data.data);
        setAssetTypeData(res.data.data);
      })
      .catch(error => {
        console.error("Error fetching asset type data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch all chart data once initially
    axiosInstance.get(`/asset/asset_count`)
      .then((res) => {
        const assetCountData = res.data.data;
        const allData = Object.entries(assetCountData?.asset_status ?? {}).map(([label, value]) => ({
          label,
          value: value as number,
          color: statusColors[label],
        }));
        setAllChartData(allData);
        setFilteredChartData(allData);
      })
      .catch(error => {
        console.error("Error fetching asset count data:", error);
        setFilteredChartData([]);
      });
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assetTypeValue = parseInt(e.target.value);
    setSelectedType(assetTypeValue.toString());

    if (assetTypeValue === 0) {

      setFilteredChartData(allChartData);
    } else {
      axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`)
        .then((res) => {
          const assetCountData = res.data.data;
          const filteredData = Object.entries(assetCountData?.asset_status ?? {}).map(([label, value]) => ({
            label,
            value: value as number,
            color: statusColors[label], // Assign color based on status
          }));
          setFilteredChartData(filteredData);
        })
        .catch(error => {
          console.error("Error fetching asset count data:", error);
          setFilteredChartData([]);
        });
    }
  };

  if (assetCountLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  );

  if (assetCountError) return <div>Error fetching data</div>;

  return (
    <Stack direction="row">
      <div>
        <h3 className="text-right font-bold text-gray-600 dark:text-gray-400">
          Total Asset count: {assetCountData?.total_assets ?? 0}
        </h3>
        <select onChange={handleSelectChange}>
          <option value="0">All</option>
          {assetTypeData.map((assetType) => (
            <option key={assetType.id} value={assetType.id}>{assetType.asset_type_name}</option>
          ))}
        </select>
        <PieChart
          series={[
            {
              data: filteredChartData,
              innerRadius: 50,
              outerRadius: 100,
              paddingAngle: 1,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: 130,
              cy: 140,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
            },
          ]}
          width={380}
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
};
