import React, {
  useMemo,
  useState,
} from "react";
import {
  Pagination,
  Table,
} from "antd";
import "./DasboardAssetTable.css";
import { CloseOutlined } from "@ant-design/icons";
import { AssetTableProps } from "../AssetTable/types";
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
  reset,
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
          reset={reset}
        />
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <SideDrawerComponent
          displayDrawer={showUpload}
          closeDrawer={closeImportDrawer}
        >
          <UploadComponent />
        </SideDrawerComponent>
<br></br>
<br></br>
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
      width:"29%",
      marginLeft:"1%",
      boxShadow:"0 0 10px rgba(0, 0, 0, 0.2)",
      marginRight:"32px"
    
      
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

export default React.memo(DasboardAssetTable);
