import React, { SetStateAction, useCallback, useState } from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "./AssetTable.css";
import { useQuery } from "@tanstack/react-query";
import { AssetResult } from "../AssetTable/types";
import AssetTable from "./AssetTable";
import {
  getAssetTypeOptions,
  getLocationOptions,
  getMemoryOptions,
} from "../../AssetTable/api/getAssetDetails";
import moment from "moment";
import { Reorder } from "@mui/icons-material";
interface Props{
  queryParam?:any;
  setQueryParam?:any;
  assetData?:any;
  isAssetDataLoading?:any;
  assetDataRefetch?:any;
  showAssignDrawer?:any;
}

const AssetTableHandler = ({
  queryParam,
  setQueryParam,
  assetData,
  isAssetDataLoading,
  assetDataRefetch,
  showAssignDrawer,
}:Props) => {
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
    setQueryParam(editedQueryParam);
    assetDataRefetch({ force: true });
  };

  const statusOptions =
    assetData?.results?.map((item: AssetResult) => item.status) || [];

  const businessUnitOptions =
    assetData?.results?.map(
      (item: AssetResult) => item.business_unit?.business_unit_name
    ) || [];

  const { data: locationResults } = useQuery({
    queryKey: ["location"],
    queryFn: () => getLocationOptions(),
  });

  const locations = locationResults ? locationResults : [];

  const { data: memoryData } = useQuery({
    queryKey: ["memorySpace"],
    queryFn: () => getMemoryOptions(),
  });

  const { data: assetTypeData } = useQuery({
    queryKey: ["assetDrawerassetType"],
    queryFn: () => getAssetTypeOptions(),
  });

  const reset = () => {
    setQueryParam("");
    setSearchTerm("");
    refetchAssetData();
  };

  const handleRowClick = useCallback((record: React.SetStateAction<null>) => {
    setSelectedRow(record);
    setDrawerVisible(true);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  // const [tableData, setTableData] = useState<DataType[]>([]);
  // const handleUpdateData = (updatedData: { key: any }) => {
  //   setTableData((prevData: any[]) =>
  //     prevData.map((item) =>
  //       item.key === updatedData.key ? { ...item, ...updatedData } : item
  //     )
  //   );
  // };

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

  const renderClickableColumn = (columnName:any, dataIndex: any) => (_:any, record:any) => {
    if (dataIndex === "created_at" || dataIndex === "updated_at") {
      const formattedDate = moment(record[dataIndex]).format("DD-MM-YYYY");
      return (
        <div
          data-column-name={columnName}
          onClick={() => handleColumnClick(record, columnName)}
          style={{ cursor: "pointer" }}
        >
          {formattedDate}
        </div>
      );
    }
    return (
      <div
        data-column-name={columnName}
        onClick={() => handleColumnClick(record, columnName)}
        style={{ cursor: "pointer" }}
      >
        {record[dataIndex]}
      </div>
    );
  };

  const detailStatusStyleCondition = (record: any): React.CSSProperties => {
    return record.asset_detail_status === "CREATE_REJECTED" ||
      record.asset_detail_status === "UPDATE_REJECTED"
      ? { color: "red" }
      : {color: "white"};
  };

  const assignStatusStyleCondition = (record: any): React.CSSProperties => {
    return record.assign_status === "REJECTED" ? { color: "red" } : {color: "white"};
  };


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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Product Name", "product_name")(text, record)}
        </div>
      ),
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      responsive: ["md"],
      width: 120,
      sorter: (a: { serial_number: string }, b: { serial_number: any }) =>
        a.serial_number.localeCompare(b.serial_number),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Serial Number", "serial_number")(
            text,
            record
          )}
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "location" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("location"),
      }),
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Location", "location")(text, record)}
        </div>
      ),
    },

    {
      title: "Invoice Location",
      dataIndex: "invoice_location",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "invoice_location" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("invoice_location"),
      }),
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Invoice Location", "invoice_location")(
            text,
            record
          )}
        </div>
      ),
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Custodian", "custodian")(text, record)}
        </div>
      ),
    },
    {
      title: "Asset Type",
      dataIndex: "asset_type",
      responsive: ["md"],
      width: 120,
      sorter: true,
      sortOrder: sortedColumn === "asset_type" ? sortOrder : undefined,
      onHeaderCell: () => ({
        onClick: () => handleSort("asset_type"),
      }),
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Asset Type", "asset_type")(text, record)}
        </div>
      ),
    },
    {
      title: "Asset Category",
      dataIndex: "asset_category",
      responsive: ["md"],
      width: 140,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Asset Category", "asset_category")(
            text,
            record
          )}
        </div>
      ),
    },
    // {
    //   title: "Version",
    //   dataIndex: "version",
    //   responsive: ["md"],
    //   width: 120,
    //   sorter: true,
    //   sortOrder: sortedColumn === "version" ? sortOrder : undefined,
    //   onHeaderCell: () => ({
    //     onClick: () => handleSort("version"),
    //   }),
    //   render: (text: string, record: any) => (
    //     <div style={{ color: "#ffffff" }}>
    //       {renderClickableColumn("Version", "version")(text, record)}
    //     </div>
    //   ),
    // },
    {
      title: "Asset Status",
      dataIndex: "Status",
      responsive: ["md"],
      width: 140,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("processor_gen", "processor_gen")(
            text,
            record
          )}
        </div>
      ),
    },
    {
      title: "Business Unit",
      dataIndex: "BusinessUnit",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Business_Unit", "business_unit")(
            text,
            record
          )}
        </div>
      ),
    },
    {
      title: "Os",
      dataIndex: "os",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Os", "os")(text, record)}
        </div>
      ),
    },
    {
      title: "Os Version",
      dataIndex: "os_version",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Os Version", "os_version")(text, record)}
        </div>
      ),
    },
    {
      title: "Processor",
      dataIndex: "processor",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Processor", "processor")(text, record)}
        </div>
      ),
    },
    {
      title: "Generation",
      dataIndex: "processor_gen",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("processor_gen", "processor_gen")(
            text,
            record
          )}
        </div>
      ),
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Date of Purchase", "date_of_purchase")(
            text,
            record
          )}
        </div>
      ),
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("warranty_period", "warranty_period")(
            text,
            record
          )}
        </div>
      ),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      responsive: ["md"],
      width: 120,
      render: (_: any, record: any) => {
        const dateOfPurchase = record.date_of_purchase
          ? new Date(record.date_of_purchase)
          : null;
        const warrantyPeriod = parseInt(record.warranty_period) || 0; // Defaulting to 0 if warranty_period is not provided or invalid
        if (dateOfPurchase instanceof Date && !isNaN(dateOfPurchase)) {
          const expiryDate = new Date(
            dateOfPurchase.getTime() + warrantyPeriod * 30 * 24 * 60 * 60 * 1000
          );
          const formattedExpiryDate = expiryDate.toISOString().split("T")[0];
          const currentDate = new Date();
          const isExpired = expiryDate < currentDate;
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("license_type", "license_type")(text, record)}
        </div>
      ),
    },

    {
      title: "Model Number",
      dataIndex: "ModelNumber",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Model Number", "model_number")(text, record)}
        </div>
      ),
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Memory", "memory")(text, record)}
        </div>
      ),
    },
    {
      title: "Storage",
      dataIndex: "storage",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Storage", "storage")(text, record)}
        </div>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Owner", "owner")(text, record)}
        </div>
      ),
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Approved By", "approved_by")(text, record)}
        </div>
      ),
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Requester", "requester")(text, record)}
        </div>
      ),
    },
    {
      title: "Asset Detail Status",
      dataIndex: "asset_detail_status",
      responsive: ["md"],
      width: 140,
      render: (text: string, record: any) => (
        <div style={{...detailStatusStyleCondition(record)}}>
          {renderClickableColumn("Asset Detail Status", "asset_detail_status")(
            text,
            record
          )}
        </div>
      ),
    },
    {
      title: "Asset Assign Status",
      dataIndex: "assign_status",
      responsive: ["md"],
      width: 140,
      render: (text: string, record: any) => (
        <div style={{...assignStatusStyleCondition(record)}}>
          {renderClickableColumn("Asset Assign Status", "assign_status")(
            text,
            record
          )}
        </div>
      ),
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Created At", "created_at")(text, record)}
        </div>
      ),
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
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Updated At", "updated_at")(text, record)}
        </div>
      ),
    },
    {
      title: "Accessories",
      dataIndex: "Accessories",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn("Accessories", "accessories")(text, record)}
        </div>
      ),
    },
    {
      title: "Approver Notes",
      dataIndex: "approval_status_message",
      responsive: ["md"],
      width: 120,
      render: (text: string, record: any) => (
        <div style={{ color: "#ffffff" }}>
          {renderClickableColumn(
            "approval_status_message",
            "approval_status_message"
          )(text, record)}
        </div>
      ),
    },
    {
      title: "Assign Asset",
      dataIndex: "AssignAsset",
      fixed: "right",
      width: 120,
      render: (_data: any, record: any) => (
        <Button
          className="ml-6"
          type="default"
          shape="circle"
          icon={<UserAddOutlined style={{ color: "#ffffff" }} />}
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

  const data = assetData?.results?.map((result: any) => ({
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
    license_type: result.license_type,
    owner: result.owner,
    requester: result.requester?.username,
    AssignAsset: "assign",
    created_at: result.created_at,
    updated_at: result.updated_at,
    approval_status_message: result.approval_status_message,
  }));

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
      reset={reset}
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
      logsData={undefined}
      isLoading={false}
      isSuccess={false}
      selectedAssetId={null}
      setSelectedAssetId={function (
        value: React.SetStateAction<string | null>
      ): void {
        throw new Error("Function not implemented.");
      }}
      asset_uuid={""}
      heading={""}
      setTableData={undefined}
      handleDelete={undefined}
      modifiedData={undefined}
      userRole={undefined}
      isMyApprovalPage={undefined}
    />
  );
};

export default AssetTableHandler;
