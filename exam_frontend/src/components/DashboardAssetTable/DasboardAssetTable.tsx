import React, { Key, SetStateAction, useEffect, useMemo, useState } from "react";
import { Badge, Button, Dropdown, Input, Space, Table, TableColumnsType } from "antd";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { SearchOutlined } from "@ant-design/icons";
import "./DasboardAssetTable.css";
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

import { AxiosError } from "axios";
import TableNavbar from "../TableNavBar/TableNavbar";
import SideDrawerComponent from "../SideDrawerComponent/SideDrawerComponent";
import UploadComponent from "../Upload/UploadComponent";
import DashBoardCardComponent from "../DashBoardCardComponent/DashBoardCardComponent";
 

 
 
 
const DasboardAssetTable = ({
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
 
 
const rowRender=(record: { key: string; }, expanded: any)=>{if(isSuccess){ if(expanded && selectedAssetId && expandedRowRender)return expandedRowRender(record.key);else return;} else return <>not loaded</>}  
const memoizedRowRender=useMemo(()=>rowRender,[isSuccess])
const [showUpload, setShowUpload] = useState(false);
  const closeImportDrawer = () => {
    setShowUpload(false);
  };
 

  
 
  return (
    <>
      <div className="mainHeading" font-medium font-display>
        <h6>Asset Details</h6>
      </div>
     
      <div>
        <TableNavbar showUpload={showUpload} setShowUpload={setShowUpload} />
      </div>

    

      <div style={{ position: "relative", display: "inline-block" }}>
      <SideDrawerComponent
          displayDrawer={showUpload}
          closeDrawer={closeImportDrawer}
        >
          <UploadComponent />
        </SideDrawerComponent>
  <Table
    columns={columns}
    dataSource={assetData}
    className="mainTable" font-display
    pagination={false}
    bordered={false}
    handleRowClick={handleRowClick}
    style={{
      padding: 20,
      fontSize: "50px",
      borderColor:"white",
      scrollbarWidth: "thin"
      
    }}
    scroll={{ x: 'max-content', y: 300 }}
   
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
          <DashBoardCardComponent
            selectedAssetId={ selectedAssetId}

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
 
export default React.memo(DasboardAssetTable );