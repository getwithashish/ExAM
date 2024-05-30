import React, {
  Key,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button, Modal, message } from "antd";
import "./AssetTable.css";
import { useQuery } from "@tanstack/react-query";
import { DataType } from "../AssetTable/types";
import { AssetResult } from "../AssetTable/types";
import AssetTable from "./AssetTable";
import { getAssetDetails, getAssetTypeOptions, getLocationOptions, getMemoryOptions } from "../../AssetTable/api/getAssetDetails";
interface AssetTableHandlerProps {
  unassign: (record: DataType) => void;
  queryParamProp: any;
}

const AssetTableHandler: React.FC<AssetTableHandlerProps> = ({
  queryParamProp,
  unassign,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null); // State to store the selected asset ID
  const [sortedColumn, setSortedColumn] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [sortOrders, setSortOrders] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [queryParam, setQueryParam] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // State for confirmation modal visibility
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null); // State to store the selected record for deallocation
  const { data: assetData, refetch: assetDataRefetch } = useQuery({
    queryKey: ["assetList", queryParam],
    queryFn: () => getAssetDetails(`${queryParamProp + queryParam}`),
  });

  const refetchAssetData = (queryParamArg = "") => {
    let editedQueryParam = "";
    var offsetIndex = queryParam.indexOf("&offset=");
    if (offsetIndex !== -1) {
      var nextAmpersandIndex = queryParam.indexOf("&", offsetIndex + 1);
      if (nextAmpersandIndex !== -1) {
        var substrBeforeOffset = queryParam.substring(0, offsetIndex);
        var substrAfterOffset = queryParam.substring(nextAmpersandIndex);
        editedQueryParam =
          substrBeforeOffset + queryParamArg + substrAfterOffset;
      } else {
        var substrBeforeOffset = queryParam.substring(0, offsetIndex);
        editedQueryParam = substrBeforeOffset + queryParamArg;
      }
    } else {
      var offsetRegex = /&offset=\d+/;
      var offsetMatch = queryParam.match(offsetRegex);
      var offsetString = offsetMatch ? offsetMatch[0] : "";
      editedQueryParam = offsetString + queryParamArg;
    }

    // setQueryParam(queryParam);
    setQueryParam(editedQueryParam);
    assetDataRefetch({ force: true });
  };

  const statusOptions =
    assetData?.results?.map((item: AssetResult) => item.status) || [];
  const businessUnitOptions =
    assetData?.results?.map(
      (item: AssetResult) => item.business_unit.business_unit_name
    ) || [];

  const { data: locationResults } = useQuery({
    queryKey: ["location"],
    queryFn: () => getLocationOptions(),
  });

  const locations = locationResults ? locationResults : [];

  const locationFilters = locations.map((location) => ({
    text: location.location_name,
    value: location.location_name,
  }));

  const { data: memoryData } = useQuery({
    queryKey: ["memorySpace"],
    queryFn: () => getMemoryOptions(),
  });

  const { data: assetTypeData } = useQuery({
    queryKey: ["assetDrawerassetType"],
    queryFn: () => getAssetTypeOptions(),
  });
  const assetTypeFilters =
    assetTypeData?.map((assetType) => ({
      text: assetType.asset_type_name,
      value: assetType.asset_type_name,
    })) ?? [];

  const assetDataList = assetData;
  const handleRowClick = useCallback((record: React.SetStateAction<null>) => {
    setSelectedRow(record);
    setDrawerVisible(true);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  const [tableData, setTableData] = useState<DataType[]>([]);
  const handleUpdateData = (updatedData: { key: any }) => {
    setTableData((prevData: any[]) =>
      prevData.map((item) =>
        item.key === updatedData.key ? { ...item, ...updatedData } : item
      )
    );
  };
  
  const handleSort = (column: string) => {
    const isCurrentColumn = column === sortedColumn;
    let newSortOrders = { ...sortOrders };
  
    if (!isCurrentColumn) {
      newSortOrders = { [column]: "asc" };
    } else {
      newSortOrders[column] = sortOrders[column] === "asc" ? "desc" : "asc";
    }
  
    setSortedColumn(column);
    setSortOrder(newSortOrders[column]);
    setSortOrders(newSortOrders);
  
    const queryParams = Object.keys(newSortOrders)
    .map((col) => `&sort_by=${col}&sort_order=${newSortOrders[col]}`)
    .join("");
    let additionalQueryParams = '&offset=0';
    if (searchTerm !== '' && searchTerm !== null) {
      additionalQueryParams += `&global_search=${searchTerm}`;
    }
    refetchAssetData(queryParams + additionalQueryParams);
  };

  const renderDeallocateButton = (_, record) => (
    <Button
      ghost
      style={{
        borderRadius: "10px",
        background: "#D3D3D3",
        color: "black",
      }}
      onClick={() => {
        setConfirmModalVisible(true); // Show confirmation modal
        setSelectedRecord(record); // Store the selected record for deallocation
      }}
    >
      -
    </Button>
  );
  const handleConfirmDeallocate = () => {
    setConfirmModalVisible(false); // Close the confirmation modal

    if (selectedRecord) {
      // Check if the selected record has a custodian
      if (
        selectedRecord.custodian != null ||
        selectedRecord.custodian != undefined
      ) {
        // Deallocate the asset
        unassign(selectedRecord);
      } else {
        // Show a warning message
        message.warning("Not allocated yet");
      }
    }

    setSelectedRecord(null); // Clear the selected record
  };
  <div>
    <h1>Asset Overview</h1>
  </div>;

  const renderClickableColumn = (columnName, dataIndex) => (_, record) =>
    (
      <div
        data-column-name={columnName}
        onClick={() => handleColumnClick(record, columnName)}
        style={{ cursor: "pointer" }}
      >
        {record[dataIndex]}
      </div>
    );
  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      fixed: "left",
      width: 120,
      responsive: ["md"],
      sorter: true,
      sortOrder: sortedColumn === "product_name" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("product_name"),
      }),
      render: renderClickableColumn("Product Name", "product_name"),
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Serial Number", "serial_number"),
    },
    {
      title: "Location",
      dataIndex: "location",
      responsive: ["md"],
      width: 120,
      filters: locationFilters,
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.location);
        }
        return record.location.indexOf(value.toString()) === 0;
      },
      sorter: true,
      sortOrder: sortedColumn === "location" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("location"),
      }),
      render: renderClickableColumn("Location", "location"),
    },
    {
      title: "Invoice Location",
      dataIndex: "invoice_location",
      responsive: ["md"],
      width: 120,
      filters: locationFilters,
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.location);
        }
        return record.location.indexOf(value.toString()) === 0;
      },
      sorter: true,
      sortOrder: sortedColumn === "invoice_location" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("invoice_location"),
      }),
      render: renderClickableColumn("Invoice Location", "invoice_location"),
    },

    {
      title: "Custodian",
      dataIndex: "custodian",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "custodian" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("custodian"),
      }),
      render: renderClickableColumn("Custodian", "custodian"),
    },
    {
      title: "Asset Type",
      dataIndex: "asset_type",
      responsive: ["md"],
      width: 120,
      filters: assetTypeFilters,
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.asset_type);
        }
        return record.asset_type.indexOf(value.toString()) === 0;
      },
      sorter: true,
      sortOrder: sortedColumn === "asset_type" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("asset_type"),
      }),
      render: renderClickableColumn("Asset Type", "asset_type"),
    },
    {
      title: "Asset Category",
      dataIndex: "asset_category",
      responsive: ["md"],
      width: 140,
      render: renderClickableColumn("Asset Category", "asset_category"),
    },
    {
      title: "Version",
      dataIndex: "version",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "version" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("version"),
      }),
      render: renderClickableColumn("Version", "version"),
    },
    {
      title: "Asset Status",
      dataIndex: "Status",
      responsive: ["md"],
      width: 140,
      render: renderClickableColumn("Asset Status", "status"),
    },
    {
      title: "Date of Purchase",
      dataIndex: "date_of_purchase",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "date_of_purchase" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("date_of_purchase"),
      }),
      render: renderClickableColumn("Date of Purchase", "date_of_purchase"),
    },
    {
      title: "Business Unit",
      dataIndex: "BusinessUnit",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Business Unit", "business_unit"),
    },
    {
      title: "Os",
      dataIndex: "os",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Os", "os"),
    },
    {
      title: "Os Version",
      dataIndex: "os_version",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Os Version", "os_version"),
    },
    {
      title: "Processor",
      dataIndex: "processor",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Processor", "processor"),
    },
    {
      title: "Generation",
      dataIndex: "processor_gen",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Asset Status", "processor_gen"),
    },

    {
      title: "Warranty Period",
      dataIndex: "warranty_period",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "warranty_period" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("warranty_period"),
      }),
      render: renderClickableColumn("Warranty Period", "warranty_period"),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      responsive: ["md"],
      width: 120,
      render: (_, record) => {
        const dateOfPurchase = record.date_of_purchase ? new Date(record.date_of_purchase) : null;
        const warrantyPeriod = parseInt(record.warranty_period) || 0; // Defaulting to 0 if warranty_period is not provided or invalid
        if (dateOfPurchase instanceof Date && !isNaN(dateOfPurchase)) {
          const expiryDate = new Date(dateOfPurchase.getTime() + warrantyPeriod * 30 * 24 * 60 * 60 * 1000); // Calculating expiry date in milliseconds
          const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
          const currentDate = new Date();
          const isExpired = expiryDate < currentDate;
    
          // Apply renderClickableColumn logic here
          return (
            <div
              data-column-name="Expiry Date"
              onClick={() => handleColumnClick(record, "Expiry Date")}
              style={{ cursor: "pointer", color: isExpired ? "red" : "green", fontWeight: isExpired ? "bold" : "bold" }}
            >
              {formattedExpiryDate}
            </div>
          );
        } else {
          return "Invalid Date";
        }
      },
    },
    
,    
{
  title: "License Type",
  dataIndex: "license_type",
  responsive: ["md"],
  width: 120,
 
  render: renderClickableColumn("license_type", "license_type"),
},

    {
      title: "Model Number",
      dataIndex: "ModelNumber", // Corrected dataIndex
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Asset Status", "model_number"),
    },
    {
      title: "Memory",
      dataIndex: "memory",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "memory" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("memory"),
      }),
      render: renderClickableColumn("Memory", "memory"),
    },
    {
      title: "Storage",
      dataIndex: "storage",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Storage", "storage"),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Owner", "owner"),
    },
    {
      title: "Approved By",
      dataIndex: "approved_by",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "approved_by" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("approved_by"),
      }),
      render: renderClickableColumn("Approved By", "approved_by"),
    },
    {
      title: "Requester",
      dataIndex: "requester",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "requester" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("requester"),
      }),
      render: renderClickableColumn("Requester", "requester"),
    },
    {
      title: "Asset Detail Status",
      dataIndex: "asset_detail_status",
      responsive: ["md"],
      width: 140,
      render: renderClickableColumn(
        "Asset Detail Status",
        "asset_detail_status"
      ),
    },
    {
      title: "Asset Assign Status",
      dataIndex: "assign_status",
      responsive: ["md"],
      width: 140,
      render: renderClickableColumn("Asset Assign Status", "assign_status"),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "created_at" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("created_at"),
      }),
      render: renderClickableColumn("Created At", "created_at"),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "updated_at" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("updated_at"),
      }),
      render: renderClickableColumn("Updated At", "updated_at"),
    },

    {
      title: "Accessories",
      dataIndex: "Accessories",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Accessories", "accessories"),
    },
    {
      title: "Approver Notes",
      dataIndex: "approval_status_message",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("approval_status_message", "approval_status_message"),
    },
    {
      title: "Deallocate Asset",
      dataIndex: "DeallocateAsset",
      fixed: "right",
      width: 120,
      render: renderDeallocateButton,
    },
  ];

  const handleColumnClick = (record: string[], columnName: string) => {
    if (columnName !== "Assign Asset") {
      handleOtherColumnClick(record);
    }
  };

  const handleOtherColumnClick = (record: SetStateAction<null>) => {
    setSelectedRow(record);
    setDrawerVisible(true);
  };

  const data = assetData?.results?.map((result) => ({
    key: result.asset_uuid,
    asset_id: result.asset_id,
    asset_category: result.asset_category,
    asset_type: result.asset_type?.asset_type_name,
    version: result.version,
    status: result.status,
    location: result.location?.location_name,
    invoice_location: result.invoice_location?.location_name,
    business_unit: result.business_unit?.business_unit_name,
    os: result.os,
    os_version: result.os_version,
    mobile_os: result.mobile_os,
    processor: result.processor,
    Generation: result.processor_gen,
    accessories: result.accessories,
    date_of_purchase: result.date_of_purchase,
    warranty_period: result.warranty_period,
    asset_detail_status: result.asset_detail_status,
    assign_status: result.assign_status,
    conceder: result.conceder?.username,
    model_number: result.model_number,
    serial_number: result.serial_number,
    memory: result.memory?.memory_space,
    storage: result.storage,
    configuration: result.configuration,
    custodian: result.custodian?.employee_name,
    product_name: result.product_name,
    license_type:result.license_type,
    owner: result.owner,
    requester: result.requester?.username,
    AssignAsset: "assign",
    created_at: result.created_at,
    updated_at: result.updated_at,
    approval_status_message:result.approval_status_message,
  }));

  const drawerTitle = "Asset Details";

  const button = <Button type="primary"></Button>;

  useEffect(() => {
    if (selectedAssetId) {
      refetch();
    }
  }, [selectedAssetId]);

  return (
    <>
      {/* Confirmation Modal */}
      <Modal
        title="Confirm Deallocation"
        visible={confirmModalVisible}
        onOk={handleConfirmDeallocate}
        onCancel={() => setConfirmModalVisible(false)}
        okButtonProps={{ style: { backgroundColor: "red" } }}
        style={{ marginTop: "100px" }}
      >
        <p>Are you sure you want to deallocate the asset?</p>
      </Modal>

      {/* Existing JSX code for AssetTable component */}
      <AssetTable
        totalItemCount={assetData?.count}
        drawerTitle={drawerTitle}
        assetPageDataFetch={refetchAssetData}
        selectedAssetId={selectedAssetId && selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        handleRowClick={handleRowClick}
        onCloseDrawer={onCloseDrawer}
        selectedRow={selectedRow}
        drawerVisible={drawerVisible}
        assetData={data}
        columns={columns}
        memoryData={memoryData}
        assetTypeData={assetTypeData}
        locations={locations}
        sortOrder={sortOrder}
        sortedColumn={sortedColumn}
        statusOptions={statusOptions}
        assetDataRefetch={refetchAssetData}
        asset_uuid={selectedAssetId}
        businessUnitOptions={businessUnitOptions}
        handleUpdateData={function (updatedData: { key: any }): void {
          throw new Error("Function not implemented.");
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  );
};

export default AssetTableHandler;
