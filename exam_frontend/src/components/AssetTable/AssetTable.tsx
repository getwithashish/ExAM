import React, { Key, SetStateAction, useEffect, useState } from "react";
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

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}
const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];


const AssetTable = () => {

  const [selectedAssetId, setSelectedAssetId] = useState<string|null>(null); // State to store the selected asset ID
  let logsDataExpanded=[];
  const { data: logsData, error, isLoading,isSuccess,isFetching, isRefetchError, refetch } = useQuery<LogData[], Error>({
    queryKey: ['assetLogsData', selectedAssetId], // Include selectedAssetId in the query key
    queryFn: ()=> getAssetLog(selectedAssetId),
  });  
 
  const expandedRowRender = (assetId: string) => {
  
    const columns: TableColumnsType<ExpandedDataType> = [
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
   if(isSuccess && !isLoading && logsData?.length){
  
for (let i = 0; i < (logsData as LogData[]).length; i++) {
  let assetLog = logsData !== undefined && (logsData as LogData[])[i]?.asset_log!;
  if (assetLog && assetLog.asset_id === assetId) {
    const timestamp = logsData !== undefined && logsData?.timestamp && new Date(logsData!.timestamp);
    // Convert timestamp to Date object
    const formattedTimestamp = timestamp?.toLocaleString(); // Format the timestamp as a string in the local time zone

    const createdAt = new Date(assetLog.created_at); // Convert created_at timestamp to Date object
    const formattedCreatedAt = createdAt.toLocaleString(); // Format the created_at timestamp

    const updatedAt = new Date(assetLog.updated_at); // Convert updated_at timestamp to Date object
    const formattedUpdatedAt = updatedAt.toLocaleString(); 
    
        logsDataExpanded=[...logsDataExpanded,{
          ...assetLog,
          key: assetLog.asset_id,
          timestamp: formattedTimestamp,
          asset_category: assetLog.asset_category,
          asset_detail_status: assetLog.asset_detail_status,
          assign_status: assetLog.assign_status,
          created_at: formattedCreatedAt,
          product_name: assetLog.product_name,
          updated_at: formattedUpdatedAt,
          date_of_purchase: assetLog.date_of_purchase,
          date:assetLog.date_of_purchase, 
          name:assetLog.product_name,
          upgradeNum:assetLog.assign_status,
        }];
      
      }
      console.log("logsDataexpanded", logsDataExpanded)
      return <Table columns={columns} dataSource={logsDataExpanded}  pagination={false} style={{ maxHeight: 300, overflowY: 'auto', maxWidth: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none' }} />;
 
         }
         
    }
    else return<>no data</>
    }

    useEffect(()=>{console.log("rendered")},[])
  

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
    queryFn: () =>
      axiosInstance.get("/asset/?limit=5").then((res) => {
        console.log("Returned Data: ", res.data.data.results);
        return res.data;
      }),
  });
  
  const statusOptions =
    assetData?.data.results.map((item:AssetResult) => item.status) || [];
  const businessUnitOptions =
    assetData?.data.results.map(
      (item:AssetResult) => item.business_unit.business_unit_name
    ) || [];

  
    const { data: locationResults } = useQuery({
      queryKey: ['location'],
      queryFn: () => axiosInstance.get('/asset/location').then((res) => res.data),
    });
    
    // Access locations from the response data (assuming results is an array)
    const locations = locationResults?.results ?? [];
    
    const locationFilters = locations.map(location => ({
      text: location.location_name,
      value: location.location_name,
    }));
  
    const { data: memoryData } = useQuery({
      queryKey: ['memorySpace'],
      queryFn: () => axiosInstance.get('/asset/memory_list').then((res) => res.data.data),
    });

  const { data: assetTypeData } = useQuery({
    queryKey: ['assetDrawerassetType'],
    queryFn: () => axiosInstance.get('/asset/asset_type').then((res) => res.data.data),
  });
  console.log(assetTypeData)
  const assetTypeFilters = assetTypeData?.map(assetType => ({
    text: assetType.asset_type_name,
    value: assetType.asset_type_name
  })) ?? [];

  

// if (isLoading) return <div className="spin"> <Spin /></div>;
  // if (isError) return <div>Error fetching data</div>;
  // //  const assetListData = assetData?.data.data.map.map((item:  DataType) => ({
  // //   value: item.asset_type
  // // }));
  const assetDataList = assetData?.data.results;
  console.log("Testing on 65:", assetDataList ? assetDataList[0].results : []);


  

  
  const handleRowClick = (record: React.SetStateAction<null>) => {
    setSelectedRow(record);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const [tableData, setTableData] = useState<DataType[]>([]);
  const handleUpdateData = (updatedData: { key: any }) => {
    // Update the table data with the updated data
    setTableData((prevData: any[]) =>
      prevData.map((item) =>
        item.key === updatedData.key ? { ...item, ...updatedData } : item
      )
    );
  };


  <div>
    <h1>Asset Overview</h1>
  </div>;
  const columns: TableColumnsType<DataType> = [
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
 
  const data = assetData?.data.results.map((result) => ({
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
    <>
      <div className="mainHeading">
        <h1>Asset Details</h1>
      </div>
     
      <div style={{ position: 'relative', display: 'inline-block' }}>
  <Table
   
    columns={columns}
    dataSource={data}
    scroll={{ x: "max-content" }}
    className="mainTable"
    pagination={false}
    bordered={false}
    style={{
      borderRadius: 10,
      padding: 20,
      fontSize: "50px",
    }}

    
  rowKey={(record)=>record.key}
    expandable={{
      onExpand:(expanded,record)=>{setSelectedAssetId(record.key);},
      expandedRowRender: (record, index, indent, expanded) => {if(isSuccess){ if(expanded && selectedAssetId)return expandedRowRender(record.key);else return;} else return <>not loaded</>}, 
    }}
  
  />
 
</div>
      <DrawerComponent
        visible={drawerVisible}
        onClose={onCloseDrawer}
        selectedRow={selectedRow}
        title={drawerTitle}
        button={button}
        onUpdateData={handleUpdateData}
        closeIcon={<CloseOutlined rev={undefined} />}
      >
        {selectedRow && (
          <div>
            <h2 className="drawerHeading">{selectedRow.ProductName}</h2>
          </div>
        )}

        {selectedRow && (
          <CardComponent
            data={selectedRow}
            statusOptions={statusOptions}
            businessUnitOptions={businessUnitOptions}
            locations={locations}
            memoryData={memoryData}
            assetTypeData={assetTypeData}
          />
        )}
        {button && (
          <div
            style={{
              marginBottom: "20px",
              marginLeft: "1150px",
              marginTop: "60px",
            }}
          >
            {button}
          </div>
        )}
      </DrawerComponent>
    </>
  );
};

export default AssetTable;
