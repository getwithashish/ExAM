import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../config/AxiosConfig';
import { AssetData, ChartData, PieChartGraphProps, AssetDetailData } from './types/ChartTypesCopy';

export const PieChartGraph: React.FC<PieChartGraphProps> = () => {
    const [assetTypeData, setAssetTypeData] = useState<AssetDetailData[]>([]);
    const [assetStatusData, setAssetStatusData] = useState<AssetDetailData[]>([]);
    const [assetAssignData, setassetAssignData ] = useState<AssetDetailData[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [assetChartData, setAssetChartData] = useState<ChartData[]>([]);
    const [assetFilteredChartData, setAssetFilteredChartData] = useState<ChartData[]>([]);
    const [detailChartData, setDetailChartData] = useState<ChartData[]>([]);
    const [detailFilteredChartData, setDetailFilteredChartData] = useState<ChartData[]>([]);
    const [assignChartData, setAssignChartData] = useState<ChartData[]>([])
    const [assignFilteredChartData, setAssignFilteredChartData] = useState<ChartData[]>([]);

    const {data: assetData, isLoading: assetLoading, isError:assetError} = useQuery<AssetData>({
        queryKey: ['assetData'],
        queryFn: ():Promise<AssetData> => axiosInstance.get('/asset/asset_count').then((res) => {
            console.log(res);
            return res.data.data;
        }),
    })

    const statusColors: {[key: string]: string } = {
        'IN STORE': '#FD6A02', 
        'IN REPAIR': '#FCE205',
        'IN USE': '#3BB143', 
        'DISPOSED': '#808080', 
        'EXPIRED': '#ED2938',
        'UNASSIGNED': '#FD6A02', 
        'ASSIGN_PENDING': '#FCE205',
        'ASSIGNED': '#3BB143',  
        'REJECTED': '#ED2938',
        'CREATE_PENDING': '#FD6A02', 
        'UPDATE_PENDING': '#FCE205',
        'CREATED': '#3BB143', 
        'UPDATED': '#808080', 
        'CREATE_REJECTED': '#ED2938',
        'UPDATE_REJECTED': '#E48938',
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

    useEffect(() =>{
        axiosInstance.get(`/asset/asset_count`)
        .then((res) => {
            const assetCountData = res.data.data;
            const assetTypeData = Object.entries(assetCountData?.asset_status?? {}).map(([label, value]) => ({
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

    useEffect(() =>{
        axiosInstance.get(`/asset/asset_count`)
        .then((res) => {
            const assetDetailData = res.data.data;
            const assetDetailStatusData = Object.entries(assetDetailData?.asset_detail_status?? {}).map(([label, value]) => ({
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

    useEffect(() =>{
        axiosInstance.get(`/asset/asset_count`)
        .then((res) => {
            const assetAssignData = res.data.data;
            const assetAssignStatusData = Object.entries(assetAssignData?.asset_assign_status?? {}).map(([label, value]) => ({
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

        if (assetTypeValue === 0 ) {
            setAssetFilteredChartData(assetChartData)
            setDetailFilteredChartData(detailChartData)
            setAssignFilteredChartData(assignChartData)
        }else {
            axiosInstance.get(`/asset/asset_count?asset_type=${assetTypeValue}`)
            .then((res) => {
                
            })
        }
    }




    return(
    <>
    </>
    )
}