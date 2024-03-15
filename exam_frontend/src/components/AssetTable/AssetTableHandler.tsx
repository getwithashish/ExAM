import React, { Key, SetStateAction, useCallback, useEffect, useState } from "react";
import { Badge, Button, Dropdown, Input, Space, Table, TableColumnsType } from "antd";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { SearchOutlined } from "@ant-design/icons";
import "./AssetTable.css";
import CardComponent from "../CardComponent/CardComponent"
import { CloseOutlined } from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import { isError, useQuery } from "@tanstack/react-query";
import { DataType, LogData } from "../AssetTable/types";
import { ColumnFilterItem } from "../AssetTable/types";
import { AssetResult } from "../AssetTable/types";
import {FilterDropdownProps} from "../AssetTable/types";
import { useInfiniteQuery } from 'react-query';

import { DownOutlined } from '@ant-design/icons';
import ExportButton from "../Export/Export";
import { getAssetLog } from "./api/getAssetLog";
import { AxiosError } from "axios";
import AssetTable from "./AssetTable";
import { getAssetDetails, getAssetTypeOptions, getLocationOptions, getMemoryOptions } from "./api/getAssetDetails";

interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
  }


const AssetTableHandler = () => {


    const [selectedAssetId, setSelectedAssetId] = useState<string|null>(null); // State to store the selected asset ID
    
    const { data: logsData, error, isLoading,isSuccess,isFetching, isRefetchError, refetch } = useQuery<LogData[], Error>({
      queryKey: ['assetLogsData', selectedAssetId], // Include selectedAssetId in the query key
      queryFn: ()=> getAssetLog(selectedAssetId),
    });  
     
   
    const expandedRowRender = useCallback((assetId: string) => {
        let logsDataExpanded=[];
      const columnsLog: TableColumnsType<ExpandedDataType> = [
        { title: 'timestamp', dataIndex: 'timestamp', key: 'timestamp' },
        { title: 'asset_category', dataIndex: 'asset_category', key: 'asset_category' },
        {title: 'asset_detail_status',key: 'asset_detail_status',dataIndex:'asset_detail_status'},
        { title: 'assign_status', dataIndex: 'assign_status', key: 'assign_status' },
        { title: 'created_at', dataIndex: 'created_at',key: 'created_at',},
        {title: 'product_name',dataIndex: 'product_name',key: 'product_name',},
        {title: 'updated_at',dataIndex: 'updated_at',key: 'updated_at',},
        { title: 'date_of_purchase', dataIndex: 'date_of_purchase', key: 'date_of_purchase', },
        {title: 'model_number',dataIndex: 'model_number', key: 'model_number',},
        { title: 'updated_at', dataIndex: 'updated_at', key: 'updated_at',},
      ];
   
      
     console.log("logsdata", logsData)
     if(isSuccess && !isLoading && logsData?.length ){
       
  for (let i = 0; logsData && i < (logsData as LogData[]).length ; i++) {
    let {asset_log}:LogData =  (logsData as LogData[])[i];
      const timestamp = logsData !== undefined && logsData?.timestamp && new Date(logsData!.timestamp);
      // Convert timestamp to Date object
      const formattedTimestamp = timestamp?.toLocaleString(); // Format the timestamp as a string in the local time zone
  
      const createdAt = new Date(asset_log?.created_at); // Convert created_at timestamp to Date object
      const formattedCreatedAt = createdAt.toLocaleString(); // Format the created_at timestamp
  
      const updatedAt = new Date(asset_log?.updated_at); // Convert updated_at timestamp to Date object
      const formattedUpdatedAt = updatedAt.toLocaleString(); 
      
          logsDataExpanded=[...logsDataExpanded,{
            ...asset_log,
            key: asset_log.asset_id,  
            timestamp: formattedTimestamp,
            asset_category: asset_log.asset_category,
            asset_detail_status: asset_log.asset_detail_status,
            assign_status: asset_log.assign_status,
            created_at: formattedCreatedAt,
            product_name: asset_log.product_name,
            updated_at: formattedUpdatedAt,
            date_of_purchase: asset_log.date_of_purchase,
            date:asset_log.date_of_purchase, 
            name:asset_log.product_name,
            upgradeNum:asset_log.assign_status,
          }];
        
        
       
           }
           console.log("logsDataexpanded", logsDataExpanded)
           return <Table columns={columnsLog} dataSource={logsDataExpanded}  pagination={false} style={{ maxHeight: 300, overflowY: 'auto', maxWidth: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none' }} />;
         
      }
      else return<>no data</>
      },[selectedAssetId,isSuccess, logsData]);
  
    
    
  
   const nestedcolumns: TableColumnsType<DataType> = [
    
    ];
  
    const nesteddata: DataType[] = [];
    for (let i = 0; i < 1; ++i) {
      nesteddata.push({
        key: i.toString(),
        name: 'Screen',
        platform: 'iOS',
        version: '10.3.4.5654',
        upgradeNum: 500,
        creator: 'Jack',
        createdAt: '2014-12-24 23:12:00',
      });
    }
  
    
    const [selectedRow, setSelectedRow] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
  
    const {
      data: assetData,
    } = useQuery({
      queryKey: ["assetList"],
      queryFn: () =>getAssetDetails()
    });
    
    const statusOptions =
      assetData?.map((item:AssetResult) => item.status) || [];
    const businessUnitOptions =
      assetData?.map(
        (item:AssetResult) => item.business_unit.business_unit_name
      ) || [];
  
    
      const { data: locationResults } = useQuery({
        queryKey: ['location'],
        queryFn: () => getLocationOptions()
      });

      const locations = locationResults ? locationResults : [];
      
      const locationFilters = locations.map(location => ({
        text: location.location_name,
        value: location.location_name,
      }));
    
      const { data: memoryData } = useQuery({
        queryKey: ['memorySpace'],
        queryFn: () => getMemoryOptions()
      });
  
    const { data: assetTypeData } = useQuery({
      queryKey: ['assetDrawerassetType'],
      queryFn: () => getAssetTypeOptions(),
    });
    const assetTypeFilters = assetTypeData?.map(assetType => ({
      text: assetType.asset_type_name,
      value: assetType.asset_type_name
    })) ?? [];
  
    
  
  
    const assetDataList = assetData;
    console.log("Testing on 65:", assetDataList ? assetDataList[0].results : []);
  
  
    
  
    
    const handleRowClick = useCallback((record: React.SetStateAction<null>) => {
      setSelectedRow(record);
      setDrawerVisible(true);
    },[]);
  
    const onCloseDrawer = useCallback(() => {
      setDrawerVisible(false);
    },[]);
  
    const [tableData, setTableData] = useState<DataType[]>([]);
    const handleUpdateData = (updatedData: { key: any }) => {
      
      setTableData((prevData: any[]) =>
        prevData.map((item) =>
          item.key === updatedData.key ? { ...item, ...updatedData } : item
        )
      );
    };
  
  
    <div>
      <h1>Asset Overview</h1>
    </div>;

    const columns= [
      {
        title: "Product Name",
        dataIndex: "product_name",
        fixed: "left",
        width: 180,
        filterIcon: <SearchOutlined />,
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search Product Name"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <button
                type="button"
                onClick={confirm}
                style={{ width: 90, fontSize: "16px" }}
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                style={{ width: 90, fontSize: "16px" }}
              >
                Reset
              </button>
            </Space>
          </div>
        ),
        onFilter: (value, record) => {
          if (Array.isArray(value)) {
            return value.includes(record.product_name);
          }
          return record.product_name.indexOf(value.toString()) === 0;
        },
        sorter: (a, b) => a.product_name.localeCompare(b.product_name),
        sortDirections: ["ascend", "descend"],
        render: (_, record) => (
          <div
            data-column-name="Product Name"
            onClick={() => handleColumnClick(record, "Product Name")}
            style={{ cursor: "pointer" }}
          >
            {record.product_name}
          </div>
        ),
      },
      {
        title: "Serial Number",
        dataIndex: "serial_number",
        responsive: ["md"],
        width: 180,
        filterIcon: <SearchOutlined />,
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search Serial Number"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <button
                type="button"
                onClick={confirm}
                style={{ width: 90, fontSize: "16px" }}
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                style={{ width: 90, fontSize: "16px" }}
              >
                Reset
              </button>
            </Space>
          </div>
        ),
        onFilter: (value, record) => {
          if (Array.isArray(value)) {
            return value.includes(record.serial_number);
          }
          return record.serial_number.indexOf(value.toString()) === 0;
        },
        sorter: (a, b) => a.serial_number.localeCompare(b.serial_number),
        sortDirections: ["ascend", "descend"],
        render: (_, record) => (
          <div
            data-column-name="Serial Number"
            onClick={() => handleColumnClick(record, "Serial Number")}
            style={{ cursor: "pointer" }}
          >
            {record.serial_number}
          </div>
        ),
      },
     
      {
        title: "Location",
        dataIndex: "location",
        responsive: ["md"],
        width: 180,
        filters:locationFilters,
        onFilter: (
          value: string | number | boolean | React.ReactText[] | Key,
          record: DataType
        ) => {
          if (Array.isArray(value)) {
            return value.includes(record.location);
          }
          return record.location.indexOf(value.toString()) === 0;
        },
        render: (_, record) => (
          <div
            data-column-name="Location"
            onClick={() => handleColumnClick(record, "Location")}
            style={{ cursor: "pointer" }}
          >
            {record.location}
          </div>
        ),
      },
      {
        title: "Custodian",
        dataIndex: "custodian",
        responsive: ["md"],
        fixed: "right",
        width: 180,
        filterIcon: <SearchOutlined />,
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Search Custodian"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <button
                type="button"
                onClick={confirm}
                style={{ width: 90, fontSize: "16px" }}
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                style={{ width: 90, fontSize: "16px" }}
              >
                Reset
              </button>
            </Space>
          </div>
        ),
        onFilter: (value, record) => {
          if (Array.isArray(value)) {
            return value.includes(record.custodian);
          }
          return record.custodian.indexOf(value.toString()) === 0;
        },
        render: (_, record) => (
          <div
            data-column-name="Custodian"
            onClick={() => handleColumnClick(record, "Custodian")}
            style={{ cursor: "pointer" }}
          >
            {record.custodian}
          </div>
        ),
      },
      {
        title: "Asset Type",
        dataIndex: "asset_type",
        responsive: ["md"],
        
        filters: assetTypeFilters,
        onFilter: (
          value: string | number | boolean | React.ReactText[] | Key,
          record: DataType
        ) => {
          if (Array.isArray(value)) {
            return value.includes(record.asset_type);
          }
          return record.asset_type.indexOf(value.toString()) === 0;
        },
        render: (_, record) => (
          <div
            data-column-name="Asset Type"
            onClick={() => handleColumnClick(record, "Asset Type")}
            style={{ cursor: "pointer" }}
          >
            {record.asset_type}
          </div>
        ),
      },
     
    ];

    const handleColumnClick = (record: string[], columnName: string) => {
      if (columnName !== "Assign Asset") {
        handleOtherColumnClick(record);
      }
    };
  
    
  const handleOtherColumnClick = (record: SetStateAction<null>) => {
    setSelectedRow(record);
    setDrawerVisible(true);
  };
   
    const data = assetData?.map((result) => ({
      key: result.asset_uuid,
      asset_id: result.asset_id,
      asset_category: result.asset_category,
      asset_type: result.asset_type.asset_type_name,
      version: result.version,
      status: result.status,
      location: result.location.location_name,
      invoice_location: result.invoice_location.location_name,
      business_unit: result.business_unit.business_unit_name,
      os: result.os,
      os_version: result.os_version,
      mobile_os: result.mobile_os,
      processor: result.processor,
      Generation: result.processor_gen,
      accessories: result.accessories,
      date_of_purchase: result.date_of_purchase,
      warranty_period: result.warranty_period,
      approval_status: result.approval_status,
      conceder: result.conceder?.username,
      model_number: result.model_number,
      serial_number: result.serial_number,
      memory: result.memory?.memory_space,
      storage: result.storage,
      configuration: result.configuration,
      custodian: result.custodian?.employee_name,
      product_name: result.product_name,
      owner: result.owner,
      requester: result.requester.username,
      AssignAsset: "assign",
      created_at: result.created_at,
      updated_at: result.updated_at,
    }));
  
    const drawerTitle = "Asset Details";
  
    const button = <Button type="primary"></Button>;
  
  useEffect(()=>{
  
  if(selectedAssetId){
    refetch();
  }
  },[selectedAssetId])

  
  
  return (
    <AssetTable 
          drawerTitle={drawerTitle}
          logsData={logsData}
          isLoading={isLoading}
          isSuccess={isSuccess}
          selectedAssetId={selectedAssetId && selectedAssetId}
          setSelectedAssetId={setSelectedAssetId}
          handleRowClick={handleRowClick}
          onCloseDrawer={onCloseDrawer}
          selectedRow={selectedRow}
          drawerVisible={drawerVisible}
          assetData={data}
          columns={columns}
          expandedRowRender={expandedRowRender}
          memoryData={memoryData}
          assetTypeData={assetTypeData}
          locations={locations}
          statusOptions={statusOptions}
          asset_uuid={selectedAssetId}
          
          businessUnitOptions={businessUnitOptions} handleUpdateData={function (updatedData: { key: any; }): void {
              throw new Error("Function not implemented.");
          } } drawerTitle={""}     />

  )
}

export default AssetTableHandler
