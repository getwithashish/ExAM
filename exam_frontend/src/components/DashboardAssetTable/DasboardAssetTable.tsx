import React, {
  Key,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Badge,
  Button,
  Dropdown,
  Input,
  Pagination,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./DasboardAssetTable.css";
import CardComponent from "../CardComponent/CardComponent";
import { CloseOutlined } from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import { isError, useQuery } from "@tanstack/react-query";
import { AssetTableProps, DataType, LogData } from "../AssetTable/types";
import { ColumnFilterItem } from "../AssetTable/types";
import { AssetResult } from "../AssetTable/types";
import { FilterDropdownProps } from "../AssetTable/types";
import { useInfiniteQuery } from "react-query";

import { DownOutlined } from "@ant-design/icons";
import ExportButton from "../Export/Export";

import { AxiosError } from "axios";
import TableNavbar from "../TableNavBar/TableNavbar";
import SideDrawerComponent from "../SideDrawerComponent/SideDrawerComponent";
import UploadComponent from "../Upload/UploadComponent";
import DashBoardCardComponent from "../DashBoardCardComponent/DashBoardCardComponent";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";

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
  totalItemCount,
  assetPageDataFetch,
  columns,
  handleUpdateData,
  drawerTitle,
  statusOptions,
  businessUnitOptions,
  locations,
  memoryData,
  assetTypeData,
  expandedRowRender,
  assetDataRefetch,
}: AssetTableProps) => {
  const rowRender = (record: { key: string }, expanded: any) => {
    if (isSuccess) {
      if (expanded && selectedAssetId && expandedRowRender)
        return expandedRowRender(record.key);
      else return;
    } else return <>not loaded</>;
  };
  const memoizedRowRender = useMemo(() => rowRender, [isSuccess]);
  const [showUpload, setShowUpload] = useState(false);
  const closeImportDrawer = () => {
    setShowUpload(false);
  };

  return (
    <div className="bg-white py-4 pt-20">
      <div className="mainHeading font-medium font-display font-semibold">
        <h6>Asset Details</h6>
      </div>
      <div className="ml-2">
        <TableNavbar
          showUpload={showUpload}
          setShowUpload={setShowUpload}
          assetDataRefetch={assetDataRefetch}
        />
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <SideDrawerComponent
          displayDrawer={showUpload}
          closeDrawer={closeImportDrawer}
        >
          <UploadComponent />
        </SideDrawerComponent>
        <div className="rounded-lg bg-gray-50 shadow-md dark:bg-gray-800 mx-10" style={{
boxShadow
:
'0 0 10px rgba(0, 0, 0, 0.2)'
}}>
  <Table
    columns={columns}
    dataSource={assetData}
    className="mainTable"
    pagination={false}
    bordered={false}
    scroll={{ x:1300, y: 600 }}
    handleRowClick={handleRowClick}
    style={{
      fontSize: "50px",
      borderColor:"white",
      width:"29%"
      
    }}
    
   

    footer={() => (
      <Pagination
        pageSize={20}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} assets`
        }
        total={totalItemCount}
        onChange={(page, pageSize) => {
          assetPageDataFetch(`&offset=${(page - 1) * pageSize}`);
        }}
        hideOnSinglePage={true}
      />
    )}
 
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
          <DashBoardCardComponent
            selectedAssetId={selectedAssetId}
            data={selectedRow}
            statusOptions={statusOptions}
            businessUnitOptions={businessUnitOptions}
            locations={locations}
            memoryData={memoryData}
            assetTypeData={assetTypeData}
            asset_uuid={asset_uuid}
            onUpdate={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      </DrawerViewRequest>
    </div>
  );
};

export default React.memo(DasboardAssetTable);
