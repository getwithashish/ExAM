import React, { useState, useEffect } from "react";
import { Pagination, Table, ConfigProvider, theme } from "antd";
import "./AssetTable.css";
import CardComponent from "../CardComponent/CardComponent";
import { CloseOutlined } from "@ant-design/icons";
import { AssetTableProps } from "../AssetTable/types";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";
import GlobalSearch from "../GlobalSearch/GlobalSearch";
import { RefreshTwoTone } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
});

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
  destroyOnClose = false
}: AssetTableProps) => {
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { darkAlgorithm } = theme;

  const handleRefreshClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    event.preventDefault();
    const queryParams = `&global_search=${searchTerm}`;
    assetDataRefetch(queryParams);
    setCurrentPage(1);
  };

  const customTheme = {
    algorithm: darkAlgorithm,
    components: {
      Table: {
        colorBgContainer: "#161B21",
      },
    },
  };

  useEffect(() => {
    if (userRole === "SYSTEM_ADMIN") {
      setReadOnly(false);
    }
  }, [userRole, heading]);

  let pageHeading = heading;
  if (userRole === "SYSTEM_ADMIN") {
    pageHeading = "Modify Asset";
  } else if (userRole === "LEAD") {
    pageHeading = "Delete Assets";
  } else if (userRole === "MANAGER") {
    pageHeading = "Deleted Assets";
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="bg-custom-400 lg:ml-60 mt-10 lg:pl-10">
        <div className="mainHeading pt-4">
          <div className=" font-display text-white ml-4">{heading}</div>
        </div>
        {(heading === "My Approved Request" ||
          pageHeading == "Modify Asset" ||
          pageHeading == "Delete Assets") && (
            <div
              className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded "
              style={{ width: "390px", marginLeft: "55px" }}
            >
              Note: Assets in pending status will not be visible here.
              {pageHeading == "Delete Assets" && (
                <div>Only assets which are approved/rejected can be deleted.</div>
              )}
            </div>
          )}
        <div
          className="flex"
          style={{ marginLeft: "55px", marginBottom: "30px" }}
        >
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
          style={{ position: "relative", display: "inline-block", width: "80vw" }}
        >
          <ConfigProvider theme={customTheme}>
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
                  current={currentPage}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} assets`
                  }
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
                      if (queryParams.indexOf("sort_by") === -1) {
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
          onUpdateData={handleUpdateData}
          closeIcon={<CloseOutlined rev={undefined} />}
          title={""}
          destroyOnClose={destroyOnClose}
        >
          {selectedRow && (
            <div>
              <h2 className="drawerHeading">{selectedRow.ProductName}</h2>
            </div>
          )}

          {selectedRow && (
            <CardComponent
              readOnly={readOnly}
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
      </div>
    </ThemeProvider>
  );
};

export default React.memo(AssetTable);
