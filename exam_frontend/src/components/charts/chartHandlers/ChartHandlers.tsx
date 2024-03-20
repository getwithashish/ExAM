import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import { fetchAssetData } from '../api/ChartApi';
import { AssetData, AssetDetailData, ChartData, PieChartGraphProps } from '../types/ChartTypes';
import axiosInstance from '../../../config/AxiosConfig';
import Carousel from './ChartCarousel';


const statusColors: { [key: string]: string } = {
    'IN STORE': '#FFB92A',
    'IN REPAIR': '#FEEB51',
    'IN USE': '#9BCA3E',
    'DISPOSED': '#3ABBC9',
    'EXPIRED': '#CC0000',
    'UNASSIGNED': '#E6E6E6',
    'ASSIGN_PENDING': '#FFB92A',
    'ASSIGNED': '#9BCA3E',
    'REJECTED': '#CC0000',
    'CREATE_PENDING': '#FD6A02', // Consider using the same color for both 'CREATE_PENDING' and 'UPDATE_PENDING'
    'UPDATE_PENDING': '#FD6A02', // Consider using the same color for both 'CREATE_PENDING' and 'UPDATE_PENDING'
    'CREATED': '#9BCA3E',
    'UPDATED': '#3ABBC9',
    'CREATE_REJECTED': '#CC0000',
    'UPDATE_REJECTED': '#CC0000',
};


const statusMapping: { [key: string]: string } = {
    UNASSIGNED: 'UNASSIGNED',
    ASSIGN_PENDING: 'PENDING',
    ASSIGNED: 'ASSIGNED',
    REJECTED: 'REJECTED',
    CREATE_PENDING: 'PENDING', // Combine both 'CREATE_PENDING' and 'UPDATE_PENDING' into 'PENDING'
    UPDATE_PENDING: 'PENDING', // Combine both 'CREATE_PENDING' and 'UPDATE_PENDING' into 'PENDING'
    CREATED: 'CREATED',
    UPDATED: 'UPDATED',
    CREATE_REJECTED: 'REJECTED',
    UPDATE_REJECTED: 'REJECTED',
};


const ChartHandlers: React.FC<PieChartGraphProps> = () => {
     // State variables to store data and manage loading/error states
    const [assetTypeData, setAssetTypeData] = useState<AssetDetailData[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [assetChartData, setAssetChartData] = useState<ChartData[]>([]);
    const [assetFilteredChartData, setAssetFilteredChartData] = useState<ChartData[]>([]);
    const [assignChartData, setAssignChartData] = useState<ChartData[]>([])
    const [assignFilteredChartData, setAssignFilteredChartData] = useState<ChartData[]>([]);
    const [detailChartData, setDetailChartData] = useState<ChartData[]>([]);
    const [detailFilteredChartData, setDetailFilteredChartData] = useState<ChartData[]>([]);
    



    // UseQuery hook to fetch asset data from the server
    const { data: assetData, isLoading: assetLoading, isError: assetError } = useQuery<AssetData>({
        queryKey: ['assetData'],
        queryFn: fetchAssetData,
    })

    useEffect(() => {
        axiosInstance.get('/asset/asset_type')
          .then((res) => {
            setAssetTypeData(res.data.data);
          })
          .catch(error => {
            console.error("Error fetching asset data:", error);
          });
      }, []);


      useEffect(() => {
        axiosInstance.get(`/asset/asset_count`)
            .then((res) => {
                const assetCountData = res.data.data;
                console.log("assetCountData", assetCountData);
                const assetTypeData = Object.entries(assetCountData?.status_counts ?? {}).map(([label, value]) => ({
                    label,
                    value: value as number,
                    color: statusColors[label],
                }));
                setAssetChartData(assetTypeData);
                setAssetFilteredChartData(assetTypeData);
            })
            .catch(error => {
                console.error("Error fetching asset count data:", error);
                setAssetFilteredChartData([]);
            });
        return () => {};
    }, []);


    useEffect(() => {
        axiosInstance.get(`/asset/asset_count`)
            .then((res) => {
                const assetDetailData = res.data.data;
                const assetDetailStatusData = Object.entries(assetDetailData?.asset_detail_status ?? {}).reduce((acc, [label, value]) => {
                    const mappedLabel = statusMapping[label] ?? label;
                    if (mappedLabel === 'CREATE_REJECTED' || mappedLabel === 'UPDATE_REJECTED') {
                        acc['REJECTED'] = (acc['REJECTED'] as number || 0) + (value as number);
                    } else {
                        if (acc[mappedLabel]) {
                            acc[mappedLabel].value += value as number;
                        } else {
                            acc[mappedLabel] = {
                                label: mappedLabel,
                                value: value as number,
                                color: statusColors[label],
                            };
                        }
                    }
                    return acc;
                }, {} as { [key: string]: ChartData });
    
                const assetDetailStatusArray: ChartData[] = Object.values(assetDetailStatusData);
    
                setDetailChartData(assetDetailStatusArray);
                setDetailFilteredChartData(assetDetailStatusArray);
            })
            .catch(error => {
                console.error("Error fetching asset details data:", error);
                setDetailFilteredChartData([]);
            })
    }, []);
    
    
    
    useEffect(() => {
        axiosInstance.get(`/asset/asset_count`)
            .then((res) => {
                const assetAssignData = res.data.data ?? {}; // Provide an empty object as default value
                const assetAssignStatusData = Object.entries(assetAssignData?.assign_status ?? {}).map(([label, value]) => {
                    const mappedLabel = statusMapping[label] ?? label;
                    if (mappedLabel === 'UPDATE_PENDING' || mappedLabel === 'CREATE_PENDING') {
                        return {
                            label: 'PENDING',
                            value: value as number,
                            color: statusColors[mappedLabel], // Use 'mappedLabel' to get the color
                        };
                    } else {
                        return {
                            label: mappedLabel,
                            value: value as number,
                            color: statusColors[label],
                        };
                    }
                });
                // Calculate the sum for 'PENDING' status
                const pendingSum = assetAssignStatusData.reduce((acc, curr) => {
                    if (curr.label === 'PENDING') {
                        acc += curr.value;
                    }
                    return acc;
                }, 0);
                // Find the index of 'PENDING' status
                let pendingIndex = assetAssignStatusData.findIndex(status => status.label === 'PENDING');
                // If 'PENDING' status exists, update its value with the sum
                if (pendingIndex === -1) {
                    // If 'PENDING' status does not exist, add it to the array with the computed sum
                    assetAssignStatusData.push({
                        label: 'PENDING',
                        value: pendingSum,
                        color: statusColors['PENDING'], // Use the color for 'PENDING' status
                    });
                    // Set the pendingIndex to the newly added element's index
                    pendingIndex = assetAssignStatusData.length - 1;
                } else {
                    // If 'PENDING' status exists, update its value with the sum
                    assetAssignStatusData[pendingIndex].value = pendingSum;
                }
                setAssignChartData(assetAssignStatusData);
                setAssignFilteredChartData(assetAssignStatusData);
            })
            .catch(error => {
                console.error("Error fetching assign details data:", error);
                setAssignFilteredChartData([]);
            });
    }, []);
    

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => { // Handler function for select change event
        const assetTypeValue = parseInt(e.target.value);
        setSelectedType(assetTypeValue.toString());
    
        if (assetTypeValue === 0) {
            // Set all charts to use their original data
            setAssetFilteredChartData(assetChartData);
            setDetailFilteredChartData(detailChartData);
            setAssignFilteredChartData(assignChartData);
        } else {
            Promise.all([
                axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`),
                axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`),
                axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`)
            ]).then(([assetRes, detailRes, assignRes]) => {
                const assetCountData = assetRes.data.data;
                const detailCountData = detailRes.data.data;
                const assignCountData = assignRes.data.data;

                const assetFilteredData = Object.entries(assetCountData?.status_counts ?? {}).map(([label, value]) => ({
                    label,
                    value: value as number,
                    color: statusColors[label],
                }));
                setAssetFilteredChartData(assetFilteredData);

                const detailFilteredData = Object.entries(detailCountData?.asset_detail_status ?? {}).map(([label, value]) => ({
                    label: statusMapping[label] ?? label,
                    value: value as number,
                    color: statusColors[label],
                }));
                setDetailFilteredChartData(detailFilteredData);

                const assignFilteredData = Object.entries(assignCountData?.assign_status ?? {}).map(([label, value]) => ({
                    label: statusMapping[label] ?? label,
                    value: value as number,
                    color: statusColors[label],
                }));
                setAssignFilteredChartData(assignFilteredData);
            }).catch(error => {
                console.error("Error fetching data:", error);
                setAssetFilteredChartData([]);
                setDetailFilteredChartData([]);
                setAssignFilteredChartData([]);
            });
        }
    }    

    if (assetLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        </div>
    );

    if (assetError) return <div>Error fetching data</div>;

    

    return (
    <Stack>
        <div className='ml-24'>
            <div className='mt-4 flex'>
                <div className='flex-1 ml-8 mt-1 p-1'>
                    <span className="text-black font-display font-semibold text-lg">Select an Asset: </span>
                </div>
                <div className='flex-1'>
                    <select className="block bg-transparent font-display text-black-500 appearance-none dark:text-gray-400 dark:border-gray-200 focus:outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleSelectChange}>
                        <option value="0" className="text-black font-display bg-white ">View all</option>
                        {assetTypeData.map((assetType) => (
                            <option key={assetType.id} value={assetType.id} className="text-black border-0 border-b-2 bg-white font-display">{assetType.asset_type_name}</option>
                        ))}
                    </select>
                </div>               
            </div>        
        </div>               
    <Stack direction="row">
        <Carousel>
        <div className='item pt-6 mt-4 mx-24'>
                <div className='ml-20'>
                    <span className="font-semibold font-display leading-none text-gray-900 dark:text-white text-lg">
                        Asset Status
                    </span>  
                </div>  
                <PieChart
                    margin={{ top: 10, bottom: 0, left: 10, right:0}}
                    series={[
                        {
                            data: assetFilteredChartData,
                            innerRadius: 60,
                            outerRadius: 140,
                            paddingAngle: 2,
                            cornerRadius: 10,
                            startAngle: -110,
                            endAngle: 110,
                            cx:130,
                            cy: 155,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={300}
                    height={280}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 11,
                            },
                            itemMarkWidth: 8,
                            itemMarkHeight: 12  ,
                            markGap: 2,
                            itemGap: 8,
                        }
                    }}
                />
            </div>
            <div className='item pt-6 mt-4 mx-24'>
                <div className='ml-20'>
                    <span className="font-semibold font-display leading-none text-gray-900 dark:text-white text-lg">
                        Approval Status
                    </span>  
                </div>
                <PieChart
                    margin={{ top: 10, bottom: 0, left: 10, right:0}}
                    series={[
                        {
                            data: detailFilteredChartData,
                            innerRadius: 60,
                            outerRadius: 140,
                            paddingAngle: 2,
                            cornerRadius: 10,
                            startAngle: -110,
                            endAngle: 110,
                            cx:130,
                            cy: 155,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={300}
                    height={280}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 11,
                            },
                            itemMarkWidth: 8,
                            itemMarkHeight: 12  ,
                            markGap: 2,
                            itemGap: 8,
                        }
                    }}
                />
            </div>
            <div className='item pt-6 mt-4 mx-24'>
                <div className='ml-20'>
                    <span className="font-semibold font-display leading-none text-gray-900 dark:text-white text-lg">
                        Assign Status
                    </span>  
                </div>
                <PieChart
                    margin={{ top: 10, bottom: 0, left: 10, right:0}}
                    series={[
                        {
                            data: assignFilteredChartData,
                            innerRadius: 60,
                            outerRadius: 140,
                            paddingAngle: 2,
                            cornerRadius: 10,
                            startAngle: -110,
                            endAngle: 110,
                            cx:130,
                            cy: 155,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={300}
                    height={280}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 11,
                            },
                            itemMarkWidth: 8,
                            itemMarkHeight: 12  ,
                            markGap: 2,
                            itemGap: 8,
                        }
                    }}
                />
            </div>
        </Carousel>    
    </Stack>                    
</Stack>
);
}

export default ChartHandlers;

