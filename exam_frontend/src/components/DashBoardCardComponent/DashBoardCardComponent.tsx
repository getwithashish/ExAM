import React, { useState, useMemo } from "react";
import { Form, Input, ConfigProvider } from "antd";
import "./DashBoardCardComponent.css";
import { DataType } from "../AssetTable/types/index";
import { CardType } from "./types/index";

interface FormItemConfig {
  label: string;
  name: string;
  value: React.ReactNode | null;
}

const DashBoardCardComponent: React.FC<CardType> = ({
  data,
  formattedExpiryDate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [_updatedData, setUpdatedData] = useState<Partial<DataType>>({});

  const inputStyle = {
    width: "180px",
    boxShadow: "none",
    background: "#1D232C",
    borderRadius: "5px",
    color: "white",
    textAlign: "center",
    cursor: "default"
  } as const;

  const textAreaStyle = {
    width: "387px",
    height: "100px",
    background: "#1D232C",
    borderRadius: "5px"
  } as const;

  const handleUpdateChange = (field: string, value: any) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const formatDate = (dateString: string | number | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
  };

  // Create a reusable FormItem component
  const FormItemField: React.FC<{
    label: string;
    value: any;
    fieldName: string;
    isTextArea?: boolean;
  }> = ({ label, value, fieldName, isTextArea = false }) => (
    <Form.Item name={fieldName} className="formItem font-semibold font-display">
      <b style={{ display: "block" }}>{label}</b>
      <br />
      {isTextArea ? (
        <textarea
          defaultValue={value}
          onChange={(e) => handleUpdateChange(fieldName, e.target.value)}
          style={textAreaStyle}
          disabled
        />
      ) : (
        <Input
          defaultValue={value}
          onChange={(e) => handleUpdateChange(fieldName, e.target.value)}
          style={inputStyle}
          disabled
        />
      )}
    </Form.Item>
  );

  // Define form items using useMemo to prevent unnecessary recalculations
  const formItems: FormItemConfig[] = useMemo(() => [
    {
      label: "Asset Category",
      name: "assetCategory",
      value: data.asset_category ? <FormItemField label="Asset Category" value={data.asset_category} fieldName="assetCategory" /> : null
    },
    {
      label: "Asset Type",
      name: "assetType",
      value: data.asset_type ? <FormItemField label="Asset Type" value={data.asset_type} fieldName="assetType" /> : null
    },
    {
      label: "Asset Status",
      name: "status",
      value: data.status ? <FormItemField label="Asset Status" value={data.status} fieldName="status" /> : null
    },
    {
      label: "Location",
      name: "location",
      value: data.location ? <FormItemField label="Asset Location" value={data.location} fieldName="location" /> : null
    },
    {
      label: "Invoice Location",
      name: "invoiceLocation",
      value: data.invoice_location ? <FormItemField label="Asset Invoice Location" value={data.invoice_location} fieldName="invoiceLocation" /> : null
    },
    {
      label: "OS",
      name: "os",
      value: data.os ? <FormItemField label="OS" value={data.os} fieldName="os" /> : null
    },
    {
      label: "OS Version",
      name: "osVersion",
      value: data.os_version ? <FormItemField label="OS Version" value={data.os_version} fieldName="osVersion" /> : null
    },
    {
      label: "Mobile OS",
      name: "mobileOs",
      value: data.mobile_os ? <FormItemField label="Mobile OS" value={data.mobile_os} fieldName="mobileOs" /> : null
    },
    {
      label: "Processor",
      name: "processor",
      value: data.processor ? <FormItemField label="Processor" value={data.processor} fieldName="processor" /> : null
    },
    {
      label: "Generation",
      name: "generation",
      value: data.processor_gen ? <FormItemField label="Generation" value={data.processor_gen} fieldName="generation" /> : null
    },
    {
      label: "Accessories",
      name: "accessories",
      value: data.accessories ? <FormItemField label="Accessories" value={data.accessories} fieldName="accessories" /> : null
    },
    {
      label: "Date of Purchase",
      name: "dateOfPurchase",
      value: data.date_of_purchase ? <FormItemField label="Date of Purchase" value={formatDate(data.date_of_purchase.toString())} fieldName="dateOfPurchase" /> : null
    },
    {
      label: "Warranty Period",
      name: "warrantyPeriod",
      value: data.warranty_period ? <FormItemField label="Warranty Period" value={data.warranty_period} fieldName="warrantyPeriod" /> : null
    },
    {
      label: "Expiry Date",
      name: "expiryDate",
      value: formattedExpiryDate ? <FormItemField label="Expiry Date" value={formattedExpiryDate} fieldName="expiryDate" /> : null
    },
    {
      label: "Asset Detail Status",
      name: "assetDetailStatus",
      value: data.asset_detail_status ? <FormItemField label="Asset Detail Status" value={data.asset_detail_status} fieldName="assetDetailStatus" /> : null
    },
    {
      label: "Assign Status",
      name: "assignStatus",
      value: data.assign_status ? <FormItemField label="Assign Status" value={data.assign_status} fieldName="assignStatus" /> : null
    },
    {
      label: "Approver",
      name: "approver",
      value: data.approved_by ? <FormItemField label="Approved By" value={data.approved_by} fieldName="approver" /> : null
    },
    {
      label: "Serial Number",
      name: "serialNumber",
      value: data.serial_number ? <FormItemField label="Serial Number" value={data.serial_number} fieldName="serialNumber" /> : null
    },
    {
      label: "Model Number",
      name: "modelNumber",
      value: data.model_number ? <FormItemField label="Model Number" value={data.model_number} fieldName="modelNumber" /> : null
    },
    {
      label: "Custodian",
      name: "custodian",
      value: data.custodian ? <FormItemField label="Custodian" value={data.custodian} fieldName="custodian" /> : null
    },
    {
      label: "Owner",
      name: "owner",
      value: data.owner ? <FormItemField label="Owner" value={data.owner} fieldName="owner" /> : null
    },
    {
      label: "Requester",
      name: "requester",
      value: data.requester ? <FormItemField label="Requester" value={data.requester} fieldName="requester" /> : null
    },
    {
      label: "Product Name",
      name: "productName",
      value: data.product_name ? <FormItemField label="Product Name" value={data.product_name} fieldName="productName" /> : null
    },
    {
      label: "Business Unit",
      name: "businessUnit",
      value: data.business_unit ? <FormItemField label="Business Unit" value={data.business_unit} fieldName="businessUnit" /> : null
    },
    {
      label: "Memory",
      name: "memory",
      value: data.memory ? <FormItemField label="Memory" value={data.memory} fieldName="memory" /> : null
    },
    {
      label: "Storage",
      name: "storage",
      value: data.storage ? <FormItemField label="Storage" value={data.storage} fieldName="storage" /> : null
    },
    {
      label: "Created At",
      name: "createdAt",
      value: data.created_at ? <FormItemField label="Created At" value={formatDate(data.created_at)} fieldName="createdAt" /> : null
    },
    {
      label: "Updated At",
      name: "updatedAt",
      value: data.updated_at ? <FormItemField label="Updated At" value={formatDate(data.updated_at)} fieldName="updatedAt" /> : null
    },
    {
      label: "Comments",
      name: "comments",
      value: data.notes ? <FormItemField label="Comments" value={data.notes} fieldName="notes" isTextArea={true} /> : null
    },
    {
      label: "Approval Status Message",
      name: "approvalStatusMessage",
      value: data.approval_status_message ? <FormItemField label="Approver Message" value={data.approval_status_message} fieldName="approvalStatusMessage" isTextArea={true} /> : null
    }
  ], [data, formattedExpiryDate]);

  const filteredFormItems = useMemo(() => 
    formItems.filter(item =>
      item.label.toLowerCase().includes(searchQuery) ||
      (typeof item.value === "string" && item.value.toLowerCase().includes(searchQuery))
    ),
    [formItems, searchQuery]
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            multipleItemBorderColor: "transparent",
            colorBorder: "none",
          },
        },
      }}
    >
      <div>
        <div className="fixed-header font-display">
          <Input
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            style={{
              border: "0.5px solid #d3d3d3",
              padding: "20px",
              marginTop: "-10px",
              marginBottom: "30px",
              width: "300px",
              height: "30px",
              borderRadius: "5px",
              marginLeft: "5.4%",
              backgroundColor: "#1D232C"
            }}
          />
        </div>
        <div className="scrollable-content font-display">
          <Form
            key={data.asset_id}
            className="mainCard"
            style={{
              width: "90%",
              display: "flex",
              flexWrap: "wrap",
              background: "#161B21",
              marginLeft: "6%",
              alignItems: "flex-start",
              gap: "-400px",
            }}
          >
            {filteredFormItems.map((item, index) => (
              item.value && (
                <Form.Item key={index}>
                  <div style={{
                    flex: "0 0 calc(16.66% - 20px)",
                    margin: "10px",
                    boxSizing: "border-box",
                  }}>
                    {item.value}
                  </div>
                </Form.Item>
              )
            ))}
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default DashBoardCardComponent;