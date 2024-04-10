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

import { SearchOutlined } from "@ant-design/icons";
import "./DasboardAssetTable.css";
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
import { getDasboardAssetLogDetails } from "../DashboardAssetTable/api/getDasboardAssetLogDetails";
import { AxiosError } from "axios";

import {
  getAssetDetails,
  getAssetTypeOptions,
  getLocationOptions,
  getMemoryOptions,
} from "../DashboardAssetTable/api/getDasboardAssetDetails";
import DasboardAssetTable from "./DasboardAssetTable";

import TimelineButton from "../TimelineLog/TimeLineDrawer"

interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

const DasboardAssetHandler = () => {

  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [queryParam, setQueryParam] = useState("");

  const { data: assetData, refetch: assetDataRefetch } = useQuery({
    queryKey: ["assetList", queryParam],
    queryFn: () => getAssetDetails(`${queryParam}`),
  });

  const refetchAssetData = (queryParam = "") => {
    setQueryParam(queryParam);
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
  const renderClickableColumn = (columnName, dataIndex) => (_, record) => (
    <div
      data-column-name={columnName}
      onClick={() => handleColumnClick(record, columnName)}
      style={{ cursor: "pointer" }}
    >
      {record[dataIndex]}
    </div>
  );
  const handleViewAssetLog = (assetId) => {
    // Logic to handle viewing asset log for the selected asset ID
    console.log("Viewing asset log for asset ID:", assetId);
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
      // filterIcon: <SearchOutlined />,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
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
      onFilter: (value, record) => {
        if (Array.isArray(value)) {
          return value.includes(record.product_name);
        }
        return record.product_name.indexOf(value.toString()) === 0;
      },
      sorter: (a, b) => a.product_name.localeCompare(b.product_name),
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
      onFilter: (value, record) => {
        if (Array.isArray(value)) {
          return value.includes(record.serial_number);
        }
        return record.serial_number.indexOf(value.toString()) === 0;
      },
      sorter: (a, b) => a.serial_number.localeCompare(b.serial_number),
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
      onFilter: (value, record) => {
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
      // fixed: "right",
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
      filters: assetTypeFilters,
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.asset_category);
        }
        return record.asset_category.indexOf(value.toString()) === 0;
      },
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
      filters: [
        {
          text: 'In Use ',
          value: 'In Use',
        },
        {
          text: 'In Store',
          value: 'In Store',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
     
        if (Array.isArray(value)) {
          return value.includes(record.status);
        }
        return record.status.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Asset Status", "status"),

    },
    {
      title: 'Business Unit',
      dataIndex: 'BusinessUnit',
      responsive: ['md'],
      width: 120,
      // filters: [
      //   {
      //     text: 'du1 ',
      //     value: 'du1',
      //   },
      //   {
      //     text: 'du2',
      //     value: 'du2',
      //   },
      //   {
      //     text: 'du3 ',
      //     value: 'du3',
      //   },
      //   {
      //     text: 'du4',
      //     value: 'du4',
      //   },
      // ],
     
      // onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
      //   if (Array.isArray(value)) {
      //     return value.includes(record.business_unit);
      //   }
      //   return record.business_unit.indexOf(value.toString()) === 0;
      // },
      render: renderClickableColumn("Business Unit", "business_unit"),

    },
    {
      title: 'Os',
      dataIndex: 'os',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: 'Linux ',
          value: 'Linux',
        },
        {
          text: 'Windows',
          value: 'Windows',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.os);
        }
        return record.os.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Os", "os"),

    },
    {
      title: 'Os Version',
      dataIndex: 'os_version',
      responsive: ['md'],
       width: 120,
      filters: [
        {
          text: '11',
          value: '11',
        },
        {
          text: '12',
          value: '12',
        }
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.os_version);
        }
        return record.os_version.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Os Version", "os_version"),

    },
    {
      title: 'Processor',
      dataIndex: 'processor',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: 'i5',
          value: 'i5',
        },
        {
          text: 'i3',
          value: 'i3',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.processor);
        }
        return record.processor.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Processor", "processor"),

    },
    {
      title: 'Generation',
      dataIndex: 'processor_gen',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: 'In Use ',
          value: 'In Use',
        },
        {
          text: 'In Store',
          value: 'In Store',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Generation);
        }
        return record.Generation.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Asset Status", "processor_gen"),

    },
    {
      title: 'Date Of Purchase',
      dataIndex: 'DateOfPurchase',
      responsive: ['md'],
      width: 120,

      filters: [
        {
          text: '02/03/24 ',
          value: '02/03/24 ',
        },
        {
          text: '03/03/24 ',
          value: '03/03/24 ',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        const dateValue = new Date(value as string).getTime(); // Convert filter value to timestamp
        const recordDate = record.date_of_purchase.getTime(); // Get timestamp of record's date
    
        if (Array.isArray(value)) {
          return value.includes(record.date_of_purchase);
        }
        return recordDate === dateValue;
      },
      render: renderClickableColumn("Asset Status", "date_of_purchase"),

    },
    {
      title: 'Warranty Period',
      dataIndex: 'WarrantyPeriod',
      responsive: ['md'],
      width: 120,

      filters: [
        {
          text: ' 2Years',
          value: '2Years',
        },
        {
          text: '3Years',
          value: '3Years',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.warranty_period);
        }
        return record.warranty_period.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Asset Status", "warranty_period"),

    },
    {
      title: 'Model Number',
      dataIndex: 'ModelNumber', // Corrected dataIndex
      responsive: ['md'],
      width: 120,

      filterIcon: <SearchOutlined rev={undefined} />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Model Number"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <button
              type="button"
              onClick={confirm}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </button>
          </Space>
        </div>
      ),
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.model_number);
        }
        return record.model_number.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Asset Status", "model_number"),

    },
    {
      title: 'Memory',
      dataIndex: 'Memory',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: '16Gb',
          value: '16Gb',
        },
        {
          text: '128Gb',
          value: '128Gb',
        },
      ],
      
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.memory);
        }
        return record.memory.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Asset Status", "memory"),

    },
    {
      title: 'Storage',
      dataIndex: 'storage',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: '16Gb',
          value: '16Gb',
        },
        {
          text: '128Gb',
          value: '128Gb',
        },
      ],
      
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.storage);
        }
        return record.storage.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Storage", "storage"),

    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: '16Gb',
          value: '16Gb',
        },
        {
          text: '128Gb',
          value: '128Gb',
        },
      ],
      
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.owner);
        }
        return record.owner.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Owner", "owner"),

    },
    {
      title: 'Approved By',
      dataIndex: 'approved_by',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: 'Sfm Lead',
          value: 'Sfm Lead',
        },
        {
          text: 'Sfm Manager',
          value: 'Sfm Manager',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.approved_by);
        }
        return record.approved_by.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Approved By", "approved_by"),

    },
    {
      title: 'Requester',
      dataIndex: 'requester',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: 'Sfm Lead',
          value: 'Sfm Lead',
        },
        {
          text: 'Sfm Manager',
          value: 'Sfm Manager',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.requester);
        }
        return record.requester.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Requester", "requester"),

    },
    {
      title: 'Asset Detail Status',
      dataIndex: 'asset_detail_status',
      responsive: ['md'],
      width: 140,
      filters: [
        {
          text: 'Sfm Lead',
          value: 'Sfm Lead',
        },
        {
          text: 'Sfm Manager',
          value: 'Sfm Manager',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.asset_detail_status);
        }
        return record.asset_detail_status.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Asset Detail Status", "asset_detail_status"),

    },
    {
      title: 'Asset Assign Status',
      dataIndex: 'assign_status',
      responsive: ['md'],
      width: 140,
      filters: [
        {
          text: 'Sfm Lead',
          value: 'Sfm Lead',
        },
        {
          text: 'Sfm Manager',
          value: 'Sfm Manager',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.assign_status);
        }
        return record.assign_status.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Asset Assign Status", "assign_status"),

    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: 'Sfm Lead',
          value: 'Sfm Lead',
        },
        {
          text: 'Sfm Manager',
          value: 'Sfm Manager',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.created_at);
        }
        return record.created_at.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: 'Sfm Lead',
          value: 'Sfm Lead',
        },
        {
          text: 'Sfm Manager',
          value: 'Sfm Manager',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.updated_at);
        }
        return record.updated_at.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Accessories", "updated_at"),

    },
 
    {
      title: 'Accessories',
      dataIndex: 'Accessories',
      responsive: ['md'],
      width: 120,
      filters: [
        {
          text: 'In Use ',
          value: 'In Use',
        },
        {
          text: 'In Store',
          value: 'In Store',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.accessories);
        }
        return record.accessories.indexOf(value.toString()) === 0;
      },
      render: renderClickableColumn("Accessories", "accessories"),

    },
    {
      title: 'View Asset Log',
      dataIndex: 'Accessories',
      responsive: ['md'],
      fixed: 'right',
      width: 140,
      render: (_,record) => (
        <TimelineButton assetUuid={record.key} />
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
    asset_type: result.asset_type.asset_type_name,
    version: result.version,
    status: result.status,
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
    <DasboardAssetTable
      drawerTitle={drawerTitle}

      handleRowClick={handleRowClick}
      onCloseDrawer={onCloseDrawer}
      selectedRow={selectedRow}
      drawerVisible={drawerVisible}
      assetData={data}
      totalItemCount={assetData?.count}
      assetPageDataFetch={setQueryParam}
      columns={columns}
     
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
      drawerTitle={""}
    />
  );
};

export default DasboardAssetHandler;
