import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../config/AxiosConfig';
import { AssetData, ChartData, PieChartGraphProps, AssetDetailData } from './types/ChartTypes';

export const PieChartGraph: React.FC<PieChartGraphProps> = () => {
    const [assetTypeData, setAssetTypeData] = useState<AssetDetailData[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [assetChartData, setAssetChartData] = useState<ChartData[]>([]);
    const [assetFilteredChartData, setAssetFilteredChartData] = useState<ChartData[]>([]);
    const [detailChartData, setDetailChartData] = useState<ChartData[]>([]);
    const [detailFilteredChartData, setDetailFilteredChartData] = useState<ChartData[]>([]);
    const [assignChartData, setAssignChartData] = useState<ChartData[]>([])
    const [assignFilteredChartData, setAssignFilteredChartData] = useState<ChartData[]>([]);

    const { data: assetData, isLoading: assetLoading, isError: assetError } = useQuery<AssetData>({
        queryKey: ['assetData'],
        queryFn: (): Promise<AssetData> => axiosInstance.get('/asset/asset_count').then((res) => {
            console.log(res);
            return res.data.data;
        }),
    })

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

    useEffect(() => {
        axiosInstance.get('/asset/asset_type')
            .then((res) => {
                console.log(res.data.data);
                setAssetTypeData(res.data.data);
            })
            .catch(error => {
                console.error("Error fetching asset data:", error)
            });
    }, []);

    useEffect(() => {
        axiosInstance.get(`/asset/asset_count`)
            .then((res) => {
                const assetCountData = res.data.data;
                const assetTypeData = Object.entries(assetCountData?.asset_status ?? {}).map(([label, value]) => ({
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
                    label,
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
                    label,
                    value: value as number,
                    color: statusColors[label],
                }));
                setAssignChartData(assetAssignStatusData);
                setAssignFilteredChartData(assetAssignStatusData);
            })
            .catch(error => {
                console.log("Error fetching assign details data:", error);
                setAssignFilteredChartData([]);
            })
    }, []);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const assetTypeValue = parseInt(e.target.value);
        setSelectedType(assetTypeValue.toString());
    
        if (assetTypeValue === 0) {
            // Set all charts to use their original data
            setAssetFilteredChartData(assetChartData);
            setDetailFilteredChartData(detailChartData);
            setAssignFilteredChartData(assignChartData);
        } else {
            axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`)
                .then((res) => {
                    const assetCountData = res.data.data;
                    const assetFilteredData = Object.entries(assetCountData?.asset_status ?? {}).map(([label, value]) => ({
                        label,
                        value: value as number,
                        color: statusColors[label],
                    }));
                    setAssetFilteredChartData(assetFilteredData);
                })
                .catch(error => {
                    console.log("Error fetching asset count data:", error);
                    setAssetFilteredChartData([])
                });
    
            axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`)
                .then((res) => {
                    const assetDetailData = res.data.data;
                    const assetDetailStatusData = Object.entries(assetDetailData?.asset_detail_status ?? {}).map(([label, value]) => ({
                        label,
                        value: value as number,
                        color: statusColors[label],
                    }));
                    setDetailFilteredChartData(assetDetailStatusData);
                })
                .catch(error => {
                    console.error("Error fetching asset detail status data:", error);
                    setDetailFilteredChartData([]);
                });
    
            axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`)
                .then((res) => {
                    const assetAssignData = res.data.data;
                    const assetAssignStatusData = Object.entries(assetAssignData?.assign_status ?? {}).map(([label, value]) => ({
                        label,
                        value: value as number,
                        color: statusColors[label],
                    }));
                    setAssignFilteredChartData(assetAssignStatusData);
                })
                .catch(error => {
                    console.error("Error fetching assign status data:", error);
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
        <Stack direction="row">
            <div>
                <select className="block py-2.5 px-0 w-full text-sm text-black-500 border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer" onChange={handleSelectChange}>
                    <option value="0" className="text-black">All</option>
                    {assetTypeData.map((assetType) => (
                        <option key={assetType.id} value={assetType.id} className="text-black">{assetType.asset_type_name}</option>
                    ))}
                </select>
            </div>  
                    
            <div>   
                <PieChart
                    margin={{ top: 0, bottom: 10, left: 0, right:0}}
                    series={[
                        {
                            data: assetFilteredChartData,
                            innerRadius: 50,
                            outerRadius: 120,
                            paddingAngle: 5,
                            cornerRadius: 10,
                            startAngle: -100,
                            endAngle: 100,
                            cx:140,
                            cy: 160,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={300}
                    height={220}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'left' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 9,
                            },
                            itemMarkWidth: 5,
                            itemMarkHeight: 5,
                            markGap: 3,
                            itemGap: 4,
                        }
                    }}
                />
            </div>
            <div>
            <PieChart
                    margin={{ top: 0, bottom: 10, left: 0, right:0}}
                    series={[
                        {
                            data: detailFilteredChartData,
                            innerRadius: 50,
                            outerRadius: 120,
                            paddingAngle: 5,
                            cornerRadius: 10,
                            startAngle: -100,
                            endAngle: 100,
                            cx:140,
                            cy: 160,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={300}
                    height={230}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'left' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 9,
                            },
                            itemMarkWidth: 5,
                            itemMarkHeight: 5,
                            markGap: 5,
                            itemGap: 4,
                        }
                    }}
                />
            </div>
            <div>
            <h2 className='text-right text-lg font-bold text-gray-600 dark:text-white-600 rtl:text-left italic'>
                    Total Assets : {assetData?.total_assets ?? 0}
                </h2>
                <PieChart
                    margin={{ top: 0, bottom: 10, left: 0, right:0}}
                    series={[
                        {
                            data: assignFilteredChartData,
                            innerRadius: 50,
                            outerRadius: 120,
                            paddingAngle: 5,
                            cornerRadius: 10,
                            startAngle: -100,
                            endAngle: 100,
                            cx:130,
                            cy: 130,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 75, additionalRadius: -40, color: 'grey' },
                        },
                    ]}
                    width={300}
                    height={210}
                    slotProps={{
                        legend: {
                            direction: 'row',
                            position: { vertical: 'bottom', horizontal: 'left' },
                            hidden: false,
                            labelStyle: {
                                fontSize: 9,
                            },
                            itemMarkWidth: 5,
                            itemMarkHeight: 5,
                            markGap: 3,
                            itemGap: 5,
                        }
                    }}
                />
            </div>
        </Stack>
    );
}
