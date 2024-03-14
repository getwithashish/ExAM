import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../config/AxiosConfig';
import { AssignDetailStatus, AssignDetailStatusData, ChartData, PieChartAssignGraphProps} from './types/ChartTypes';

export const PieChartAssignDetailGraph: React.FC<PieChartAssignGraphProps> = () => {
  const [assetAssignStatus, setAssetAssignStatus] = useState<AssignDetailStatusData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [filteredChartData, setFilteredChartData] = useState<ChartData[]>([]);
  const [allChartAssignData, setAllChartAssignData] = useState<ChartData[]>([]); // Store all data initially

  const { data: assetDetailStatusData, isLoading: assetAssignStatusLoading, isError: assetAssignStatusError } = useQuery<AssignDetailStatus>({
    queryKey: ['assetAssignStatus'],
    queryFn: (): Promise<AssignDetailStatus> => axiosInstance.get('/asset/asset_count').then((res) => res.data.data),
  });

  const statusColors: { [key: string]: string } = {
    'UNASSIGNED': '#FD6A02', 
    'ASSIGN_PENDING': '#FCE205',
    'ASSIGNED': '#3BB143',  
    'REJECTED': '#ED2938',
  };

  useEffect(() => {
    // Fetch asset type data once initially
    axiosInstance.get('/asset/asset_type')
      .then((res) => {
        setAssetAssignStatus(res.data.data);
      })
      .catch(error => {
        console.error("Error fetching asset assign data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch all chart data once initially
    axiosInstance.get(`/asset/asset_count`)
      .then((res) => {
        const assetAssignStatusData = res.data.data;
        const allData = Object.entries(assetAssignStatusData?.assign_status ?? {}).map(([label, value]) => ({
          label,
          value: value as number,
          color: statusColors[label] || '#000000', // Default color if not found
        }));
        setAllChartAssignData(allData);
        setFilteredChartData(allData);
      })
      .catch(error => {
        console.error("Error fetching asset assign status data:", error);
        setFilteredChartData([]);
      });
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assetTypeValue = parseInt(e.target.value);
    setSelectedType(assetTypeValue.toString());

    if (assetTypeValue === 0) {
      setFilteredChartData(allChartAssignData);
    } else {
      axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`)
        .then((res) => {
          const assetAssignStatusData = res.data.data;
          const filteredData = Object.entries(assetAssignStatusData?.assign_status ?? {}).map(([label, value]) => ({
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

  if (assetAssignStatusLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </div>
  );

  if (assetAssignStatusError) return <div>Error fetching data</div>;

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
              cx: 100,
              cy: 200,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
            },
          ]}
          width={410}
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
