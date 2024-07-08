import React, { useState } from "react";
import { Pagination, Table,  ConfigProvider, theme, } from "antd";
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
  assetDataRefetch,
  reset,
  sortOrder,
  sortedColumn,
  isAssetDataLoading,
  searchTerm,
  setSearchTerm,
  setJson_query,
  json_query,
  assetState,
  assignState,
  detailState,
  selectedTypeId,
}: AssetTableProps) => {
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const queryParams = `&global_search=${searchTerm}&sort_by=${sortedColumn}&sort_order=${sortOrder}&offset=20`;
    assetDataRefetch(queryParams);
  };
  const { darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [showUpload, setShowUpload] = useState(false);
  const closeImportDrawer = () => {
    setShowUpload(false);
  };

  const customTheme = {
    algorithm: darkAlgorithm,
    components: {
      Table: {
        colorBgContainer: '#161B21', // Replace with your desired color
      },
    },
  };

  return (
    <div className="bg-custom-400 sm:mx-2">
      <div className="mainHeading font-medium font-display font-semibold">
        <span className="font-semibold font-display text-white dark:text-white text-xl ml-6">
          Asset Details
        </span>
      </div>
      <div className="mx-8">
        <TableNavbar
          showUpload={showUpload}
          setShowUpload={setShowUpload}
          assetDataRefetch={assetDataRefetch}
          reset={reset}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          setSearchTerm={setSearchTerm}
          setJson_query={setJson_query}
          json_query={json_query}
        />
      </div>
      <div
        style={{ position: "relative", display: "inline-block", width: "83vw" }}
      >
        <SideDrawerComponent
          displayDrawer={showUpload}
          closeDrawer={closeImportDrawer}
        >
          <UploadComponent />
        </SideDrawerComponent>
        <br></br>
        <br></br>
        <ConfigProvider theme={customTheme}>
        <Table
          columns={columns.map((column: { dataIndex: string }) => ({
            ...column,
            sortOrder:
              column.dataIndex === sortedColumn ? sortOrder : undefined,
          }))}
          dataSource={assetData}
          className="mainTable"
          loading={isAssetDataLoading}
          pagination={false}
          bordered={false}
          scroll={{ x: 1300, y: 600 }}
          handleRowClick={handleRowClick}
          style={{
            fontSize: "100px",
            borderColor: "white",
            borderRadius:"10px",
            marginLeft: "3.5%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            fontFamily:"Inter"
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
                let additionalQueryParams = `&offset=${offset}`;
              
                if (searchTerm !== "" && searchTerm !== null) {
                  additionalQueryParams += `&global_search=${searchTerm}`;
                }
                if (json_query !== "" && json_query !== null) {
                  additionalQueryParams += `&json_logic=${json_query}`;
                }
                if (assetState !== "" && assetState !== null) {
                  additionalQueryParams += `&status=${assetState}`;
                }
                if (detailState !== "" && detailState !== null) {
                  additionalQueryParams += `&asset_detail_status=${detailState}`;
                }
                if (assignState !== "" && assignState !== null) {
                  additionalQueryParams += `&assign_status=${assignState}`;
                }
                if (selectedTypeId !== 0) {
                  additionalQueryParams += `&asset_type=${selectedTypeId}`;
                }
                let sortParams = "";
                if (sortedColumn && sortOrder) {
                  sortParams = `&sort_by=${sortedColumn}&sort_order=${sortOrder}`;
                }
                const queryParams = `${sortParams}${additionalQueryParams}`;
                assetPageDataFetch(queryParams);
              }}
              
              hideOnSinglePage={true}
            />
            
          )}
        />
        </ConfigProvider>
      </div>
      <DrawerViewRequest
        title=""
        open={drawerVisible}
        onClose={onCloseDrawer}
        selectedRow={selectedRow}
        drawerTitle={drawerTitle}
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
