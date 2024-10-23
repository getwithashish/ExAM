import React, { useState } from "react";
import { Form, Input, ConfigProvider } from "antd";
import "./DashBoardCardComponent.css";
import { DataType } from "../AssetTable/types/index";
import { CardType } from "./types/index";

const DashBoardCardComponent: React.FC<CardType> = ({
  data,
  formattedExpiryDate,
}) => {

  const inputStyle: React.CSSProperties = {
    width: "180px",
    boxShadow: "none",
    background: "#1D232C",
    borderRadius: "5px",
    color: "white",
    textAlign: "center",
    cursor: "default"
  };

  const [_updatedData, setUpdatedData] = useState<Partial<DataType>>({});
  const handleUpdateChange = (field: string, value: any) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const [searchQuery, setSearchQuery] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const formItems = [
    {
      label: "Asset Category",
      value: data.asset_category && (
        <Form.Item
          name="assetCategory"
          style={{ flex: "1" }}
          className="formItem font-semibold font-display"
        >
          <b style={{ display: "block" }}>Asset Category: </b> <br></br>
          <Input
            defaultValue={data.asset_category}
            onChange={(e) =>
              handleUpdateChange("assetCategory", e.target.value)
            }
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Asset Type",
      value: data.asset_type && (
        <Form.Item
          name="assetType"
          style={{ flex: "1" }}
          className="formItem font-semibold font-display"
        >
          <b style={{ display: "block" }}>Asset Type: </b> <br></br>
          <Input
            defaultValue={data.asset_type}
            onChange={(e) =>
              handleUpdateChange("assetType", e.target.value)
            }
            style={inputStyle}
            disabled
          />
        </Form.Item>
      ),
    },
    {
      label: "Asset Status",
      name: "assetStatus",
      value: data.status && (
        <Form.Item
          name="status"
          style={{ flex: "1" }}
          className="formItem font-semibold font-display"
        >
          <b style={{ display: "block" }}>Asset Status: </b> <br></br>
          <Input
            defaultValue={data.status}
            onChange={(e) =>
              handleUpdateChange("status", e.target.value)
            }
            style={inputStyle}
            disabled
          />
        </Form.Item>
      ),
    },
    {
      label: "Location",
      name: "location",
      value: data.location && (
        <Form.Item
          name="location"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b> Asset Location:</b>
          <br></br>
          <br></br>
          <Input
            variant="filled"
            defaultValue={data.location}
            style={inputStyle}
            onChange={(e) => handleUpdateChange("location", e.target.value)}
            disabled
          >
          </Input>
        </Form.Item>
      ),
    },
    {
      label: "Location",
      name: "location",
      value: data.invoice_location &&(
        <Form.Item
          name="location"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b> Asset Invoice Location:</b>
          <br></br>
          <br></br>
          <Input
            variant="filled"
            defaultValue={data.invoice_location}
            style={inputStyle}
            onChange={(e) => handleUpdateChange("location", e.target.value)}
            disabled
          >
          </Input>
        </Form.Item>
      ),
    },
    {
      label: "OS",
      name: "os",
      value: data.os &&(
        <Form.Item name="os">
          <b>OS: </b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.os}
            onChange={(e) => handleUpdateChange("os", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "OS Version",
      name: "osVersion",
      value: data.os_version && (
        <Form.Item name="os version">
          <b>OS Version:</b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.os_version}
            onChange={(e) => handleUpdateChange("os version", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Mobile OS",
      name: "mobileOs",
      value: data.mobile_os && (
        <Form.Item name="mobile os">
          <b>Mobile OS: </b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.mobile_os}
            onChange={(e) => handleUpdateChange("mobile os", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Processor",
      name: "processor",
      value: data.processor && (
        <Form.Item name="processor">
          <b>Processor: </b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.processor}
            onChange={(e) => handleUpdateChange("processor", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Generation",
      name: "generation",
      value: data["processor_gen"] && (
        <Form.Item name="generation">
          <b>Generation:</b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data["processor_gen"]}
            onChange={(e) => handleUpdateChange("generation", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Accessories",
      name: "accessories",
      value: data.accessories && (
        <Form.Item name="accessories">
          <b>Accessories:</b> <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.accessories}
            onChange={(e) => handleUpdateChange("accessories", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Date of Purchase",
      name: "dateOfPurchase",
      value: data.date_of_purchase && (
        <Form.Item name="date of purchase">
          <b>Date of Purchase:</b> <br></br>
          <br></br>{" "}
          <Input
            defaultValue={formatDate(data.date_of_purchase.toString())}
            onChange={(e) =>
              handleUpdateChange("date of purchase", e.target.value)
            }
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Warranty Period",
      name: "warrantyPeriod",
      value: data.warranty_period && (
        <Form.Item name="warranty period">
          <b>Warranty Period:</b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.warranty_period}
            onChange={(e) =>
              handleUpdateChange("warranty period", e.target.value)
            }
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Expiry Date",
      name: "Expiry Date",
      value: formattedExpiryDate && (
        <Form.Item name="Expiry Date">
          <b>Expiry Date: </b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={formattedExpiryDate}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Asset detail status",
      name: "asset_detail_status",
      value: data.asset_detail_status && (
        <Form.Item name="asset_detail_status">
          <b>Asset Detail Status </b>
          <br></br>
          <br></br>{" "}
          <Input
            disabled
            defaultValue={data.asset_detail_status}
            onChange={(e) =>
              handleUpdateChange("serail number", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Assign status",
      name: "assign_status",
      value: data.assign_status && (
        <Form.Item name="assign_status">
          <b>Assign Status </b>
          <br></br>
          <br></br>{" "}
          <Input
            disabled
            defaultValue={data.assign_status}
            onChange={(e) =>
              handleUpdateChange("serail number", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Approver",
      name: "approver",
      value: data["approved_by"] && (
        <Form.Item name="approver">
          <b>Approved By:</b>
          <br></br>
          <br></br>{" "}
          <Input
            disabled
            defaultValue={data["approved_by"]}
            onChange={(e) => handleUpdateChange("", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Serial Number",
      name: "serialNumber",
      value: data.serial_number && (
        <Form.Item name="serial number">
          <b>Serial Number:</b> <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.serial_number}
            onChange={(e) =>
              handleUpdateChange("serail number", e.target.value)
            }
            disabled
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },

    {
      label: "Model Number",
      name: "modelNumber",
      value: data.model_number && (
        <Form.Item name="model number">
          <b>Model Number:</b> <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.model_number}
            onChange={(e) => handleUpdateChange("model number", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Custodian",
      name: "custodian",
      value: data.custodian && (
        <Form.Item name="date of purchase">
          <b>Custodian:</b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.custodian}
            onChange={(e) => handleUpdateChange("model number", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Owner",
      name: "owner",
      value: data.owner && (
        <Form.Item name="owner">
          <b>Owner: </b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.owner}
            onChange={(e) => handleUpdateChange("owner", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Requester",
      name: "requester",
      value: data.requester && (
        <Form.Item name="requester">
          <b>Requester: </b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.requester}
            onChange={(e) => handleUpdateChange("requester", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },

    {
      label: "Product Name",
      name: "productName",
      value: data.product_name && (
        <Form.Item name="product name">
          <b>Product Name:</b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.product_name}
            onChange={(e) => handleUpdateChange("product name", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },

    {
      label: "Business Unti",
      name: "businessUnit",
      value: data.business_unit && (
        <Form.Item
          name="business_unit"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b>Business Unit:</b>
          <br></br>
          <br></br>
          <Input
            defaultValue={data.business_unit}
            style={inputStyle}
            onChange={(value) => handleUpdateChange("business_unit", value)}
            disabled
          >
          </Input>
        </Form.Item>
      ),
    },

    {
      label: "Memory",
      name: "memory",
      value: data.memory && (
        <Form.Item
          name="business_unit"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b>Memory:</b>
          <br></br>
          <br></br>
          <Input
            variant="filled"
            defaultValue={data.memory}
            style={inputStyle}
            onChange={(value) => handleUpdateChange("memory", value)}
            disabled
          >
          </Input>
        </Form.Item>
      ),
    },
    {
      label: "Storage",
      name: "storage",
      value: data.storage && (
        <Form.Item name="storage">
          <b>Storage: </b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.storage}
            onChange={(e) => handleUpdateChange("storage", e.target.value)}
            style={inputStyle}
            disabled
          />{" "}
        </Form.Item>
      ),
    },
    // {
    //   label: "Configuration",
    //   name: "configuration",
    //   value: (
    //     <Form.Item name="configuration">
    //       <b>Configuration: </b>
    //       <br></br>
    //       <br></br>{" "}
    //       <Input
    //         defaultValue={data.configuration}
    //         onChange={(e) =>
    //           handleUpdateChange("configuration", e.target.value)
    //         }
    //         readOnly
    //         style={inputStyle}
    //       />{" "}
    //     </Form.Item>
    //   ),
    // },
    {
      label: "Created At",
      name: "createdAt",
      value: data.created_at && (
        <Form.Item name="created_at">
          <b>Created At: </b>
          <br></br>
          <br></br>
          <Input
            defaultValue={formatDate(data.created_at)}
            style={inputStyle}
            disabled
          />
        </Form.Item>
      ),
    },
    {
      label: "Updated At",
      name: "updatedAt",
      value: data.updated_at && (
        <Form.Item name="updated_at">
          <b>Updated At: </b>
          <br></br>
          <br></br>
          <Input
            defaultValue={formatDate(data.updated_at)}
            style={inputStyle}
            disabled
          />
        </Form.Item>
      ),
    },
    {
      label: "Comments",
      name: "comments",
      value: data.notes && (
        <Form.Item name="comments">
          <b>Comments: </b>
          <br></br>
          <br></br>{" "}
          <textarea
            defaultValue={data.notes}
            onChange={(e) => handleUpdateChange("notes", e.target.value)}
            style={{
              width: "387px",
              height: "100px",
              background: "#1D232C",
              borderRadius: "5px"
            }}
            disabled
          />
        </Form.Item>
      ),
    },
    {
      label: "approval_status_message",
      name: "approval_status_message",
      value:data["approval_status_message"] && (
        <Form.Item name="approval_status_message">
          <b>Approver Message: </b>
          <br></br>
          <br></br>{" "}
          <textarea
            defaultValue={data["approval_status_message"]}
            onChange={(e) =>
              handleUpdateChange("approval_status_message", e.target.value)
            }
            style={{
              width: "387px",
              height: "100px",
              background: "#1D232C",
              borderRadius: "5px",
            }}
            disabled
          />

        </Form.Item>
      ),
    },
  ];

  const filteredFormItems = formItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery) ||
      (typeof item.value === "string" &&
        item.value.toLowerCase().includes(searchQuery))
  );

  const mainCardStyle = {
    width: "90%",
    display: "flex",
    flexWrap: "wrap",
    background: "#161B21 ",
    marginLeft: "6%",
    alignItems: "flex-start",
    gap: "-400px",
  };
  const formItemStyle = {
    flex: "0 0 calc(16.66% - 20px)",
    margin: "10px",
    boxSizing: "border-box",
  };

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
    ...
  </ConfigProvider>;
  function formatDate(dateString: string | number | Date) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString();
  }

  return (
    <div>
      <div className="fixed-header font-display">
        <Input
          placeholder="Search..."
          onChange={handleChange}
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
  title=""
  style={mainCardStyle}
>
  {filteredFormItems.map((item, index) => (
    item.value != null && (  // Check for both null and undefined
      <Form.Item key={index}>
        <div key={index} style={formItemStyle}>
          {item.value}
        </div>
      </Form.Item>
    )
  ))}

  <div className="rowone" font-display></div>
</Form>


      </div>
    </div>
  );
};
export default DashBoardCardComponent;
