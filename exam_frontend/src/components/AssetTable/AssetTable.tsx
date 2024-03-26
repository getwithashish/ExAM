import React, { Key, SetStateAction, useEffect, useMemo, useState } from "react";
import { Badge, Button, Dropdown, Input, Space, Table, TableColumnsType } from "antd";
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
import TableNavbar from "../TableNavBar/TableNavbar";
import SideDrawerComponent from "../SideDrawerComponent/SideDrawerComponent";
import UploadComponent from "../Upload/UploadComponent";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";
 
interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

 
 
 
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
  expandedRowRender,
  isMyApprovalPage,
  heading
}:AssetTableProps
) => {
 
 
const rowRender=(record: { key: string; }, expanded: any)=>{if(isSuccess){ if(expanded && selectedAssetId && expandedRowRender)return expandedRowRender(record.key);else return;} else return <>not loaded</>}  
const memoizedRowRender=useMemo(()=>rowRender,[isSuccess])

const [showUpload, setShowUpload] = useState(false);
  const closeImportDrawer = () => {
    setShowUpload(false);
  };
 
  return (
    <>
     <div className="mainHeading" font-display>
        <h1>{heading}</h1> 
      </div>
      

      <div style={{ position: "relative", display: "inline-block" }}>
      <div className="rounded-lg bg-gray-50 shadow-md dark:bg-gray-800 mx-10" style={{
boxShadow
:
'0 0 10px rgba(0, 0, 0, 0.2)'
}}>
  <Table
   
    columns={columns}
    dataSource={assetData}
    scroll={{ y: 600 }}
    className="mainTable"
    pagination={false}
    bordered={false}
    handleRowClick={handleRowClick}
    style={{
      borderRadius: 10,
      // padding: 20,
      fontSize: "50px",
    }}
 
   
  rowKey={(record:DataType)=>record.key}
    expandable={{
      onExpand:(expanded,record)=>{if(expanded) return setSelectedAssetId(record.key); else return},
      expandedRowRender: (record, index, indent, expanded) => {return memoizedRowRender(record, expanded);},
    }}
 
  />
 </div>
</div>
      <DrawerViewRequest
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
            selectedAssetId={ selectedAssetId}
            isMyApprovalPage={isMyApprovalPage}
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
     
      </DrawerViewRequest>
    </>
  );
};
 
export default React.memo(AssetTable);