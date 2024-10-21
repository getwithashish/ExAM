import React, { useMemo, useState } from "react";
import { Pagination, Table, ConfigProvider, theme } from "antd";
import "./AssetTable.css";
import CardComponent from "./CardComponent/CardComponent";
import { CloseOutlined } from "@ant-design/icons";
import { AssetTableProps } from "../AssetTable/types";
import SideDrawerComponent from "../../SideDrawerComponent/SideDrawerComponent";
import UploadComponent from "../../Upload/UploadComponent";
import DrawerViewRequest from "../../../pages/RequestPage/DrawerViewRequest";
import GlobalSearch from "../../GlobalSearch/GlobalSearch";
import { RefreshTwoTone } from "@mui/icons-material";

// interface ExpandedDataType {
//   key: React.Key;
//   date: string;
//   name: string;
//   upgradeNum: string;
// }

const AssetTable = ({
  showAssignDrawer,
  asset_uuid,
  logsData,
  // isLoading,
  isAssetDataLoading,
  isSuccess,
  selectedAssetId,
  setSelectedAssetId,
  handleRowClick,
  onCloseDrawer,
  selectedRow,
  drawerVisible,
  assetData,
  reset,
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
  sortOrder,
  sortedColumn,
  searchTerm,
  setSearchTerm,
}: AssetTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { darkAlgorithm } = theme;

  const customTheme = {
    algorithm: darkAlgorithm,
    components: {
      Table: {
        colorBgContainer: '#161B21',
      },
    },
  };

  const handleRefreshClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.preventDefault();
    const queryParams = `&global_search=${searchTerm}`;
    assetDataRefetch(queryParams);
    setCurrentPage(1);
  };

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
    <div className="bg-custom-400 lg:ml-60 mt-10 lg:pl-10">
      <div className="mainHeading pt-4">
        <div className=" font-display text-white ml-4">Allocate Assets</div>
      </div>
      <div className="flex" style={{ marginLeft: "55px", marginBottom: "30px" }}>
        <GlobalSearch
          assetDataRefetch={assetDataRefetch}
          searchTerm={searchTerm}
          reset={reset}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex items-center justify-center">
          <RefreshTwoTone
            style={{
              cursor: "pointer",
              marginLeft: "10px",
              width: "30px",
              height: "40px",
              color: "#ffffff",
            }}
            onClick={handleRefreshClick}
          />
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          width: "80vw",
        }}
      >
        <SideDrawerComponent
          displayDrawer={showUpload}
          closeDrawer={closeImportDrawer}
        >
          <UploadComponent />
        </SideDrawerComponent>

        <ConfigProvider theme={customTheme}>
          <Table
            columns={columns}
            dataSource={assetData}
            loading={isAssetDataLoading}
            scroll={{ y: 600 }}
            className="mainTable"
            pagination={false}
            bordered={false}
            handleRowClick={handleRowClick}
            style={{
              fontSize: "50px",
              borderColor: "white",
              marginLeft: "3.5%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            }}
            footer={() => (
              <Pagination
                pageSize={20}
                current={currentPage}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} assets`}
                total={totalItemCount}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  const offset = (page - 1) * pageSize;
                  let additionalQueryParams = `&offset=${offset}`;
                  if (searchTerm !== "" && searchTerm !== null) {
                    additionalQueryParams += `&global_search=${searchTerm}`;
                  }
                  let sortParams = "";
                  const queryParams = `${sortParams}${additionalQueryParams}`;
                  if (sortedColumn && sortOrder) {
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
        </ConfigProvider>
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
    </div>
  );
};

export default React.memo(AssetTable);
