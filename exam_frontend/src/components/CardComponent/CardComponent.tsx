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
  Modal,
} from "antd";
import "./CardComponent.css";
import { DataType } from "../AssetTable/types/index";
import { CardType } from "./types/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/AxiosConfig";
import { CommentOutlined } from "@ant-design/icons";
import { Spin } from "antd";

interface UpdateData {
  asset_uuid: string;
  data: Partial<DataType>; // Partial to allow updating only specific fields
  isMyApprovalPage: boolean;
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
  isMyApprovalPage,
  formattedExpiryDate,
  onClose,
  onDelete,
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
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true); // Set loading to true when update starts

    const fieldsToValidate = [
      "os_version",
      "version",
      "warranty_period",
      "processor",
      "processor_gen",
      "model_number",
      "storage",
      "configuration",
    ];

    // Map field names to display names for user-friendly error messages
    const fieldDisplayNames = {
      os_version: "OS Version",
      version: "Version",
      warranty_period: "Warranty Period",
      processor: "Processor",
      processor_gen: "Generation",
      model_number: "Model Number",
      storage: "Storage",
      configuration: "Configuration",
    };

    // Validation regex for alphanumeric characters
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;

    // Check if any of the fields to validate fail their respective validations
    const invalidField = fieldsToValidate.find((field) => {
      if (
        field === "processor" ||
        field == "processor_gen" ||
        field == "model_number" ||
        field == "storage" ||
        field == "configuration"
      ) {
        return (
          updatedData.hasOwnProperty(field) &&
          !/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(updatedData[field])
        );
      } else if (
        field === "processor_gen" ||
        field === "model_number" ||
        field === "storage" ||
        field == "configuration"
      ) {
        return (
          updatedData.hasOwnProperty(field) &&
          !alphanumericRegex.test(updatedData[field])
        );
      } else {
        return (
          updatedData.hasOwnProperty(field) && !/^\d+$/.test(updatedData[field])
        );
      }
    });

    if (invalidField) {
      if (
        invalidField === "processor" ||
        invalidField === "processor_gen" ||
        invalidField === "model_number" ||
        invalidField === "storage" ||
        (invalidField === "configuration" &&
          !/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(updatedData[invalidField]))
      ) {
        message.error(
          `${fieldDisplayNames[invalidField]} must contain both letters and digits.`
        );
      } else if (
        (invalidField === "processor_gen" ||
          invalidField === "model_number" ||
          invalidField === "storage" ||
          invalidField === "configuration") &&
        !alphanumericRegex.test(updatedData[invalidField])
      ) {
        message.error(
          `${fieldDisplayNames[invalidField]} must be alphanumeric.`
        );
      } else {
        const displayName = fieldDisplayNames[invalidField];
        message.error(`${displayName} must contain only digits.`);
      }
      setIsLoading(false); // Set loading to false when update fails
      return; // Exit the function without updating
    }
    if (
      updatedData.hasOwnProperty("accessories") &&
      updatedData.accessories.split(",").length > 3
    ) {
      message.error("Only a maximum of three accessories are allowed.");
      setIsLoading(false); // Set loading to false when update fails
      return; // Exit the function without updating
    }
    console.log("Asset UUID:", data.key);

    try {
      const updatePayload = {
        asset_uuid: data.key,
        data: updatedData,
      };

      const response = await axiosInstance.patch("/asset/", updatePayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Updated data:", response.data);
      message.success("Asset Details successfully updated");
    } catch (error) {
      console.error("Error updating data:", error);
      message.error("Error updating asset details. Please try again.");
    }
    setIsLoading(false); // Set loading to false when update completes
  };

  const handleUpdateChange = (field: string, value: any) => {
     if (field === "business_unit") {
    // Map the business unit name to its primary key
    const businessUnitPK = uniqueBusinessOptions.find(
      (option) => option.name === value
    )?.id;
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: businessUnitPK,
    }));
  } else {
    if (field === "status" && value === "IN STORE") {
      // Change the status to "IN STOCK" when the value is "IN STORE"
      setUpdatedData((prevData) => ({
        ...prevData,
        [field]: "IN STOCK",
      }));
    } else {
      setUpdatedData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  }
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
            defaultValue={data.asset_category}
            onChange={(e) =>
              handleUpdateChange("asset_category", e.target.value)
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
            variant="filled"
            defaultValue={data.asset_type}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "170px",
              height: "40px",
              borderRadius: "5px",
              background: "#f0f0f0",
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
            variant="filled"
            defaultValue={uniqueStatusOptions[0]}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "180px",
              height: "40px",
              borderRadius: "5px",
              background: "#f0f0f0",
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
            variant="filled"
            defaultValue={data.location}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "170px",
              height: "40px",
              borderRadius: "5px",
              background: "#f0f0f0",
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
            variant="filled"
            defaultValue={data.invoice_location}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "180px",
              height: "40px",
              borderRadius: "5px",
              background: "#f0f0f0",
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
            defaultValue={data.os_version}
            onChange={(e) => handleUpdateChange("os_version", e.target.value)}
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
            defaultValue={data.mobile_os}
            onChange={(e) => handleUpdateChange("mobile_os", e.target.value)}
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
            defaultValue={data.Generation}
            onChange={(e) =>
              handleUpdateChange("processor_gen", e.target.value)
            }
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
            defaultValue={formatDate(data.date_of_purchase.toString())}
            onChange={(e) =>
              handleUpdateChange("date_of_purchase", e.target.value)
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
            defaultValue={data.warranty_period}
            onChange={(e) =>
              handleUpdateChange("warranty_period", e.target.value)
            }
            style={inputStyle}
          />{" "}
        </Form.Item>
      ),
    },
    {
      label: "Expiry Date",
      name: "Expiry Date",
      value: (
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
      value: (
        <Form.Item name="asset_detail_status">
          <b>Asset Detail Status </b>
          <br></br>
          <br></br>{" "}
          <Input
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
            onChange={(e) => handleUpdateChange("conceder", e.target.value)}
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
            defaultValue={data.serial_number}
            onChange={(e) =>
              handleUpdateChange("serial_number", e.target.value)
            }
            readOnly 
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
            defaultValue={data.model_number}
            onChange={(e) => handleUpdateChange("model_number", e.target.value)}
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
            onChange={(e) => handleUpdateChange("custodian", e.target.value)}
            style={{
              border: "0.5px solid #d3d3d3",
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
            style={{
              border: "0.5px solid #d3d3d3",
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
      label: "Product Name",
      name: "productName",
      value: (
        <Form.Item name="product name">
          <b>Product Name:</b>
          <br></br>
          <br></br>{" "}
          <Input
            defaultValue={data.product_name}
            onChange={(e) => handleUpdateChange("product_name", e.target.value)}
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
            variant="filled"
            defaultValue={uniqueBusinessOptions[0]}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "180px",
              height: "40px",
              borderRadius: "5px",
              background: "#f0f0f0",
            }}
            onChange={(value) => handleUpdateChange("business_unit", value)} // Pass only the value
          >
            {uniqueBusinessOptions.map((business_unit, index) => (
              <Select.Option
                key={index}
                value={business_unit}
                style={{ background: "#f0f0f0" }}
              >
                {business_unit.business_unit_name}
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
            variant="filled"
            defaultValue={data.memory}
            style={{
              boxShadow: "none",
              border: "0.5px solid #d3d3d3",
              width: "180px",
              height: "40px",
              borderRadius: "5px",
              background: "#f0f0f0",
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
            defaultValue={data.configuration}
            onChange={(e) =>
              handleUpdateChange("configuration", e.target.value)
            }
            readOnly 
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
            style={{
              border: "0.5px solid #d3d3d3",
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
            style={{
              border: "0.5px solid #d3d3d3",
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDeleteClick = () => {
    setIsModalVisible(true);
  };

  const [tableData, setTableData] = useState([]);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const deletePayload = {
        asset_uuid: data.key,
      };
      const response = await axiosInstance.delete("/asset/", {
        data: deletePayload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Filter out the deleted asset from the table data
        setTableData((prevData) =>
          prevData.filter((item) => item.key !== data.key)
        );

        message.success("Asset successfully deleted");
        setIsModalVisible(false);
      } else {
        console.error("Failed to delete asset");
        message.error("Failed to delete asset. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      message.error("Error deleting asset. Please try again.");
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    console.log("Asset deletion cancelled.");
    setIsModalVisible(false);
  };

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };
  const getUserScope = () => {
    const jwtToken = localStorage.getItem("jwt");
    console.log(jwtToken);
    if (jwtToken) {
      const payload = decodeJWT(jwtToken);
      return payload.user_scope;
    }
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
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
              marginLeft: "58px",
              padding: "20px",
            }}
          />

          {isMyApprovalPage && (
            <>
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <>
                  <Button
                    style={{
                      marginBottom: "0px",
                      marginTop: "0px",
                      color: "white",
                      border: "none",
                      background: "blue",
                      marginLeft: "200px",
                    }}
                    onClick={handleUpdate}
                    disabled={isLoading} // Disable button while updating
                  >
                    Update
                  </Button>
                  {getUserScope() === "LEAD" && (
                    <Button
                      type="primary"
                      danger
                      onClick={handleDeleteClick}
                      style={{
                        marginLeft: "290px",
                        marginTop: "0px",
                      }}
                    >
                      Delete Asset
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <Modal
          title="Delete Asset"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="delete" type="primary" danger onClick={handleDelete}>
              Delete
            </Button>,
          ]}
          width={400}
          centered
        >
          <p>Are you sure you want to delete the asset?</p>
        </Modal>
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
