import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Space,
  Input,
  Button,
  Select,
  ConfigProvider,
  Row,
  Col,
  message,
} from "antd";
import "./CardComponent.css";
import { DataType } from "../types";
import { CardType } from "./types/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/AxiosConfig";
import { CommentOutlined } from "@ant-design/icons";

interface UpdateData {
  asset_uuid: string;
  data: Partial<DataType>; // Partial to allow updating only specific fields
}
const CardComponent: React.FC<CardType> = ({
  asset_uuid,
  data,
  onUpdate,
  statusOptions,
  businessUnitOptions,
  locations,
  memoryData,
  assetTypeData,
}) => {
  const uniqueStatusOptions = Array.from(new Set(statusOptions));
  const uniqueBusinessOptions = Array.from(new Set(businessUnitOptions));
  const uniqueLocationoptions = Array.from(new Set(locations));
  const uniqueMemoryOptions = Array.from(new Set(memoryData));
  const uniqueAssetTypeOptions = Array.from(new Set(assetTypeData));

  const inputStyle: React.CSSProperties = {
    border: "0.5px solid #d3d3d3",
    width: "180px",
    boxShadow: "none",
    textAlign: "left",
    background: " #f0f0f0",
    borderRadius: "5px",
    color: "black",
  };

  const [updatedData, setUpdatedData] = useState<Partial<DataType>>({});
  const handleUpdate = async () => {
    try {
      const updatePayload = {
        asset_uuid: data.key,
        data: updatedData,
      };

      const response = await axiosInstance.patch(
        "/asset/update",
        updatePayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Asset Details successfully updated");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

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
      value: (
        <Form.Item
          name="assetCategory"
          style={{ flex: "1" }}
          className="formItem"
        >
          <b style={{ display: "block" }}>Asset Category: </b> <br></br>
          <Input
          disabled
            defaultValue={data.asset_category}
            onChange={(e) =>
              handleUpdateChange("assetCategory", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Asset Type",
      value: (
        <Form.Item
          name="status"
          style={{ flex: "1", marginLeft: "8px" }}
          className="formItem"
        >
          <b> Asset Type:</b>
          <br></br>
          <br></br>
          <Select
          disabled
            variant="filled"
            defaultValue={data.asset_type}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "170px",
              height: "40px",
              borderRadius: "5px",
              background:"#f0f0f0"
            }}
            onChange={(value) => handleUpdateChange("asset_type", value)}
          >
            {uniqueAssetTypeOptions.map((asset_type, index) => (
              <Select.Option key={index} value={asset_type.id}>
                {asset_type.asset_type_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      label: "Version",
      value: (
        <Form.Item
          name="version"
          style={{ flex: "1", marginLeft: "8px", width: "180px" }}
          className="formItem"
        >
          <b>Version: </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled
            defaultValue={data.version}
            onChange={(e) => handleUpdateChange("version", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },

    {
      label: "Asset Status",
      name: "assetStatus",
      value: (
        <Form.Item
          name="assetStatus"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b> Asset Status:</b>
          <br></br>
          <br></br>
          <Select
          disabled
            variant="filled"
            defaultValue={uniqueStatusOptions[0]}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "180px",
              height: "40px",
              borderRadius: "5px",
              background:"#f0f0f0"
            }}
            onChange={(value) => handleUpdateChange("status", value)} // Pass only the value
          >
            {uniqueStatusOptions.map((status, index) => (
              <Select.Option key={index} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      label: "Location",
      name: "location",
      value: (
        <Form.Item
          name="location"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b> Asset Location:</b>
          <br></br>
          <br></br>
          <Select
          disabled
            variant="filled"
            defaultValue={data.location}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "170px",
              height: "40px",
              borderRadius: "5px",
              background:"#f0f0f0"
            }}
            onChange={(value) => handleUpdateChange("location", value)}
          >
            {uniqueLocationoptions.map((location, index) => (
              <Select.Option key={index} value={location.id}>
                {location.location_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      label: "Location",
      name: "location",
      value: (
        <Form.Item
          name="location"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b>Invoice Location:</b>
          <br></br>
          <br></br>
          <Select
          disabled
            variant="filled"
            defaultValue={data.invoice_location}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "180px",
              height: "40px",
              borderRadius: "5px",
              background:"#f0f0f0"
            }}
            onChange={(value) => handleUpdateChange("invoice_location", value)} // Pass only the value
          >
            {uniqueLocationoptions.map((location, index) => (
              <Select.Option key={index} value={location.id}>
                {location.location_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },

    {
      label: "OS",
      name: "os",
      value: (
        <Form.Item name="os">
          <b>OS: </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.os}
            onChange={(e) => handleUpdateChange("os", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "OS Version",
      name: "osVersion",
      value: (
        <Form.Item name="os version">
          <b>OS Version:</b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.os_version}
            onChange={(e) => handleUpdateChange("os version", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Mobile OS",
      name: "mobileOs",
      value: (
        <Form.Item name="mobile os">
          <b>Mobile OS: </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled
            defaultValue={data.mobile_os}
            onChange={(e) => handleUpdateChange("mobile os", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Processor",
      name: "processor",
      value: (
        <Form.Item name="processor">
          <b>Processor: </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled
            defaultValue={data.processor}
            onChange={(e) => handleUpdateChange("processor", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Generation",
      name: "generation",
      value: (
        <Form.Item name="generation">
          <b>Generation:</b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.Generation}
            onChange={(e) => handleUpdateChange("generation", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Accessories",
      name: "accessories",
      value: (
        <Form.Item name="accessories">
          <b>Accessories:</b> <br></br>
          <br></br>{" "}
          <Input
          disabled
            defaultValue={data.accessories}
            onChange={(e) => handleUpdateChange("accessories", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Date of Purchase",
      name: "dateOfPurchase",
      value: (
        <Form.Item name="date of purchase">
          <b>Date of Purchase:</b> <br></br>
          <br></br>{" "}
          <Input
          disabled
            defaultValue={formatDate(data.date_of_purchase.toString())}
            onChange={(e) =>
              handleUpdateChange("date of purchase", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Warranty Period",
      name: "warrantyPeriod",
      value: (
        <Form.Item name="warranty period">
          <b>Warranty Period:</b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled
            defaultValue={data.warranty_period}
            onChange={(e) =>
              handleUpdateChange("warranty period", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Asset detail status",
      name: "asset_detail_status",
      value: (
        <Form.Item name="asset_detail_status">
          <b>Asset Detail Status </b>
          <br></br>
          <br></br>{" "}
          <Input 
          disabled
            defaultValue={data.asset_detail_status}
            onChange={(e) =>
              handleUpdateChange("asset_detail_status", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Assign status",
      name: "assign_status",
      value: (
        <Form.Item name="assign_status">
          <b>Assign Status </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.assign_status}
            onChange={(e) =>
              handleUpdateChange("assign_status", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },

    {
      label: "Approver",
      name: "approver",
      value: (
        <Form.Item name="date of purchase">
          <b>Approved By:</b>
          <br></br>
          <br></br>{" "}
          <Input
            disabled
            defaultValue={data.conceder}
            onChange={(e) =>
              handleUpdateChange("serail number", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Serial Number",
      name: "serialNumber",
      value: (
        <Form.Item name="serial number">
          <b>Serial Number:</b> <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.serial_number}
            onChange={(e) =>
              handleUpdateChange("serail number", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },

    {
      label: "Model Number",
      name: "modelNumber",
      value: (
        <Form.Item name="model number">
          <b>Model Number:</b> <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.model_number}
            onChange={(e) => handleUpdateChange("model number", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Custodian",
      name: "custodian",
      value: (
        <Form.Item name="date of purchase">
          <b>Custodian:</b>
          <br></br>
          <br></br>{" "}
          <Input
            disabled
            defaultValue={data.custodian}
            onChange={(e) => handleUpdateChange("model number", e.target.value)}
          style={{border: "0.5px solid #d3d3d3",
          width: "180px",
          boxShadow: "none",
          textAlign: "left",
          background: " #f0f0f0",
          borderRadius: "5px",
          }}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Owner",
      name: "owner",
      value: (
        <Form.Item name="owner">
          <b>Owner: </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.owner}
            onChange={(e) => handleUpdateChange("owner", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Requester",
      name: "requester",
      value: (
        <Form.Item name="requester">
          <b>Requester: </b>
          <br></br>
          <br></br>{" "}
          <Input
            disabled
            defaultValue={data.requester}
            onChange={(e) => handleUpdateChange("requester", e.target.value)}
            style={{border: "0.5px solid #d3d3d3",
            width: "180px",
            boxShadow: "none",
            textAlign: "left",
            background: " #f0f0f0",
            borderRadius: "5px",}}
          />{" "}
        </Form.Item>
      ),
    },

    {
      label: "Product Name",
      name: "productName",
      value: (
        <Form.Item name="product name">
          <b>Product Name:</b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.product_name}
            onChange={(e) => handleUpdateChange("product name", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },

    {
      label: "Business Unti",
      name: "businessUnit",
      value: (
        <Form.Item
          name="business_unit"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b>Business Unit:</b>
          <br></br>
          <br></br>
          <Select
          disabled

            variant="filled"
            defaultValue={uniqueBusinessOptions[0]}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "180px",
              height: "40px",
              borderRadius: "5px",
              background:"#f0f0f0"
            }}
            onChange={(value) => handleUpdateChange("business_unit", value)} // Pass only the value
          >
            {uniqueBusinessOptions.map((business_unit, index) => (
              <Select.Option
                key={index}
                value={business_unit}
                style={{ background: "#f0f0f0" }}
              >
                {business_unit}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },

    {
      label: "Memory",
      name: "memory",
      value: (
        <Form.Item
          name="business_unit"
          style={{ boxShadow: "none", border: "none" }}
        >
          <b>Memory:</b>
          <br></br>
          <br></br>
          <Select
          disabled

            variant="filled"
            defaultValue={data.memory}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "180px",
              height: "40px",
              borderRadius: "5px",
              background:"#f0f0f0"
            }}
            onChange={(value) => handleUpdateChange("memory", value)} // Pass only the value
          >
            {uniqueMemoryOptions.map((memory, index) => (
              <Select.Option key={index} value={memory.id}>
                {memory.memory_space}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      label: "Storage",
      name: "storage",
      value: (
        <Form.Item name="storage">
          <b>Storage: </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.storage}
            onChange={(e) => handleUpdateChange("storage", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Configuration",
      name: "configuration",
      value: (
        <Form.Item name="configuration">
          <b>Configuration: </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.configuration}
            onChange={(e) =>
              handleUpdateChange("configuration", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Created At",
      name: "createdAt",
      value: (
        <Form.Item name="created_at">
          <b>Created At: </b>
          <br></br>
          <br></br>
          <Input
            disabled
            defaultValue={formatDate(data.created_at)}
            style={{border: "0.5px solid #d3d3d3",
            width: "180px",
            boxShadow: "none",
            textAlign: "left",
            background: " #f0f0f0",
            borderRadius: "5px",}}
          />
        </Form.Item>
      ),
    },
    {
      label: "Updated At",
      name: "updatedAt",
      value: (
        <Form.Item name="updated_at">
          <b>Updated At: </b>
          <br></br>
          <br></br>
          <Input
            disabled
            defaultValue={formatDate(data.updated_at)}
            style={{border: "0.5px solid #d3d3d3",
            width: "180px",
            boxShadow: "none",
            textAlign: "left",
            background: " #f0f0f0",
            borderRadius: "5px",
            }}
          />
        </Form.Item>
      ),
    },
    {
      label: "Comments",
      name: "comments",
      value: (
        <Form.Item name="comments">
          <b>Comments: </b>
          <br></br>
          <br></br>{" "}
          <Input
          disabled

            defaultValue={data.notes}
            onChange={(e) => handleUpdateChange("comments", e.target.value)}
            style={{
              width: "387px",
              height: "100px",
              background: "#f0f0f0",
              borderRadius: "5px",
              border: "0.5px solid #d3d3d3",
            }}
          />{" "}
        </Form.Item>
      ),
    },
  ];

  // Filter form items based on search query
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
    background: "white",
    marginLeft: "6%",
    alignItems: "flex-start",
    rowGap: "-10px",
  };
  const formItemStyle = {
    flex: "0 0 calc(16.66% - 20px)", // Six items in one row (adjust margin)
    margin: "10px", // Adjust margin as needed
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
      <div className="fixed-header">
        <Input
          placeholder="Search fields"
          onChange={handleChange}
          style={{
            border: "0.5px solid #d3d3d3",
            marginTop: "0px",
            marginBottom: "30px",
            width: "300px",
            height: "30px",
            borderRadius: "5px",
            background: "#f0f0f0",
            marginLeft: "64px",
            padding: "20px",
          }}
        />
        
      </div>
      <div className="scrollable-content">
        <Form
          key={data.asset_id}
          className="mainCard"
          title=""
          style={mainCardStyle}
        >
          {filteredFormItems.map((item, index) => (
            <Form.Item key={index}>
              <div key={index} style={formItemStyle}>
                {item.value}
              </div>
            </Form.Item>
          ))}

          <div className="rowone"></div>
        </Form>
      </div>
    </div>
  );
};
export default CardComponent;
