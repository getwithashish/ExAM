import React, { Key, SetStateAction, useCallback, useState } from "react";
import { Button, Input, Space } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import "./AssetTable.css";
import { useQuery } from "@tanstack/react-query";
import { DataType } from "../AssetTable/types";
import { AssetResult } from "../AssetTable/types";
import AssetTable from "./AssetTable";
import {
  getAssetDetails,
  getAssetTypeOptions,
  getLocationOptions,
  getMemoryOptions,
} from "../../AssetTable/api/getAssetDetails";

const AssetTableHandler = ({
  queryParam,
  setQueryParam,
  assetData,
  isAssetDataLoading,
  assetDataRefetch,
  showAssignDrawer,
  queryParamProp,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sortedColumn, setSortedColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortOrders, setSortOrders] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    let additionalQueryParams = "&offset=0";
    if (searchTerm !== "" && searchTerm !== null) {
      additionalQueryParams += `&global_search=${searchTerm}`;
    }
    refetchAssetData(queryParams + additionalQueryParams);
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
      filterIcon: <SearchOutlined />,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (keys: React.ReactText[]) => void;
        selectedKeys: React.ReactText[];
        confirm: () => void;
        clearFilters: () => void;
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Serial Number"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <button
              type="button"
              onClick={confirm}
              style={{ width: 90, fontSize: "16px" }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              style={{ width: 90, fontSize: "16px" }}
            >
              Reset
            </button>
          </Space>
        </div>
      ),
      onFilter: (
        value: string | any[],
        record: { serial_number: string | any[] }
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.serial_number);
        }
        return record.serial_number.indexOf(value.toString()) === 0;
      },
      sorter: (a: { serial_number: string }, b: { serial_number: any }) =>
        a.serial_number.localeCompare(b.serial_number),
      sortDirections: ["ascend", "descend"],
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
        const dateOfPurchase = record.date_of_purchase
          ? new Date(record.date_of_purchase)
          : null;
        const warrantyPeriod = parseInt(record.warranty_period) || 0; // Defaulting to 0 if warranty_period is not provided or invalid
        if (dateOfPurchase instanceof Date && !isNaN(dateOfPurchase)) {
          const expiryDate = new Date(
            dateOfPurchase.getTime() + warrantyPeriod * 30 * 24 * 60 * 60 * 1000
          ); // Calculating expiry date in milliseconds
          const formattedExpiryDate = expiryDate.toISOString().split("T")[0];
          const currentDate = new Date();
          const isExpired = expiryDate < currentDate;

          // Apply renderClickableColumn logic here
          return (
            <div
              data-column-name="Expiry Date"
              onClick={() => handleColumnClick(record, "Expiry Date")}
              style={{
                cursor: "pointer",
                color: isExpired ? "red" : "green",
                fontWeight: isExpired ? "bold" : "bold",
              }}
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
      title: "Assign Asset",
      dataIndex: "AssignAsset",
      fixed: "right",
      width: 120,
      render: (_data, record) => (
        <Button
          className="ml-6"
          ghost
          type="primary"
          shape="circle"
          icon={<UserAddOutlined />}
          onClick={() => {
            showAssignDrawer(record);
          }}
        />
      ),
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
    status: result.status === "IN STORE" ? "IN STOCK" : result.status,
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
    license_type: result.license_type,
    owner: result.owner,
    requester: result.requester?.username,
    AssignAsset: "assign",
    created_at: result.created_at,
    updated_at: result.updated_at,
  }));

  const drawerTitle = "Asset Details";

  const button = <Button type="primary"></Button>;

  return (
    <AssetTable
      totalItemCount={assetData?.count}
      handleRowClick={handleRowClick}
      assetPageDataFetch={refetchAssetData}
      isAssetDataLoading={isAssetDataLoading}
      onCloseDrawer={onCloseDrawer}
      selectedRow={selectedRow}
      drawerVisible={drawerVisible}
      assetData={data}
      columns={columns}
      sortOrder={sortOrder}
      sortedColumn={sortedColumn}
      memoryData={memoryData}
      assetTypeData={assetTypeData}
      locations={locations}
      statusOptions={statusOptions}
      assetDataRefetch={refetchAssetData}
      businessUnitOptions={businessUnitOptions}
      handleUpdateData={function (updatedData: { key: any }): void {
        throw new Error("Function not implemented.");
      }}
      drawerTitle={""}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};

export default AssetTableHandler;
