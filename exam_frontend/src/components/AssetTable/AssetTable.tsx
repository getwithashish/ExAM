import React, { Key, SetStateAction, useState } from "react";
import { Button, Input, Space, Table, TableColumnsType } from "antd";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { SearchOutlined } from "@ant-design/icons";
import "./AssetTable.css";
import CardComponent from "../CardComponent/CardComponent"
import { CloseOutlined } from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import { useQuery } from "@tanstack/react-query";
import { DataType } from "../AssetTable/types";
import { ColumnFilterItem } from "../AssetTable/types";
import { AssetResult } from "../AssetTable/types";
import {FilterDropdownProps} from "../AssetTable/types";
const AssetTable = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const {
    data: assetData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assetList"],
    queryFn: () =>
      axiosInstance.get("/asset/?limit=5").then((res) => {
        console.log("Returned Data: ", res.data.data.results);
        return res.data;
      }),
  });
  
  const statusOptions =
    assetData?.data.results.map((item:AssetResult) => item.status) || [];
  const businessUnitOptions =
    assetData?.data.results.map(
      (item:AssetResult) => item.business_unit.business_unit_name
    ) || [];
  const locationOptions = assetData?.data.results.map(
    (item:AssetResult) => item.location.location_name
  );
  
  const memoryoptions=assetData?.data.results.map((item)=>item.memory.memory_space)
  const assetTypeOptions=assetData?.data.results.map((item)=>item.asset_type.asset_type_name)
// if (isLoading) return <div className="spin"> <Spin /></div>;
  // if (isError) return <div>Error fetching data</div>;
  // //  const assetListData = assetData?.data.data.map.map((item:  DataType) => ({
  // //   value: item.asset_type
  // // }));
  const assetDataList = assetData?.data.results;
  console.log("Testing on 65:", assetDataList ? assetDataList[0].results : []);

  const locations = new Set(); // Use a Set to avoid duplicate locations
  assetDataList?.forEach((asset) => {
    locations.add(asset.location.location_name);
    console.log(
      "Location Data:",
      assetData.data.results.map((asset) => asset.location.location_name)
    );
  });

  const locationFilters: ColumnFilterItem[] = Array.from(locations).map(
    (location) => ({
      text: location as React.ReactNode,
      value: location,
    })
  );

  let uniqueAssetCategories = [];
  if (assetData && assetData.data && assetData.data.results) {
    // Extract unique asset categories
    const allAssetCategories = assetData.data.results.map(
      (asset) => asset.asset_category
    );
    uniqueAssetCategories = [...new Set(allAssetCategories)];
  }
  console.log("Unique Asset Categories:", uniqueAssetCategories);

  const filterOptions = uniqueAssetCategories.map((category) => ({
    text: category,
    value: category,
  }));

  const handleRowClick = (record: React.SetStateAction<null>) => {
    setSelectedRow(record);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const [tableData, setTableData] = useState<DataType[]>([]);
  const handleUpdateData = (updatedData: { key: any }) => {
    // Update the table data with the updated data
    setTableData((prevData: any[]) =>
      prevData.map((item) =>
        item.key === updatedData.key ? { ...item, ...updatedData } : item
      )
    );
  };

  <div>
    <h1>Asset Overview</h1>
  </div>;
  const columns: TableColumnsType<DataType> = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      fixed: "left",
      width: 150,
      filterIcon: <SearchOutlined />,
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
      render: (_, record) => (
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
      width: 150,
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
      render: (_, record) => (
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
      title: "Asset Category",
      dataIndex: "asset_category",
      defaultSortOrder: "descend",
      responsive: ["md"],
      width: 150,
      filters: filterOptions,
      onFilter: (value, record) => {
        if (Array.isArray(value)) {
          return value.includes(record.asset_category);
        }
        return record.asset_category.indexOf(value.toString()) === 0;
      },
      render: (_, record) => (
        <div
          data-column-name="Asset Category"
          onClick={() => handleColumnClick(record, "Asset Category")}
          style={{ cursor: "pointer" }}
        >
          {record.asset_category}
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      responsive: ["md"],
      width: 150,
      filters: locationFilters,
      onFilter: (value, record) => {
        if (Array.isArray(value)) {
          return value.includes(record.location);
        }
        return record.location.indexOf(value.toString()) === 0;
      },
      render: (_, record) => (
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
      title: "Custodian",
      dataIndex: "custodian",
      responsive: ["md"],
      fixed: "right",
      width: 150,
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
        if (Array.isArray(value)) {
          return value.includes(record.custodian);
        }
        return record.custodian.indexOf(value.toString()) === 0;
      },
      render: (_, record) => (
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
      title: "Assign Asset",
      dataIndex: "AssignAsset",
      fixed: "right",
      render: (_data, record) => (
        <Button
          ghost
          style={{
            borderRadius: "10px",
            background: "#D3D3D3",
            color: "black",
          }}
          onClick={() => handleAssignAssetClick(record)}
        >
          +
        </Button>
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
  const handleAssignAssetClick = (record: DataType) => {

    // Your implementation for handling clicks on "Assign Asset" column
  };

  const assetdetails = [
    {
      title: "Asset Id",
      dataIndex: "asset_id",
      fixed: "left",
      responsive: ["md"],
      filters: [
        {
          text: "AC101",
          value: "AC101",
        },
        {
          text: "AC102",
          value: "AC102",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.asset_id);
        }
        return record.asset_id.indexOf(value.toString()) === 0;
      },
      sorter: (a: { asset_id: string; }, b: { asset_id: any; }) => a.asset_id.localeCompare(b.asset_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Asset Type",
      dataIndex: "asset_type",
      responsive: ["md"],
      filters: [
        {
          text: "Laptop",
          value: "Laptop",
        },
        {
          text: "Monitor",
          value: "Monitor",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.asset_type);
        }
        return record.asset_type.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Version",
      dataIndex: "version",
      responsive: ["md"],
      filters: [
        {
          text: 1,
          value: 1,
        },
        {
          text: 2,
          value: 2,
        },
      ],
      onFilter: (value: number | number[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.version);
        }
        return record.version === value;
      },
      sorter: (a: { version: number; }, b: { version: number; }) => a.version - b.version,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Asset Status",
      dataIndex: "status",
      responsive: ["md"],
      filters: [
        {
          text: "In Use ",
          value: "In Use",
        },
        {
          text: "In Store",
          value: "In Store",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.status);
        }
        return record.status.indexOf(value.toString()) === 0;
      },
    },

    {
      title: "Invoice Location",
      dataIndex: "invoice_location",
      responsive: ["md"],
      filters: [
        {
          text: "Kochi ",
          value: "Kochi",
        },
        {
          text: "Trivandrum",
          value: "Trivandrum",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.invoice_location);
        }
        return record.invoice_location.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Business Unit",
      dataIndex: "business_unit",
      responsive: ["md"],
      filters: [
        {
          text: "du1 ",
          value: "du1",
        },
        {
          text: "du2",
          value: "du2",
        },
        {
          text: "du3 ",
          value: "du3",
        },
        {
          text: "du4",
          value: "du4",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.business_unit);
        }
        return record.business_unit.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Os",
      dataIndex: "os",
      responsive: ["md"],
      filters: [
        {
          text: "Linux ",
          value: "Linux",
        },
        {
          text: "Windows",
          value: "Windows",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.os);
        }
        return record.os.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Os Version",
      dataIndex: "os_version",
      responsive: ["md"],
      filters: [
        {
          text: "11",
          value: "11",
        },
        {
          text: "12",
          value: "12",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.os_version);
        }
        return record.os_version.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Mobile Os",
      dataIndex: "mobile_os",
      responsive: ["md"],
      filters: [
        {
          text: "iOS",
          value: "iOS",
        },
        {
          text: "Android",
          value: "Android",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.mobile_os);
        }
        return record.mobile_os.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Processor",
      dataIndex: "processor",
      responsive: ["md"],
      filters: [
        {
          text: "i5",
          value: "i5",
        },
        {
          text: "i3",
          value: "i3",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.processor);
        }
        return record.processor.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Generation",
      dataIndex: "Generation",
      responsive: ["md"],
      filters: [
        {
          text: "In Use ",
          value: "In Use",
        },
        {
          text: "In Store",
          value: "In Store",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.Generation);
        }
        return record.Generation.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Accessories",
      dataIndex: "accessories",
      responsive: ["md"],
      filters: [
        {
          text: "In Use ",
          value: "In Use",
        },
        {
          text: "In Store",
          value: "In Store",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.accessories);
        }
        return record.accessories.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Date Of Purchase",
      dataIndex: "date_of_purchase",
      responsive: ["md"],
      filters: [
        {
          text: "02/03/24 ",
          value: "02/03/24 ",
        },
        {
          text: "03/03/24 ",
          value: "03/03/24 ",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        const dateValue = new Date(value as string).getTime();

        const recordDate = new Date(record.date_of_purchase).getTime();

        if (Array.isArray(value)) {
          return value.some((val) => new Date(val).getTime() === recordDate);
        } else if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return recordDate === dateValue;
        } else {
          return false;
        }
      },
      sorter: (a: { date_of_purchase: string | number | Date; }, b: { date_of_purchase: string | number | Date; }) => {
        const dateA = new Date(a.date_of_purchase).getTime();
        const dateB = new Date(b.date_of_purchase).getTime();
        return dateA - dateB;
      },
    },
    {
      title: "Warranty Period",
      dataIndex: "warranty_period",
      responsive: ["md"],
      filters: [
        {
          text: " 2Years",
          value: "2Years",
        },
        {
          text: "3Years",
          value: "3Years",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.warranty_period);
        }
        return (
          record.warranty_period.toString().indexOf(value.toString()) === 0
        );
      },
      sorter: (a: { warranty_period: string | number | Date; }, b: { warranty_period: string | number | Date; }) => {
        const dateA = new Date(a.warranty_period).getTime();
        const dateB = new Date(b.warranty_period).getTime();
        return dateA - dateB;
      },
    },
    {
      title: "Warranty Countdown",
      dataIndex: "WarrantyCountdown",
      responsive: ["md"],
      filters: [
        {
          text: " 2Years",
          value: "2Years",
        },
        {
          text: "3Years",
          value: "3Years",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.WarrantyCountdown);
        }
        return record.WarrantyCountdown.toString().indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Approval Status",
      dataIndex: "approval_status",
      responsive: ["md"],
      filters: [
        {
          text: "Approved ",
          value: "Approved",
        },
        {
          text: "Rejected",
          value: "Rejected",
        },
        {
          text: "Pending",
          value: "Pending",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.approval_status);
        }
        return record.approval_status.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Conceder",
      dataIndex: "conceder",
      responsive: ["md"],
      filters: [
        {
          text: "Sfm Lead",
          value: "Sfm Lead",
        },
        {
          text: "Sfm Manager",
          value: "Sfm Manager",
        },
      ],

      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.conceder);
        }
        return record.conceder.indexOf(value.toString()) === 0;
      },
    },

    {
      title: "Model Number",
      dataIndex: "model_number", // Corrected dataIndex
      responsive: ["md"],
      filterIcon: <SearchOutlined rev={undefined} />,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }:FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Model Number"
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
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.model_number);
        }
        return record.model_number.indexOf(value.toString()) === 0;
      },
    },

    {
      title: "Memory",
      dataIndex: "memory",
      responsive: ["md"],
      filters: [
        {
          text: "16Gb",
          value: "16Gb",
        },
        {
          text: "128Gb",
          value: "128Gb",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.memory);
        }
        return record.memory.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Storage",
      dataIndex: "storage",
      responsive: ["md"],
      filters: [
        {
          text: "16Gb",
          value: "16Gb",
        },
        {
          text: "128Gb",
          value: "128Gb",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.storage);
        }
        return record.storage.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Owner",
      dataIndex: "owner",
      responsive: ["md"],
    },
    {
      title: "Requester",
      dataIndex: "requester",
      responsive: ["md"],
      filters: [
        {
          text: "sfmManger",
          value: "sfmManager",
        },
        {
          text: "sfmLead",
          value: "sfmLead",
        },
        {
          text: "sfmSenior",
          value: "sfmSenior",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.requester);
        }
        return record.requester.indexOf(value.toString()) === 0;
      },
    },
    {
      title: "Configuration",
      dataIndex: "configuration",
      responsive: ["md"],
      filters: [
        {
          text: 'Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 13.4"',
          value: 'Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 13.4"',
        },
        {
          text: 'Intel Core i5-1165G7, 128GB RAM, 512GB SSD, 13.4" ',
          value: 'Intel Core i5-1165G7, 128GB RAM, 512GB SSD, 13.4" ',
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        if (Array.isArray(value)) {
          return value.includes(record.configuration);
        }
        return record.configuration === value;
      },
    },

    {
      title: "Created At",
      dataIndex: "created_at",
      fixed: "left",
      responsive: ["md"],
      filters: [
        {
          text: "2024-03-05T10:00:00",
          value: "2024-03-05T10:00:00",
        },
        {
          text: "2024-03-05T10:00:00",
          value: "2024-03-05T10:00:00",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        const dateValue = new Date(value as string).getTime();
        const recordDate = new Date(record.created_at).getTime();
        if (Array.isArray(value)) {
          return value.some(
            (val) => new Date(val as string).getTime() === recordDate
          );
        } else if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return recordDate === dateValue;
        } else {
          return false;
        }
      },
      sorter: (a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateA - dateB;
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      fixed: "left",
      responsive: ["md"],
      filters: [
        {
          text: "2024-03-05T10:00:00",
          value: "2024-03-05T10:00:00",
        },
        {
          text: "2024-03-05T10:00:00",
          value: "2024-03-05T10:00:00",
        },
      ],
      onFilter: (
        value: string | number | boolean | React.ReactText[] | Key,
        record: DataType
      ) => {
        const dateValue = new Date(value as string).getTime();
        const recordDate = new Date(record.updated_at).getTime();
        if (Array.isArray(value)) {
          return value.some(
            (val) => new Date(val as string).getTime() === recordDate
          );
        } else if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return recordDate === dateValue;
        } else {
          return false;
        }
      },
      sorter: (a: { updated_at: string | number | Date; }, b: { updated_at: string | number | Date; }) => {
        const dateA = new Date(a.updated_at).getTime();
        const dateB = new Date(b.updated_at).getTime();
        return dateA - dateB;
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Notes",
      dataIndex: "notes",
    },
  ];

  const data = assetData?.data.results.map((result) => ({
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
    approval_status: result.approval_status,
    conceder: result.conceder?.username,
    model_number: result.model_number,
    serial_number: result.serial_number,
    memory: result.memory.memory_space,
    storage: result.storage,
    configuration: result.configuration,
    custodian: result.custodian?.employee_name,
    product_name: result.product_name,
    owner: result.owner,
    requester: result.requester.username,
    AssignAsset: "assign",
    created_at: result.created_at,
    updated_at: result.updated_at,
  }));

  const drawerTitle = "Asset Details";

  const button = <Button type="primary"></Button>;

  return (
    <>
      <div className="mainHeading">
        <h1>Asset Details</h1>
      </div>

      <div style={{ position: 'relative', display: 'inline-block' }}>
  <Table
    assetdetails={assetdetails}
    columns={columns}
    dataSource={data}
    scroll={{ x: "max-content" }}
    className="mainTable"
    pagination={false}
    bordered={false}
    style={{
      borderRadius: 10,
      padding: 20,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      fontSize: "50px",
    }}
  />
  {/* <a
     href="../../AssetDetailView/AssetDetailView"
    style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      margin: '20px',
      fontSize: '16px',
      color: 'blue',
    }}
  >
    View more details
  </a> */}
</div>
      <DrawerComponent
        visible={drawerVisible}
        onClose={onCloseDrawer}
        selectedRow={selectedRow}
        title={drawerTitle}
        button={button}
        onUpdateData={handleUpdateData}
        closeIcon={<CloseOutlined rev={undefined} />}
      >
        {selectedRow && (
          <div>
            <h2 className="drawerHeading">{selectedRow.ProductName}</h2>
          </div>
        )}

        {selectedRow && (
          <CardComponent
            data={selectedRow}
            statusOptions={statusOptions}
            businessUnitOptions={businessUnitOptions}
            locationOptions={locationOptions}
            memoryoptions={memoryoptions}
            assetTypeOptions={assetTypeOptions}
          />
        )}
        {button && (
          <div
            style={{
              marginBottom: "20px",
              marginLeft: "1150px",
              marginTop: "60px",
            }}
          >
            {button}
          </div>
        )}
      </DrawerComponent>
    </>
  );
};

export default AssetTable;
