import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import { fetchAssetData } from '../api/ChartApi';
import { AssetData, AssetDetailData, ChartData, PieChartGraphProps } from '../types/ChartTypes';
import axiosInstance from '../../../config/AxiosConfig';


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
    'CREATE_PENDING': '#FD6A02',
    'UPDATE_PENDING': '#FD6A02', 
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


    CREATE_PENDING: 'PENDING',
    UPDATE_PENDING: 'PENDING',
    CREATED: 'CREATED',
    UPDATED: 'UPDATED',
    CREATE_REJECTED: 'REJECTED',
    UPDATE_REJECTED: 'REJECTED',
    'IN STORE': 'IN STOCK',
};


const ChartHandlers: React.FC<PieChartGraphProps> = () => {
    const [assetTypeData, setAssetTypeData] = useState<AssetDetailData[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [assetChartData, setAssetChartData] = useState<ChartData[]>([]);
    const [assetFilteredChartData, setAssetFilteredChartData] = useState<ChartData[]>([]);
    const [assignChartData, setAssignChartData] = useState<ChartData[]>([])
    const [assignFilteredChartData, setAssignFilteredChartData] = useState<ChartData[]>([]);
    const [detailChartData, setDetailChartData] = useState<ChartData[]>([]);
    const [detailFilteredChartData, setDetailFilteredChartData] = useState<ChartData[]>([]);
    

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
        fetchAssetData()
            .then(assetCountData => {
                console.log("assetCountData", assetCountData);
                const assetTypeData = Object.entries(assetCountData?.status_counts ?? {}).map(([label, value]) => ({
                    label: statusMapping[label] ?? label,
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
                        const rejectedLabel = 'REJECTED';
                        if (acc[rejectedLabel]) {
                            acc[rejectedLabel].value += value as number;
                        } else {
                            acc[rejectedLabel] = {
                                label: rejectedLabel,
                                value: value as number,
                                color: statusColors[rejectedLabel],
                            };
                        }
                    } else if (mappedLabel === 'CREATE_PENDING' || mappedLabel === 'UPDATE_PENDING') {
                        const pendingLabel = 'PENDING';
                        if (acc[pendingLabel]) {
                            acc[pendingLabel].value += value as number;
                        } else {
                            acc[pendingLabel] = {
                                label: pendingLabel,
                                value: value as number,
                                color: statusColors[pendingLabel],
                            };
                        }
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
        fetchAssetData()
            .then((assetAssignData) => {
                const assetAssignStatusData = Object.entries(assetAssignData?.assign_status ?? {}).map(([label, value]) => ({
                    label: statusMapping[label] ?? label,
                    value: value as number,
                    color: statusColors[label],
                }));
                setAssignChartData(assetAssignStatusData);
                setAssignFilteredChartData(assetAssignStatusData);
            })
            .catch(error => {
                console.error("Error fetching assign details data:", error);
                setAssignFilteredChartData([]);
            });
    }, []);
    
    

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => { 
        const assetTypeValue = parseInt(e.target.value);
        setSelectedType(assetTypeValue.toString());
    
        if (assetTypeValue === 0) {
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
        <div className="flex justify-end">
            <select className="block bg-transparent font-display text-xs text-black-500 appearance-none dark:text-gray-400 dark:border-gray-200 focus:outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleSelectChange}>
                <option value="0" className="text-xs text-black font-display bg-white ">Select an asset type</option>
                {assetTypeData.map((assetType) => (
                    <option key={assetType.id} value={assetType.id} className="text-xs text-black border-0 border-b-2 bg-white font-display">{assetType.asset_type_name}</option>
                ))}
            </select>
        </div>                       
    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
        {/* <Carousel> */}
        <div className='item pt-6 mt-4' style={{ flex: '1 0 300px' }}>
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
            <div className='item pt-6 mt-4' style={{ flex: '1 0 300px' }}>
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
            <div className='item pt-6 mt-4' style={{ flex: '1 0 300px' }}>
                <div className='ml-20'>
                    <span className="font-semibold font-display leading-none text-gray-900 dark:text-white text-lg">
                        Allocation Status
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
        {/* </Carousel>     */}
    </Stack>                    
</Stack>
);
}

export default ChartHandlers;

