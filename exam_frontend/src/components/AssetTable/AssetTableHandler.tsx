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

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}
interface AssetTableHandlerProps {
  isRejectedPage: boolean;
}

const AssetTableHandler = ({ isRejectedPage, queryParamProp,heading }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null); // State to store the selected asset ID

  const {
    data: logsData,
    error,
    isLoading,
    isSuccess,
    isFetching,
    isRefetchError,
    refetch,
  } = useQuery<LogData[], Error>({
    queryKey: ["assetLogsData", selectedAssetId], // Include selectedAssetId in the query key
    queryFn: () => getAssetLog(selectedAssetId),
  });

  const expandedRowRender = useCallback(
    (assetId: string) => {
      let logsDataExpanded: readonly any[] | undefined = [];
      const columnsLog: TableColumnsType<ExpandedDataType> = [
        { title: "timestamp", dataIndex: "timestamp", key: "timestamp" },
        {
          title: "asset_category",
          dataIndex: "asset_category",
          key: "asset_category",
        },
        {
          title: "asset_detail_status",
          key: "asset_detail_status",
          dataIndex: "asset_detail_status",
        },
        {
          title: "assign_status",
          dataIndex: "assign_status",
          key: "assign_status",
        },
        { title: "created_at", dataIndex: "created_at", key: "created_at" },
        {
          title: "product_name",
          dataIndex: "product_name",
          key: "product_name",
        },
        { title: "updated_at", dataIndex: "updated_at", key: "updated_at" },
        {
          title: "date_of_purchase",
          dataIndex: "date_of_purchase",
          key: "date_of_purchase",
        },
        {
          title: "model_number",
          dataIndex: "model_number",
          key: "model_number",
        },
        { title: "Asset Type", dataIndex: "asset_type", key: "asset_type" },

        { title: "Location", dataIndex: "location", key: "location" },
        {
          title: "Invoice Location",
          dataIndex: "invoice_location",
          key: "invoice_location",
        },
        {
          title: "Warranty Period",
          dataIndex: "warranty_period",
          key: "warranty_period",
        },
        {
          title: "Version",
          dataIndex: "version",
          key: "version",
        },
        {
          title: "Configuration",
          dataIndex: "configuration",
          key: "configuration",
        },
        {
          title: "Storage",
          dataIndex: "storage",
          key: "storage",
        },
        {
          title: "Os",
          dataIndex: "os",
          key: "os",
        },
        {
          title: "Owner",
          dataIndex: "owner",
          key: "owner",
        },
        {
          title: "Notes",
          dataIndex: "notes",
          key: "notes",
        },
      ];

      console.log("logsdata", logsData);
      if (isSuccess && !isLoading && logsData?.length) {
        for (let i = 0; logsData && i < (logsData as LogData[]).length; i++) {
          let { asset_log }: LogData = (logsData as LogData[])[i];
          const timestamp =
            logsData !== undefined &&
            logsData?.timestamp &&
            new Date(logsData!.timestamp);
          // Convert timestamp to Date object
          const formattedTimestamp = timestamp?.toLocaleString(); // Format the timestamp as a string in the local time zone

          const createdAt = new Date(asset_log?.created_at); // Convert created_at timestamp to Date object
          const formattedCreatedAt = createdAt.toLocaleString(); // Format the created_at timestamp

          const updatedAt = new Date(asset_log?.updated_at); // Convert updated_at timestamp to Date object
          const formattedUpdatedAt = updatedAt.toLocaleString();

          logsDataExpanded = [
            ...logsDataExpanded,
            {
              ...asset_log,
              key: asset_log.asset_id,
              timestamp: formattedTimestamp,
              asset_category: asset_log.asset_category,
              asset_detail_status: asset_log.asset_detail_status,
              assign_status: asset_log.assign_status,
              created_at: formattedCreatedAt,
              product_name: asset_log.product_name,
              updated_at: formattedUpdatedAt,
              date_of_purchase: asset_log.date_of_purchase,
              date: asset_log.date_of_purchase,
              asset_type: asset_log.asset_type.asset_type_name,
              location: asset_log.location.location_name,
              invoice_location:
                asset_log.invoice_location.invoice_location_name,
                warranty_period:asset_log.warranty_period,
                version:asset_log.version,
                configuration:asset_log.configuration,
                storage:asset_log.storage,
                os:asset_log.os,
                owner:asset_log.owner,
                notes:asset_log.notes,
              name: asset_log.product_name,
              upgradeNum: asset_log.assign_status,
            },
          ];
        }
        console.log("logsDataexpanded", logsDataExpanded);
        return (
          <Table
            columns={columnsLog}
            dataSource={logsDataExpanded}
            pagination={false}
            style={{
              maxHeight: 300,
              overflowY: "auto",
              maxWidth: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          />
        );
      } else return <>no data</>;
    },
    [selectedAssetId, isSuccess, logsData]
  );

  // const nestedcolumns: TableColumnsType<DataType> = [];

  // const nesteddata: DataType[] = [];
  // for (let i = 0; i < 1; ++i) {
  //   nesteddata.push({
  //     key: i.toString(),

  //   });
  // }

  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { data: assetData } = useQuery({
    queryKey: ["assetList"],
    queryFn: () => getAssetDetails(queryParamProp),
  });

  const statusOptions =
    assetData?.map((item: AssetResult) => item.status) || [];
  const businessUnitOptions =
    assetData?.map(
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
  </div>

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      fixed: "left",
      // width: 160,
      responsive: ['md'],
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
      render: (_: any, record: string[]) => (
        <div
          data-column-name="Product Name"
          onClick={() => handleColumnClick(record, "Product Name")}
          style={{ cursor: "pointer" }}
        >
          {record.product_name}
        </div>
      ),
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      responsive: ["md"],
      // width: 160,
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
      render: (_: any, record: string[]) => (
        <div
          data-column-name="Serial Number"
          onClick={() => handleColumnClick(record, "Serial Number")}
          style={{ cursor: "pointer" }}
        >
          {record.serial_number}
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      responsive: ["md"],
      // width: 160,
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
      render: (_: any, record: string[]) => (
        <div
          data-column-name="Location"
          onClick={() => handleColumnClick(record, "Location")}
          style={{ cursor: "pointer" }}
        >
          {record.location}
        </div>
      ),
    },
    {
      title: "Invoice Location",
      dataIndex: "invoice_location",
      responsive: ["md"],
      // width: 160,
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
      render: (_: any, record: string[]) => (
        <div
          data-column-name="Invoice Location"
          onClick={() => handleColumnClick(record, "Invoice Location")}
          style={{ cursor: "pointer" }}
        >
          {record.location}
        </div>
      ),
    },
    {
      title: "Custodian",
      dataIndex: "custodian",
      responsive: ["md"],
      // width: 160,
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
      render: (_: any, record: string[]) => (
        <div
          data-column-name="Custodian"
          onClick={() => handleColumnClick(record, "Custodian")}
          style={{ cursor: "pointer" }}
        >
          {record.custodian}
        </div>
      ),
    },
    {
      title: "Asset Type",
      dataIndex: "asset_type",
      responsive: ["md"],
      // width: 160,
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
      render: (_: any, record: string[]) => (
        <div
          data-column-name="Asset Type"
          onClick={() => handleColumnClick(record, "Asset Type")}
          style={{ cursor: "pointer" }}
        >
          {record.asset_type}
        </div>
      ),
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

  const data = assetData?.map(
    (result: {
      asset_uuid: any;
      asset_id: any;
      asset_category: any;
      asset_type: { asset_type_name: any };
      version: any;
      status: any;
      location: { location_name: any };
      invoice_location: { location_name: any };
      business_unit: { business_unit_name: any };
      os: any;
      os_version: any;
      mobile_os: any;
      processor: any;
      processor_gen: any;
      accessories: any;
      date_of_purchase: any;
      warranty_period: any;
      asset_detail_status: any;
      assign_status: any;
      conceder: { username: any };
      model_number: any;
      serial_number: any;
      memory: { memory_space: any };
      storage: any;
      configuration: any;
      custodian: { employee_name: any };
      product_name: any;
      owner: any;
      requester: { username: any };
      created_at: any;
      updated_at: any;
    }) => ({
      key: result.asset_uuid,
      asset_id: result.asset_id,
      asset_category: result.asset_category,
      asset_type: result.asset_type.asset_type_name,
      version: result.version,
      status: result.status,
      location: result.location.location_name,
      invoice_location: result.invoice_location.location_name,
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
      conceder: result.conceder?.username,
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
    })
  );

  const drawerTitle = "Asset Details";

  const button = <Button type="primary"></Button>;

  useEffect(() => {
    if (selectedAssetId) {
      refetch();
    }
  }, [selectedAssetId]);

  return (
    <AssetTable
     heading={heading}
      // drawerTitle={drawerTitle}
      logsData={logsData}
      isLoading={isLoading}
      isSuccess={isSuccess}
      selectedAssetId={selectedAssetId && selectedAssetId}
      setSelectedAssetId={setSelectedAssetId}
      handleRowClick={handleRowClick}
      onCloseDrawer={onCloseDrawer}
      selectedRow={selectedRow}
      drawerVisible={drawerVisible}
      assetData={data}
      columns={columns}
      expandedRowRender={expandedRowRender}
      memoryData={memoryData}
      assetTypeData={assetTypeData}
      locations={locations}
      statusOptions={statusOptions}
      asset_uuid={selectedAssetId}
      businessUnitOptions={businessUnitOptions}
      handleUpdateData={function (updatedData: { key: any }): void {
        throw new Error("Function not implemented.");
      }}
      // drawerTitle={""}
    />
  );
};

export default AssetTableHandler;
