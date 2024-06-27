import React, { useMemo, useState } from "react";
import { Pagination, Table } from "antd";
import "./AssetTable.css";
import CardComponent from "./CardComponent/CardComponent";
import { CloseOutlined } from "@ant-design/icons";
import { AssetTableProps } from "../AssetTable/types";
import SideDrawerComponent from "../../SideDrawerComponent/SideDrawerComponent";
import UploadComponent from "../../Upload/UploadComponent";
import DrawerViewRequest from "../../../pages/RequestPage/DrawerViewRequest";
import GlobalSearch from "../../GlobalSearch/GlobalSearch";
import { RefreshTwoTone } from "@mui/icons-material";

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
  totalItemCount,
  assetPageDataFetch,
  columns,
  handleUpdateData,
  drawerTitle,
  reset,
  statusOptions,
  businessUnitOptions,
  locations,
  memoryData,
  assetTypeData,
  expandedRowRender,
  assetDataRefetch,
  sortOrder,
  sortedColumn,
  searchTerm,
  setSearchTerm,
}: AssetTableProps) => {

  const handleRefreshClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.preventDefault();
    const queryParams = `&global_search=${searchTerm}&sort_by=${sortedColumn}&sort_order=${sortOrder}&offset=20`;
    assetDataRefetch(queryParams);
  };

  const [showUpload, setShowUpload] = useState(false);
  const closeImportDrawer = () => {
    setShowUpload(false);
  };

  return (
    <>
      <div className="mainHeading" style={{ background: "white" }}>
        <div className=" font-display">Deallocate Assets</div>
      </div>
      <div className="flex" style={{ marginLeft: "40px", marginBottom: "30px" }}>
        <GlobalSearch
          assetDataRefetch={assetDataRefetch}
          searchTerm={searchTerm}
          reset={reset}
          setSearchTerm={setSearchTerm}
        />
        <RefreshTwoTone
          style={{
            backgroundColor: "#63c5da",
            cursor: "pointer",
            margin: "10px",
            borderRadius: '10px',
            color: 'white'
          }}
          onClick={handleRefreshClick}
        />
      </div>

      <div
        style={{
          position: "relative",
          display: "inline-block",
          background: "white",
          width: "80vw",
        }}
      >
        <SideDrawerComponent
          displayDrawer={showUpload}
          closeDrawer={closeImportDrawer}
        >
          <UploadComponent />
        </SideDrawerComponent>
        <div
          className="rounded-lg bg-gray-50 shadow-md dark:bg-gray-800 mx-10"
          style={{
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Table
            columns={columns}
            dataSource={assetData}
            scroll={{ y: 600 }}
            className="mainTable"
            pagination={false}
            bordered={false}
            handleRowClick={handleRowClick}
            style={{
              fontSize: "50px",
              borderColor: "white",
              // width: "29%",
            }}
            footer={() => (
              <Pagination
            pageSize={20}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} assets`}
            total={totalItemCount}
            onChange={(page, pageSize) => {
              const offset = (page - 1) * pageSize;
              let additionalQueryParams = `&offset=${offset}`;
              if (searchTerm !== "" && searchTerm !== null) {
                  additionalQueryParams += `&global_search=${searchTerm}`;
              }
              let sortParams = "";
              const queryParams = `${sortParams}${additionalQueryParams}`;
              if (sortedColumn && sortOrder) {
                  // Check if sortParams already contains sorting parameters
                  if (queryParams.indexOf('sort_by') === -1) {
                      sortParams = `&sort_by=${sortedColumn}&sort_order=${sortOrder}`;
                  }
              }
              
              assetPageDataFetch(queryParams);
          }}
            hideOnSinglePage={true}
          />
            )}
          />
        </div>
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
          <CardComponent
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
    </>
  );
};

export default React.memo(AssetTable);
