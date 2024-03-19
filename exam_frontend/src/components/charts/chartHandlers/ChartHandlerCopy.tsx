import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import { fetchAssetData } from '../api/ChartApi';
import { AssetData, AssetDetailData, ChartData, PieChartGraphProps } from '../types/ChartTypes';
import axiosInstance from '../../../config/AxiosConfig';
import { BarChart } from '@mui/x-charts/BarChart';


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
    'UPDATE_PENDING': '#FEEB51',
    'CREATED': '#9BCA3E',
    'UPDATED': '#3ABBC9',
    'CREATE_REJECTED': '#CC0000',
    'UPDATE_REJECTED': '#E6E6E6',
}

const statusMapping: { [key: string]: string } = {
    UNASSIGNED: 'UNASSIGNED',
    ASSIGN_PENDING: 'ASSIGN PENDING',
    ASSIGNED: 'ASSIGNED',
    REJECTED: 'REJECTED',
    CREATE_PENDING: 'PENDING(creation)',
    UPDATE_PENDING: 'PENDING(updation)',
    CREATED: 'CREATED',
    UPDATED: 'UPDATED',
    CREATE_REJECTED: 'REJECTED(creation)',
    UPDATE_REJECTED: 'REJECTED(updation)',
}

const ChartHandlers: React.FC<PieChartGraphProps> = () => {
     // State variables to store data and manage loading/error states
    const [assetTypeData, setAssetTypeData] = useState<AssetDetailData[]>([]);
    const [typeName, setTypeName] = useState<string[]>([]);
    const [typeCount, setTypeCount] = useState<number[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [assetChartData, setAssetChartData] = useState<ChartData[]>([]);
    const [assetFilteredChartData, setAssetFilteredChartData] = useState<ChartData[]>([]);
    const [detailChartData, setDetailChartData] = useState<ChartData[]>([]);
    const [detailFilteredChartData, setDetailFilteredChartData] = useState<ChartData[]>([]);
    const [assignChartData, setAssignChartData] = useState<ChartData[]>([])
    const [assignFilteredChartData, setAssignFilteredChartData] = useState<ChartData[]>([]);

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
                console.error("Error fetching asset data:", error)
            });
    }, []);

    useEffect(() => {
        axiosInstance.get('/asset/asset_count')
            .then((res) => {
                console.log("hi")
                const TypeCount = res.data.data.asset_type_counts;
                console.log("count",res.data.data.asset_type_counts)
                const types: string[] = Object.keys(TypeCount);
                const counts: number[] = Object.values(TypeCount);
                setTypeName(types);
                setTypeCount(counts);
                console.log("types", types)
            })
            .catch(error => {
                console.error("Error fetching asset type counts:", error)
            });
    }, []);

    useEffect(() => { // Effects to fetch asset count, detail, and assign data when component mounts
        axiosInstance.get(`/asset/asset_count`)
            .then((res) => {
                const assetCountData = res.data.data;
                console.log("hi", assetCountData)
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
            })
    }, []);

    useEffect(() => {
        axiosInstance.get(`/asset/asset_count`)
            .then((res) => {
                const assetDetailData = res.data.data;
                const assetDetailStatusData = Object.entries(assetDetailData?.asset_detail_status ?? {}).map(([label, value]) => ({
                    label: statusMapping[label] ?? label,
                    value: value as number,
                    color: statusColors[label],
                }));
                setDetailChartData(assetDetailStatusData);
                setDetailFilteredChartData(assetDetailStatusData);
            })
            .catch(error => {
                console.error("Error fetching asset details data:", error);
                setDetailFilteredChartData([]);
            })
    }, []);

    useEffect(() => {
        axiosInstance.get(`/asset/asset_count`)
            .then((res) => {
                const assetAssignData = res.data.data;
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
            })
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

    return ( // Render the PieChart components with filtered data
        <Stack>
            <div className='flex'>
                <div className='flex-1'>
                    <select className="block py-2 px-2 mx-4 font-display text-black-500 border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer" onChange={handleSelectChange}>
                        <option value="0" className="text-black font-display">All</option>
                        {assetTypeData.map((assetType) => (
                            <option key={assetType.id} value={assetType.id} className="text-black font-display">{assetType.asset_type_name}</option>
                        ))}
                    </select>
                </div>
                <div className='flex-1 mx-6 font-display'>
                    <h2 className='text-right text-sm font-semibold font-display text-gray-600 dark:text-white-600 rtl:text-right'>
                        Total Assets : {assetData?.total_assets ?? 0}
                    </h2>
                </div>                
            </div> 
            <Stack direction="row">
            <div>
                <div className='h-5 my-8 mx-20'>
                    <span className="font-semibold font-display mx-4 underline leading-none text-gray-900 dark:text-white text-lg">
                        Status of Assets
                    </span>
                </div> 
                <PieChart
                    margin={{ top: -40, bottom: 0, left: 30, right:0}}
                    series={[
                        {
                            data: assetFilteredChartData,
                            innerRadius: 50,
                            outerRadius: 120,
                            paddingAngle: 2,
                            cornerRadius: 10,
                            startAngle: 0,
                            endAngle: 360,
                            cx:130,
                            cy: 160,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={340}
                    height={300}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'left' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 11,
                            },
                            itemMarkWidth: 8,
                            itemMarkHeight: 10,
                            markGap: 2,
                            itemGap: 4,
                        }
                    }}
                />
            </div>
            <div>
                <div className='h-5 my-8 mx-20'>
                    <span className="font-semibold font-display mx-4 underline leading-none text-gray-900 dark:text-white text-lg">
                        Status of Assets
                    </span>
                </div> 
                <PieChart
                    margin={{ top: -40, bottom: 0, left: 40, right:0}}
                    series={[
                        {
                            data: detailFilteredChartData,
                            innerRadius: 50,
                            outerRadius: 120,
                            paddingAngle: 2,
                            cornerRadius: 10,
                            startAngle: 0,
                            endAngle: 360,
                            cx:130,
                            cy: 160,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={340}
                    height={300}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 11,
                            },
                            itemMarkWidth: 8,
                            itemMarkHeight: 10,
                            markGap: 2,
                            itemGap: 4,
                        }
                    }}
                />
            </div>
            <div>
                <div className='h-5 my-8 mx-20'>
                    <span className="font-semibold font-display mx-4 underline leading-none text-gray-900 dark:text-white text-lg">
                        Assign Status Count
                    </span>
                </div> 
                <PieChart
                    margin={{ top: -40, bottom: 0, left: 40, right:0}}
                    series={[
                        {
                            data: assignFilteredChartData,
                            innerRadius: 50,
                            outerRadius: 120,
                            paddingAngle: 2,
                            cornerRadius: 10,
                            startAngle: 0,
                            endAngle: 360,
                            cx:130,
                            cy: 160,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={340}
                    height={300}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'middle' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 11,
                            },
                            itemMarkWidth: 8,
                            itemMarkHeight: 10,
                            markGap: 2,
                            itemGap: 4,
                        }
                    }}
                />
            </div>
            </Stack>
            <Stack direction="row">
                <div style={{ position: "relative" }} className='py-10'>
                    <BarChart
                        width={1000}
                        height={300}
                        series={[{ data: typeCount, label: "Individual Asset count", id: "assetTypeCountId" }]}
                        xAxis={[{ data: typeName, scaleType: "band" }]}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "0",
                            left: "50%",
                            transform: "translateX(-70%) rotate(0deg)",
                            textAlign: "center",
                        }}
                    >
                        Asset Types
                    </div>
                </div>                
            </Stack>                      
        </Stack>
    );
}

export default ChartHandlers;