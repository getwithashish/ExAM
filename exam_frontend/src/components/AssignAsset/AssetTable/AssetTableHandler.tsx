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
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
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
import ExportButton from "../../Export/Export";
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

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

const AssetTableHandler = ({showAssignDrawer}) => {
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
      let logsDataExpanded = [];
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

  const nestedcolumns: TableColumnsType<DataType> = [];

  const nesteddata: DataType[] = [];
  for (let i = 0; i < 1; ++i) {
    nesteddata.push({
      key: i.toString(),
      name: "Screen",
      platform: "iOS",
      version: "10.3.4.5654",
      upgradeNum: 500,
      creator: "Jack",
      createdAt: "2014-12-24 23:12:00",
    });
  }

  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { data: assetData } = useQuery({
    queryKey: ["assetList"],
    queryFn: () => getAssetDetails(),
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

const renderClickableColumn = (columnName, dataIndex) => (_, record) => (
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
      title: "Custodian",
      dataIndex: "custodian",
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
    {
      title: 'Version',
      dataIndex: 'Version',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Version", "version"),

    },
    {
      title: 'Asset Status',
      dataIndex: 'Status',
      responsive: ['md'],
      width: 140,
      render: renderClickableColumn("Asset Status", "status"),

    },
    {
      title: 'Business Unit',
      dataIndex: 'BusinessUnit',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Business Unit", "business_unit"),

    },
    {
      title: 'Os',
      dataIndex: 'os',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Os", "os"),

    },
    {
      title: 'Os Version',
      dataIndex: 'os_version',
      responsive: ['md'],
       width: 120,
      render: renderClickableColumn("Os Version", "os_version"),

    },
    {
      title: 'Processor',
      dataIndex: 'processor',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Processor", "processor"),

    },
    {
      title: 'Generation',
      dataIndex: 'processor_gen',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Asset Status", "processor_gen"),

    },
    {
      title: 'Date Of Purchase',
      dataIndex: 'DateOfPurchase',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Asset Status", "date_of_purchase"),

    },
    {
      title: 'Warranty Period',
      dataIndex: 'WarrantyPeriod',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Asset Status", "warranty_period"),

    },
    {
      title: 'Model Number',
      dataIndex: 'ModelNumber', // Corrected dataIndex
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Asset Status", "model_number"),

    },
    {
      title: 'Memory',
      dataIndex: 'Memory',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Asset Status", "memory"),

    },
    {
      title: 'Storage',
      dataIndex: 'storage',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Storage", "storage"),

    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Owner", "owner"),

    },
    {
      title: 'Approved By',
      dataIndex: 'approved_by',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Approved By", "approved_by"),

    },
    {
      title: 'Requester',
      dataIndex: 'requester',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Requester", "requester"),

    },
    {
      title: 'Asset Detail Status',
      dataIndex: 'asset_detail_status',
      responsive: ['md'],
      width: 140,
      render: renderClickableColumn("Asset Detail Status", "asset_detail_status"),

    },
    {
      title: 'Asset Assign Status',
      dataIndex: 'assign_status',
      responsive: ['md'],
      width: 140,
      render: renderClickableColumn("Asset Assign Status", "assign_status"),

    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Accessories", "created_at"),

    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Accessories", "updated_at"),

    },
 
    {
      title: 'Accessories',
      dataIndex: 'Accessories',
      responsive: ['md'],
      width: 120,
      render: renderClickableColumn("Accessories", "accessories"),
    },
    
    {
      title: 'Asset Log',
      dataIndex: 'Accessories',
      responsive: ['md'],
      fixed:"right",
       width: 120,
       
       render: () => (
        <span>
          <FontAwesomeIcon icon={faBookOpenReader} className="plus-icon" /> {/* Plus button icon */}
        </span>
      ),
    
     
 
    },
  
    {
      title: "Assign Asset",
      dataIndex: "AssignAsset",
      fixed: "right",
       width: 120,
      render: (_data, record) => (
        <Button
          ghost
          style={{
            borderRadius: "10px",
            background: "#D3D3D3",
            color: "black",
          }}
          onClick={() => {
            console.log("button clicked ")
            if (record.custodian == null || record.custodian == undefined) {
              showAssignDrawer(record);
            } else {
              alert("Already assigned");
            }
          }}
          
        >
          +
        </Button>
      ),
    }
  
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

  const data = assetData?.map((result) => ({
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
    owner: result.owner,
    requester: result.requester?.username,
    AssignAsset: "assign",
    created_at: result.created_at,
    updated_at: result.updated_at,
  }));

  const drawerTitle = "Asset Details";

  const button = <Button type="primary"></Button>;

  useEffect(() => {
    if (selectedAssetId) {
      refetch();
    }
  }, [selectedAssetId]);

  return (
    <AssetTable
      showAssignDrawer={showAssignDrawer}
      drawerTitle={drawerTitle}
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
      drawerTitle={""}
    />
  );
};

export default AssetTableHandler;
