import React, { useState } from "react";
import { Pagination, Table } from "antd";
import "./DasboardAssetTable.css";
import { CloseOutlined } from "@ant-design/icons";
import { AssetTableProps } from "./types";
import TableNavbar from "../TableNavBar/TableNavbar";
import SideDrawerComponent from "../SideDrawerComponent/SideDrawerComponent";
import UploadComponent from "../Upload/UploadComponent";
import DashBoardCardComponent from "../DashBoardCardComponent/DashBoardCardComponent";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";

const DashboardAssetTable = ({
  asset_uuid,
  isSuccess,
  selectedAssetId,
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
  reset,
  sortOrder,
  sortedColumn,
  isAssetDataLoading,
}: AssetTableProps) => {

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const queryParams = `&global_search=${searchTerm}&sort_by=${sortedColumn}&sort_order=${sortOrder}&offset=0`;
    assetDataRefetch(queryParams);
  };

  const rowRender = (record: { key: string }, expanded: any) => {
    if (isSuccess) {
      if (expanded && selectedAssetId && expandedRowRender)
        return expandedRowRender(record.key);
      else return;
    } else return <>not loaded</>;
  };

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
          reset={reset}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div style={{ position: "relative", display: "inline-block", width: "80vw" }}>
        <SideDrawerComponent
          displayDrawer={showUpload}
          closeDrawer={closeImportDrawer}
        >
          <UploadComponent />
        </SideDrawerComponent>
        <br></br>
        <br></br>
        <Table
          columns={columns.map((column: { dataIndex: string; }) => ({ ...column, sortOrder: column.dataIndex === sortedColumn ? sortOrder : undefined }))} 
          dataSource={assetData}
          className="mainTable"
          loading={isAssetDataLoading}
          pagination={false}
          bordered={false}
          scroll={{ x: 1300, y: 600 }}
          handleRowClick={handleRowClick}
          style={{
            fontSize: "50px",
            borderColor: "white",
            // width: "fit-content",
            marginLeft: "3.5%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
          footer={() => (
            <Pagination
            pageSize={20}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} assets`
            }
            total={totalItemCount}
            onChange={(page, pageSize) => {
              const offset = (page - 1) * pageSize;
              const queryParams = `&offset=${offset}&global_search=${searchTerm}&sort_by=${sortedColumn}&sort_order=${sortOrder}`;
              assetPageDataFetch(queryParams);
            }}
            hideOnSinglePage={true}
          />
          )}
        />
      </div>
      <DrawerViewRequest
        open={drawerVisible}
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

export default React.memo(DashboardAssetTable);
