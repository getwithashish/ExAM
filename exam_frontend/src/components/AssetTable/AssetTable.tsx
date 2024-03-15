import React, { Key, SetStateAction, useEffect, useMemo, useState } from "react";
import { Badge, Button, Dropdown, Input, Space, Table, TableColumnsType } from "antd";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { SearchOutlined } from "@ant-design/icons";
import "./AssetTable.css";
import CardComponent from "../CardComponent/CardComponent"
import { CloseOutlined } from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import { isError, useQuery } from "@tanstack/react-query";
import { AssetTableProps, DataType, LogData } from "../AssetTable/types";
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
 
 
 
const AssetTable = ({
  asset_uuid,
  logsData,
  isLoading,
  isSuccess,
  selectedAssetId,
  setSelectedAssetId,
  handleRowClick,
  onCloseDrawer,
  selectedRow,
  drawerVisible,
  assetData,
  columns ,
  handleUpdateData,
  drawerTitle,
  statusOptions,
  businessUnitOptions,
  locations,
  memoryData,
  assetTypeData,
  expandedRowRender
}:AssetTableProps
) => {
 
 
const rowRender=(record, expanded)=>{if(isSuccess){ if(expanded && selectedAssetId && expandedRowRender)return expandedRowRender(record.key);else return;} else return <>not loaded</>}  
const memoizedRowRender=useMemo(()=>rowRender,[isSuccess])
 
  return (
    <>
      <div className="mainHeading">
        <h1>Asset Details</h1>
      </div>
     
      <div style={{ position: 'relative', display: 'inline-block' }}>
  <Table
   
    columns={columns}
    dataSource={assetData}
    scroll={{ x: "max-content" }}
    className="mainTable"
    pagination={false}
    // bordered={false}
    handleRowClick={handleRowClick}
    style={{
      borderRadius: 10,
      padding: 20,
      fontSize: "50px",
    }}
 
   
  rowKey={(record:DataType)=>record.key}
    expandable={{
      onExpand:(expanded,record)=>{if(expanded) return setSelectedAssetId(record.key); else return},
      expandedRowRender: (record, index, indent, expanded) => {return memoizedRowRender(record, expanded);},
    }}
 
  />
 
</div>
      <DrawerComponent
        visible={drawerVisible}
        onClose={onCloseDrawer}
        selectedRow={selectedRow}
        drawerTitle={drawerTitle}
        // button={button}
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
            asset_uuid={asset_uuid} onUpdate={function (): void {
              throw new Error("Function not implemented.");
            } }          />
        )}
     
      </DrawerComponent>
    </>
  );
};
 
export default React.memo(AssetTable);