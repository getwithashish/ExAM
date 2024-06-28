import React from "react";
import { Pagination, Table } from "antd";
import "./AssetTable.css";
import CardComponent from "../CardComponent/CardComponent";
import { CloseOutlined } from "@ant-design/icons";
import { AssetTableProps } from "../AssetTable/types";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";
import GlobalSearch from "../GlobalSearch/GlobalSearch";
import { RefreshTwoTone } from "@mui/icons-material";

const AssetTable: React.FC<AssetTableProps> = ({
  userRole,
  asset_uuid,
  isAssetDataLoading,
  selectedAssetId,
  handleRowClick,
  onCloseDrawer,
  selectedRow,
  drawerVisible,
  setDrawerVisible,
  assetData,
  totalItemCount,
  assetPageDataFetch,
  columns,
  reset,
  handleUpdateData,
  drawerTitle,
  statusOptions,
  businessUnitOptions,
  locations,
  memoryData,
  assetTypeData,
  isMyApprovalPage,
  heading,
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

  let pageHeading = heading;
  if (userRole === "SYSTEM_ADMIN") {
    pageHeading = "Modify Asset";
  } else if (userRole === "LEAD") {
    pageHeading = "Delete Assets";
  } else if (userRole === "MANAGER") {
    pageHeading = "Deleted Assets";
  }

  return (
    <>
      <div className="mainHeading font-display">
        <h1>{pageHeading}</h1>
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

      <div style={{ position: "relative", display: "inline-block", width: "80vw" }}>
        <Table
          columns={columns}
          loading={isAssetDataLoading}
          dataSource={assetData}
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
      </div>
      <DrawerViewRequest
        open={drawerVisible}
        onClose={onCloseDrawer}
        selectedRow={selectedRow}
        drawerTitle={drawerTitle}
        onUpdateData={handleUpdateData}
        closeIcon={<CloseOutlined rev={undefined} />}
        title={""}
      >
        {selectedRow && (
          <div>
            <h2 className="drawerHeading">{selectedRow.ProductName}</h2>
          </div>
        )}

        {selectedRow && (
          <CardComponent
            selectedAssetId={selectedAssetId}
            isMyApprovalPage={isMyApprovalPage}
            data={selectedRow}
            statusOptions={statusOptions}
            businessUnitOptions={businessUnitOptions}
            locations={locations}
            memoryData={memoryData}
            assetTypeData={assetTypeData}
            asset_uuid={asset_uuid}
            setDrawerVisible={setDrawerVisible}
            assetDataRefetch={assetDataRefetch}
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
