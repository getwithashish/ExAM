import React, {
  Key,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { SearchOutlined } from "@ant-design/icons";
import "./DasboardAssetTable.css";
import { useQuery } from "@tanstack/react-query";
import { DataType } from "../AssetTable/types";
import { AssetResult } from "../AssetTable/types";
import {
  getAssetDetails,
  getAssetTypeOptions,
  getLocationOptions,
  getMemoryOptions,
} from "./api/getDashboardAssetDetails";
import DashboardAssetTable from "./DashboardAssetTable";

import TimelineViewDrawer from "../TimelineLog/TimeLineDrawer";
import { json } from "react-router";

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

interface DashboardAssetHandlerProps {
  selectedTypeId: number;
  assetState: string | null;
  detailState: string | null;
  assignState: string | null;
}

const DashboardAssetHandler = ({
  selectedTypeId,
  assetState,
  detailState,
  assignState,
}: DashboardAssetHandlerProps) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [queryParam, setQueryParam] = useState("");
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortOrders, setSortOrders] = useState({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [json_query, setJson_query] = useState<string>("");

  useEffect(() => {
    if (selectedTypeId !== 0) {
      setQueryParam(`&asset_type=${selectedTypeId}`);
    } else if (assetState) {
      setQueryParam(`&status=${assetState}`);
    } else if (detailState) {
      setQueryParam(`&asset_detail_status=${detailState}`);
    } else if (assignState) {
      setQueryParam(`&assign_status=${assignState}`);
    } else {
      setQueryParam(``);
    }
  }, [selectedTypeId, assetState, detailState, assignState]);

  useEffect(() => {});

  const {
    data: assetData,
    isLoading: isAssetDataLoading,
    refetch: assetDataRefetch,
  } = useQuery({
    queryKey: ["assetList", queryParam],
    queryFn: () => getAssetDetails(`${queryParam}`),
  });

  const refetchAssetData = (queryParam = "") => {
    setQueryParam(queryParam);
    assetDataRefetch({ force: true });
  };
  const reset = () => {
    setQueryParam("");
    setJson_query("");
    setSearchTerm("");
    refetchAssetData();
  };
  const statusOptions =
    assetData?.results?.map((item: AssetResult) =>
      item.status === "IN STORE" ? "IN STOCK" : item.status
    ) || [];
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

  const handleSort = (column: string) => {
    const isCurrentColumn = column === sortedColumn;
    let newSortOrders = { ...sortOrders };
    if (!isCurrentColumn) {
      newSortOrders = { [column]: "asc" };
    } else {
      newSortOrders[column] = sortOrders[column] === "asc" ? "desc" : "asc";
    }
    setSortedColumn(column);
    setSortOrders(newSortOrders);
    const queryParams = Object.keys(newSortOrders)
      .map((col) => `&sort_by=${col}&sort_order=${newSortOrders[col]}`)
      .join("");
    let additionalQueryParams = "&offset=${0}";
    if (searchTerm !== "" && searchTerm !== null) {
      additionalQueryParams += `&global_search=${searchTerm}`;
    }
    if (json_query !== "" && json_query !== null) {
      additionalQueryParams += `&json_logic=${json_query}`;
    }
    refetchAssetData(queryParams + additionalQueryParams);
  };

  <div>
    <h1>Asset Overview</h1>
  </div>;

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
      filterIcon: <SearchOutlined />,
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
      sorter: true,
      sortOrder: sortedColumn === "asset_category" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("asset_category"),
      }),
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
      render: renderClickableColumn("processor_gen", "processor_gen"),
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
      title: "Model Number",
      dataIndex: "model_number",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "model_number" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("model_number"),
      }),
      render: renderClickableColumn("Model Number", "model_number"),
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
      title: "View Asset Log",
      dataIndex: "Accessories",
      responsive: ["md"],
      fixed: "right",
      width: 140,
      render: (_, record) => <TimelineViewDrawer assetUuid={record.key} />,
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
    asset_type: result.asset_type.asset_type_name,
    version: result.version,
    status: result.status === "IN STORE" ? "IN STOCK" : result.status,
    location: result.location?.location_name,
    invoice_location: result.invoice_location?.location_name,
    business_unit: result.business_unit.business_unit_name,
    os: result.os,
    os_version: result.os_version,
    mobile_os: result.mobile_os,
    processor: result.processor,
    processor_gen: result.processor_gen,
    accessories: result.accessories,
    date_of_purchase: result.date_of_purchase,
    warranty_period: result.warranty_period,
    asset_detail_status: result.asset_detail_status,
    assign_status: result.assign_status,
    approved_by: result.approved_by?.username,
    model_number: result.model_number,
    serial_number: result.serial_number,
    memory: result.memory?.memory_space,
    storage: result.storage,
    configuration: result.configuration,
    custodian: result.custodian?.employee_name,
    product_name: result.product_name,
    owner: result.owner,
    requester: result.requester?.username,
    AssignAsset: "assign",
    created_at: result.created_at,
    updated_at: result.updated_at,
    
  }));

  const drawerTitle = "Asset Details";

  return (
    <div>
      <DashboardAssetTable
        drawerTitle={drawerTitle}
        isAssetDataLoading={isAssetDataLoading}
        handleRowClick={handleRowClick}
        onCloseDrawer={onCloseDrawer}
        selectedRow={selectedRow}
        drawerVisible={drawerVisible}
        assetData={data}
        sortOrder={sortOrder}
        sortedColumn={sortedColumn}
        totalItemCount={assetData?.count}
        assetPageDataFetch={setQueryParam}
        columns={columns}
        reset={reset}
        memoryData={memoryData}
        assetTypeData={assetTypeData}
        locations={locations}
        statusOptions={statusOptions}
        bordered={false}
        businessUnitOptions={businessUnitOptions}
        assetDataRefetch={refetchAssetData}
        handleUpdateData={function (updatedData: { key: any }): void {
          throw new Error("Function not implemented.");
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setJson_query={setJson_query}
        json_query={json_query}
      />
    </div>
  );
};

export default DashboardAssetHandler;
