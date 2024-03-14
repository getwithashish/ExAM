import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../config/AxiosConfig';
import { AssetDetailStatus, AssetDetailStatusData, ChartData, PieChartAssetGraphProps} from './types/ChartTypes';

export const PieChartAssetDetailGraph: React.FC<PieChartAssetGraphProps> = () => {
  const [assetDetailStatus, setAssetDetailStatus] = useState<AssetDetailStatusData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [filteredChartData, setFilteredChartData] = useState<ChartData[]>([]);
  const [allChartDetailData, setAllChartDetailData] = useState<ChartData[]>([]); // Store all data initially

  const { data: assetDetailStatusData, isLoading: assetDetailStatusLoading, isError: assetDetailStatusError } = useQuery<AssetDetailStatus>({
    queryKey: ['assetDetailStatus'],
    queryFn: (): Promise<AssetDetailStatus> => axiosInstance.get('/asset/asset_count').then((res) => res.data.data),
  });

  const statusColors: { [key: string]: string } = {
    'CREATE_PENDING': '#FD6A02', 
    'UPDATE_PENDING': '#FCE205',
    'CREATED': '#3BB143', 
    'UPDATED': '#808080', 
    'CREATE_REJECTED': '#ED2938',
    'UPDATE_REJECTED': '#E48938',
  };

  useEffect(() => {
    // Fetch asset type data once initially
    axiosInstance.get('/asset/asset_type')
      .then((res) => {
        setAssetDetailStatus(res.data.data);
      })
      .catch(error => {
        console.error("Error fetching asset type data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch all chart data once initially
    axiosInstance.get(`/asset/asset_count`)
      .then((res) => {
        const assetDetailStatusData = res.data.data;
        const allData = Object.entries(assetDetailStatusData?.asset_detail_status ?? {}).map(([label, value]) => ({
          label,
          value: value as number,
          color: statusColors[label] || '#000000', // Default color if not found
        }));
        setAllChartDetailData(allData);
        setFilteredChartData(allData);
      })
      .catch(error => {
        console.error("Error fetching asset detail status data:", error);
        setFilteredChartData([]);
      });
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assetTypeValue = parseInt(e.target.value);
    setSelectedType(assetTypeValue.toString());

    if (assetTypeValue === 0) {
      setFilteredChartData(allChartDetailData);
    } else {
      axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`)
        .then((res) => {
          const assetDetailStatusData = res.data.data;
          const filteredData = Object.entries(assetDetailStatusData?.asset_detail_status ?? {}).map(([label, value]) => ({
            label,
            value: value as number,
            color: statusColors[label] || '#000000', // Default color if not found
          }));
          setFilteredChartData(filteredData);
        })
        .catch(error => {
          console.error("Error fetching asset count data:", error);
          setFilteredChartData([]);
        });
    }
  };

  if (assetDetailStatusLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  );

  if (assetDetailStatusError) return <div>Error fetching data</div>;

  return (
    <Stack direction="row">
      <div>
        {/* <select onChange={handleSelectChange}>
          <option value="0">All</option>
          {assetDetailStatus.map((assetType) => (
            <option key={assetType.id} value={assetType.id}>{assetType.asset_detail_status}</option>
          ))}
        </select> */}
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
              cx: 105,
              cy: 200,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
            },
          ]}
          width={430}
          height={400}
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
