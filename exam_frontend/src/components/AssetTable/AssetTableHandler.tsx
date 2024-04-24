import React, {
  Key,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Badge,
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { SearchOutlined } from "@ant-design/icons";
import "./AssetTable.css";
import CardComponent from "../CardComponent/CardComponent";
import { CloseOutlined } from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import { isError, useQuery } from "@tanstack/react-query";
import { DataType, LogData } from "../AssetTable/types";
import { ColumnFilterItem } from "../AssetTable/types";
import { AssetResult } from "../AssetTable/types";
import { FilterDropdownProps } from "../AssetTable/types";
import { useInfiniteQuery } from "react-query";

import { DownOutlined } from "@ant-design/icons";
import ExportButton from "../Export/Export";
import { getAssetLog } from "./api/getAssetLog";
import { AxiosError } from "axios";
import AssetTable from "./AssetTable";
import {
  getAssetDetails,
  getAssetTypeOptions,
  getLocationOptions,
  getMemoryOptions,
} from "./api/getAssetDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons";
import { Notes } from "@mui/icons-material";

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}
interface AssetTableHandlerProps {
  isRejectedPage: boolean;
}

const AssetTableHandler = ({
  isRejectedPage,
  queryParamProp,
  heading,
  isMyApprovalPage,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const [queryParam, setQueryParam] = useState("");
  const { data: assetData, isLoading: isAssetDataLoading, refetch: assetDataRefetch } = useQuery({
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
  (assetData?.results?.map((item: AssetResult) =>
    item.status === 'IN STORE' ? 'IN STOCK' : item.status
  ) || []);
  const businessUnitOptions =
    assetData?.results?.map(
      (item: AssetResult) => item.business_unit.business_unit_name
    ) || [];

  const { data: locationResults } = useQuery({
    queryKey: ["location"],
    queryFn: () => getLocationOptions(),
  });

  const locations = locationResults ? locationResults : [];

  const locationFilters = locations.map((location: { location_name: any }) => ({
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
    assetTypeData?.map((assetType: { asset_type_name: any }) => ({
      text: assetType.asset_type_name,
      value: assetType.asset_type_name,
    })) ?? [];

  const assetDataList = assetData;
  // console.log("Testing on 65:", assetDataList ? assetDataList[0].results : []);

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
            placeholder="Search Product Name"
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
        record: { product_name: string | any[] }
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.product_name);
        }
        return record.product_name.indexOf(value.toString()) === 0;
      },
      sorter: (a: { product_name: string }, b: { product_name: any }) =>
        a.product_name.localeCompare(b.product_name),
      sortDirections: ["ascend", "descend"],
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

      render: renderClickableColumn("Invoice Location", "invoice_location"),
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
      render: renderClickableColumn("Asset Type", "asset_type"),
    },
    {
      title: "Asset Category",
      dataIndex: "asset_category",
      responsive: ["md"],
      width: 140,
      render: renderClickableColumn("Asset Category", "asset_category"),
    },
    // {
    //   title: "Asset Status",
    //   dataIndex: "Status",
    //   responsive: ["md"],
    //   width: 140,
    //   render: (_, record) => {
    //     const displayedStatus = record.Status === "IN STORE" ? "IN STOCK" : record.Status;
    //     console.log("The displayed status is:"+displayedStatus)
    //     return (
    //       <div
    //         data-column-name="Asset Status"
    //         onClick={() => handleColumnClick(record, "Asset Status")}
    //         style={{ cursor: "pointer" }}
    //       >
    //         {displayedStatus}
    //       </div>
    //     );
    //   },
    // },
    
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
      title: "Date Of Purchase",
      dataIndex: "DateOfPurchase",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Asset Status", "date_of_purchase"),
    },
    {
      title: "Warranty Period",
      dataIndex: "WarrantyPeriod",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Asset Status", "warranty_period"),
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
      dataIndex: "Memory",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Asset Status", "memory"),
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
      render: renderClickableColumn("Approved By", "approved_by"),
    },
    {
      title: "Requester",
      dataIndex: "requester",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Requester", "requester"),
    },
    {
      title: "Asset Detail Status",
      dataIndex: "asset_detail_status",
      responsive: ["md"],
      width: 140,
      render: renderClickableColumn("Asset Detail Status", "asset_detail_status"),

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
      render: renderClickableColumn("Accessories", "created_at"),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Accessories", "updated_at"),
    },

    {
      title: "Accessories",
      dataIndex: "Accessories",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("Accessories", "accessories"),
    },
    {
      title: "Comments",
      dataIndex: "notes",
      responsive: ["md"],
      width: 120,
      render: renderClickableColumn("notes", "notes"),
    },
    {
      title: "Custodian",
      dataIndex: "custodian",
      responsive: ["md"],
      width: 120,
      fixed: "right",
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
            placeholder="Search Custodian"
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
        record: { custodian: string | any[] }
      ) => {
        // Check if record.custodian is defined before accessing it
        if (record.custodian) {
          if (Array.isArray(value)) {
            return value.includes(record.custodian);
          }
          return record.custodian.indexOf(value.toString()) === 0;
        }
        return false; // Return false if custodian is undefined
      },
      render: renderClickableColumn("Custodian", "custodian"),
    },

    ...(isRejectedPage
      ? [
          {
            title: "Reject Type",
            dataIndex: "asset_type",
            responsive: ["md"],
            fixed: "right",
            width: 160,
            filters: assetTypeFilters,
            onFilter: (
              value: string | number | boolean | React.ReactText[] | Key,
              record: DataType
            ) => {
              if (Array.isArray(value)) {
                return value.includes(record.asset_detail_status);
              }
              return record.asset_detail_status.indexOf(value.toString()) === 0;
            },
            render: (_: any, record: string[]) => (
              <div
                data-column-name="Asset Type"
                onClick={() => handleColumnClick(record, "Asset Type")}
                style={{ cursor: "pointer" }}
              >
                {record.asset_detail_status}
              </div>
            ),
          },
        ]
      : []),
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
    Generation: result.processor_gen,
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

  const button = <Button type="primary"></Button>;

  return (
    <AssetTable
      heading={heading}
      isAssetDataLoading={isAssetDataLoading}
      // drawerTitle={drawerTitle}
      totalItemCount={assetData?.count}
      // assetPageDataFetch={setQueryParam}
      assetPageDataFetch={refetchAssetData}
      handleRowClick={handleRowClick}
      onCloseDrawer={onCloseDrawer}
      selectedRow={selectedRow}
      drawerVisible={drawerVisible}
      assetData={data}
      columns={columns}
      memoryData={memoryData}
      assetTypeData={assetTypeData}
      locations={locations}
      isMyApprovalPage={isMyApprovalPage}
      statusOptions={statusOptions}
      assetDataRefetch={refetchAssetData}
      businessUnitOptions={businessUnitOptions}
      handleUpdateData={function (updatedData: { key: any }): void {
        throw new Error("Function not implemented.");
      }}
      // drawerTitle={""}
    />
  );
};

export default AssetTableHandler;
