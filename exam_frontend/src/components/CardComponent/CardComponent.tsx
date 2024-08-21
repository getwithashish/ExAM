import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Space,
  Input,
  Button,
  ConfigProvider,
  Row,
  Col,
  message,
  Modal,
  Tooltip,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "./CardComponent.css";
import { DataType } from "../AssetTable/types/index";
import { CardType } from "./types/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/AxiosConfig";
import { Spin } from "antd";
import AssetFieldAutoComplete from "../AutocompleteBox/AssetFieldAutoComplete";
import { MenuItem, Select, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface UpdateData {
  asset_uuid: string;
  data: Partial<DataType>; // Partial to allow updating only specific fields
  isMyApprovalPage: boolean;
}
const CardComponent: React.FC<CardType> = ({
  readOnly,
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
  setDrawerVisible,
  assetDataRefetch,
  onClose,
  onDelete,
  
}) => {
  const uniqueStatusOptions = Array.from(new Set(statusOptions));
  const uniqueBusinessOptions = Array.from(new Set(businessUnitOptions));
  const uniqueLocationoptions = Array.from(new Set(locations));
  const uniqueMemoryOptions = Array.from(new Set(memoryData));
  const uniqueAssetTypeOptions = Array.from(new Set(assetTypeData));

  const [_assetCategoryOption, setAssetCategoryOption] = React.useState();
  const [assetName, setAssetName] = React.useState("");
  const [assetModelNumber, setAssetModelNumber] = React.useState("");
  const [assetLocation, setAssetLocation] = React.useState("");
  const [assetInLocation, setAssetInLocation] = React.useState("");
  const [assetType, setAssetType] = React.useState("");
  const [assetBusinessUnit, setAssetBusinessUnit] = React.useState("");
  const [assetStatusOption, setAssetStatusOption] = React.useState("");
  const [assetMemory, setAssetMemory] = React.useState("");
  const [assetStorage, setAssetStorage] = React.useState("");
  const [assetDetailStatusOption, setAssetDetailStatusOption] =
    React.useState("");
  const [assetOs, setAssetOs] = React.useState("");
  const [assetOsVersion, setAssetOsVersion] = React.useState("");
  const [assetMobileOs, setAssetMobileOs] = React.useState("");
  const [assetLicenseType, setAssetLicenseType] = React.useState("");
  const [assetProcessor, setAssetProcessor] = React.useState("");
  const [assetProcessorGen, setAssetProcessorGen] = React.useState("");
  const [assetPurchaseDate, setAssetPurchaseDate] = React.useState("");
  const [assetWarrantyPeriod, setAssetWarrantyPeriod] = React.useState("");
  const [assetOwner, setAssetOwner] = React.useState("");
  const [assetConfiguration, setAssetConfiguration] = React.useState("");

  const assetCategoryValues = ["HARDWARE", "SOFTWARE"];
  const assetStatusValues = ["DAMAGED", "REPAIR", "OUTDATED", "SCRAP"];

  useEffect(() => {
    if (
      assetType === data?.asset_type ||
      assetType?.asset_type_name === data?.asset_type
    ) {
      removeKeyFromUpdatedData("asset_type");
    } else {
      handleUpdateChange("asset_type", assetType?.id);
    }
  }, [assetType]);

  useEffect(() => {
    if (
      assetName === data?.product_name ||
      assetName?.product_name === data?.product_name
    ) {
      removeKeyFromUpdatedData("product_name");
    } else {
      handleUpdateChange("product_name", assetName?.product_name);
    }
  }, [assetName]);

  useEffect(() => {
    if (
      assetModelNumber === data?.model_number ||
      assetModelNumber?.model_number === data?.model_number
    ) {
      removeKeyFromUpdatedData("model_number");
    } else {
      handleUpdateChange(
        "model_number",
        assetModelNumber?.model_number === ""
          ? null
          : assetModelNumber?.model_number
      );
    }
  }, [assetModelNumber]);

  useEffect(() => {
    if (
      assetBusinessUnit === data?.business_unit ||
      assetBusinessUnit?.business_unit_name === data?.business_unit
    ) {
      removeKeyFromUpdatedData("business_unit");
    } else {
      handleUpdateChange("business_unit", assetBusinessUnit?.id);
    }
  }, [assetBusinessUnit]);

  useEffect(() => {
    if (assetOwner === data?.owner || assetOwner?.owner === data?.owner) {
      removeKeyFromUpdatedData("owner");
    } else {
      handleUpdateChange("owner", assetOwner?.owner);
    }
  }, [assetOwner]);

  useEffect(() => {
    if (
      assetLocation === data?.location ||
      assetLocation?.location_name === data?.location
    ) {
      removeKeyFromUpdatedData("location");
    } else {
      handleUpdateChange("location", assetLocation?.id);
    }
  }, [assetLocation]);

  useEffect(() => {
    if (
      assetInLocation === data?.invoice_location ||
      assetInLocation?.location_name === data?.invoice_location
    ) {
      removeKeyFromUpdatedData("invoice_location");
    } else {
      handleUpdateChange("invoice_location", assetInLocation?.id);
    }
  }, [assetInLocation]);

  useEffect(() => {
    if (assetPurchaseDate === data?.date_of_purchase) {
      removeKeyFromUpdatedData("date_of_purchase");
    } else {
      handleUpdateChange("date_of_purchase", assetPurchaseDate);
    }
  }, [assetPurchaseDate]);

  useEffect(() => {
    if (assetOs === data?.os || assetOs?.os === data?.os) {
      removeKeyFromUpdatedData("os");
    } else {
      handleUpdateChange("os", assetOs?.os === "" ? null : assetOs?.os);
    }
  }, [assetOs]);

  useEffect(() => {
    if (
      assetOsVersion === data?.os_version ||
      assetOsVersion?.os_version === data?.os_version
    ) {
      removeKeyFromUpdatedData("os_version");
    } else {
      handleUpdateChange(
        "os_version",
        assetOsVersion?.os_version === "" ? null : assetOsVersion?.os_version
      );
    }
  }, [assetOsVersion]);

  useEffect(() => {
    if (
      assetMobileOs === data?.mobile_os ||
      assetMobileOs?.mobile_os === data?.mobile_os
    ) {
      removeKeyFromUpdatedData("mobile_os");
    } else {
      handleUpdateChange(
        "mobile_os",
        assetMobileOs?.mobile_os === "" ? null : assetMobileOs?.mobile_os
      );
    }
  }, [assetMobileOs]);

  useEffect(() => {
    if (
      assetLicenseType === data?.license_type ||
      assetLicenseType?.license_type === (data?.license_type ?? "")
    ) {
      removeKeyFromUpdatedData("license_type");
    } else {
      handleUpdateChange(
        "license_type",
        assetLicenseType?.license_type === ""
          ? null
          : assetLicenseType?.license_type
      );
    }
  }, [assetLicenseType]);

  useEffect(() => {
    if (
      assetProcessor === data?.processor ||
      assetProcessor?.processor === data?.processor
    ) {
      removeKeyFromUpdatedData("processor");
    } else {
      handleUpdateChange(
        "processor",
        assetProcessor?.processor === "" ? null : assetProcessor?.processor
      );
    }
  }, [assetProcessor]);

  useEffect(() => {
    if (
      assetProcessorGen === data?.Generation ||
      assetProcessorGen?.processor_gen === data?.Generation
    ) {
      removeKeyFromUpdatedData("processor_gen");
    } else {
      handleUpdateChange(
        "processor_gen",
        assetProcessorGen?.processor_gen === ""
          ? null
          : assetProcessorGen?.processor_gen
      );
    }
  }, [assetProcessorGen]);

  useEffect(() => {
    if (
      assetMemory === data?.memory?.toString() ||
      assetMemory?.memory_space === (data?.memory ?? "")
    ) {
      removeKeyFromUpdatedData("memory");
    } else {
      handleUpdateChange("memory", assetMemory?.id ?? null);
    }
  }, [assetMemory]);

  useEffect(() => {
    if (
      assetStorage === data?.storage ||
      assetStorage?.storage === data?.storage
    ) {
      removeKeyFromUpdatedData("storage");
    } else {
      handleUpdateChange(
        "storage",
        assetStorage?.storage === "" ? null : assetStorage?.storage
      );
    }
  }, [assetStorage]);

  const handleWarrantyPeriodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    var currentWarrantyPeriod = data?.warranty_period?.toString();
    if (data?.warranty_period === null) {
      currentWarrantyPeriod = "";
    }
    if (value === "" || /^[0-9]*$/.test(value)) {
      if (value === currentWarrantyPeriod) {
        removeKeyFromUpdatedData("warranty_period");
      } else {
        if (value === "" || value === null) {
          handleUpdateChange("warranty_period", null);
        } else {
          handleUpdateChange("warranty_period", parseInt(value));
        }
      }
    } else {
      message.warning("Warranty period should only contain digits.");
      removeKeyFromUpdatedData("warranty_period");
    }
  };

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

    // if (invalidField) {
    //   if (
    //     invalidField === "processor" ||
    //     invalidField === "processor_gen" ||
    //     invalidField === "model_number" ||
    //     invalidField === "storage" ||
    //     (invalidField === "configuration" &&
    //       !/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(updatedData[invalidField]))
    //   ) {
    //     message.error(
    //       `${fieldDisplayNames[invalidField]} must contain both letters and digits.`
    //     );
    //   } else if (
    //     (invalidField === "processor_gen" ||
    //       invalidField === "model_number" ||
    //       invalidField === "storage" ||
    //       invalidField === "configuration") &&
    //     !alphanumericRegex.test(updatedData[invalidField])
    //   ) {
    //     message.error(
    //       `${fieldDisplayNames[invalidField]} must be alphanumeric.`
    //     );
    //   } else {
    //     const displayName = fieldDisplayNames[invalidField];
    //     message.error(`${displayName} must contain only digits.`);
    //   }
    //   setIsLoading(false); // Set loading to false when update fails
    //   return; // Exit the function without updating
    // }
    // if (
    //   updatedData.hasOwnProperty("accessories") &&
    //   updatedData.accessories.split(",").length > 3
    // ) {
    //   message.error("Only a maximum of three accessories are allowed.");
    //   setIsLoading(false); // Set loading to false when update fails
    //   return; // Exit the function without updating
    // }

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
      message.success(response.data?.message);
    } catch (error) {
      console.error("Error updating data:", error);
      message.error(er);
    }
    setIsLoading(false); // Set loading to false when update completes
    assetDataRefetch();
    setDrawerVisible(false);
  };

  const handleUpdateChange = (field: string, value: any) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const removeKeyFromUpdatedData = (keyName: string) => {
    var newUpdatedData = updatedData;
    delete newUpdatedData[keyName];
    setUpdatedData(newUpdatedData);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const formItems = [
    {
      label: "Product Name",
      name: "productName",
      value: (
        <Form.Item
          name="product name"
          rules={[{ required: true, message: "Product Name is required" }]}
        >
          <b>
            Product Name: <span style={{ color: "red" }}>*</span>
          </b>
          <br></br>
          <br></br>
          <AssetFieldAutoComplete
            assetField="product_name"
            value={assetName}
            setValue={setAssetName}
            defaultValue={data.product_name}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "Asset Category",
      value: (
        <Form.Item
          name="assetCategory"
          rules={[{ required: true, message: "Asset Category is required" }]}
        >
          <b style={{ display: "block" }}>
            Asset Category: <span style={{ color: "red" }}>*</span>
          </b>{" "}
          <br></br>
          <Select
            id="simple-select-modify-category"
            label="Asset Category"
            sx={{ width: "100%" }}
            displayEmpty
            disabled={readOnly}
            onChange={(event) => {
              var categoryValue = (event.target.value as string).toUpperCase();
              if (categoryValue === data?.asset_category?.toUpperCase()) {
                removeKeyFromUpdatedData("asset_category");
              } else {
                handleUpdateChange("asset_category", categoryValue);
              }
              setAssetCategoryOption(categoryValue);
            }}
            renderValue={(value) => {
              if (value === undefined || value === "") {
                return data?.asset_category?.toUpperCase();
              } else {
                return value;
              }
            }}
          >
            {assetCategoryValues.map((field, index) => (
              <MenuItem key={index} value={field.toUpperCase()}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      label: "Asset Type",
      value: (
        <Form.Item name="status">
          <b> Asset Type:</b>
          <br></br>
          <br></br>
          <AssetFieldAutoComplete
            assetField="asset_type"
            value={assetType}
            setValue={setAssetType}
            defaultValue={data.asset_type}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "Asset Status",
      name: "assetStatus",
      value: (
        <Form.Item name="assetStatus">
          <b> Asset Status:</b>
          <br></br>
          <br></br>
          <Select
            id="simple-select-modify-status"
            sx={{ width: "100%" }}
            label="Asset Status"
            displayEmpty
            disabled={readOnly}
            onChange={(event) => {
              var statusValue = (event.target.value as string).toUpperCase();
              if (statusValue === data?.status?.toUpperCase()) {
                removeKeyFromUpdatedData("status");
              } else {
                handleUpdateChange("status", statusValue);
              }
              setAssetStatusOption(statusValue);
            }}
            renderValue={(value) => {
              if (value === undefined || value === "") {
                return data.status.toUpperCase();
              } else {
                return value;
              }
            }}
          >
            {assetStatusValues.map((field, index) => (
              <MenuItem key={index} value={field.toUpperCase()}>
                {field}
              </MenuItem>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      label: "Serial Number",
      name: "serialNumber",
      value: (
        <Form.Item
          name="serial number"
          rules={[{ required: true, message: "Serial Number is required" }]}
        >
          <b>
            Serial Number: <span style={{ color: "red" }}>*</span>
          </b>{" "}
          <br></br>
          <br></br>
          <TextField
            id="outlined-textarea-serial-hardware-modify"
            label="Serial Number"
            defaultValue={data?.serial_number}
            sx={{ width: "100%" }}
            onChange={(e) => {
              var serialNumberValue = e.target.value as string;
              if (serialNumberValue === data?.serial_number) {
                removeKeyFromUpdatedData("serial_number");
              } else {
                if (serialNumberValue === "" || serialNumberValue === null) {
                  handleUpdateChange("serial_number", null);
                } else {
                  handleUpdateChange("serial_number", serialNumberValue);
                }
              }
            }}
            disabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "Model Number",
      name: "modelNumber",
      value: (
        <Form.Item name="model number">
          <b>Model Number:</b> <br></br>
          <br></br>
          <AssetFieldAutoComplete
            assetField="model_number"
            value={assetModelNumber}
            setValue={setAssetModelNumber}
            defaultValue={data.model_number}
            isDisabled={readOnly}
          />
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
          <AssetFieldAutoComplete
            assetField="business_unit"
            value={assetBusinessUnit}
            setValue={setAssetBusinessUnit}
            defaultValue={data.business_unit}
            isDisabled={readOnly}
          />
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
          <br></br>
          <AssetFieldAutoComplete
            assetField="owner"
            value={assetOwner}
            setValue={setAssetOwner}
            defaultValue={data.owner}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "Location",
      name: "location",
      value: (
        <Form.Item
          name="location"
          className="formItem"
          rules={[{ required: true, message: "Location is required" }]}
        >
          <b>
            {" "}
            Asset Location: <span style={{ color: "red" }}>*</span>
          </b>
          <br></br>
          <br></br>
          <AssetFieldAutoComplete
            assetField="location"
            value={assetLocation}
            setValue={setAssetLocation}
            defaultValue={data.location}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "Invoice Location",
      name: "invoice location",
      value: (
        <Form.Item
          name="location"
          rules={[{ required: true, message: "Invoice Location is required" }]}
        >
          <b>
            Invoice Location: <span style={{ color: "red" }}>*</span>
          </b>
          <br></br>
          <br></br>
          <AssetFieldAutoComplete
            assetField="location"
            value={assetInLocation}
            setValue={setAssetInLocation}
            defaultValue={data.invoice_location}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "Date of Purchase",
      name: "dateOfPurchase",
      value: (
        <Form.Item
          name="date of purchase"
          rules={[{ required: true, message: "Date of Purchase is required" }]}
        >
          <b>
            Date of Purchase: <span style={{ color: "red" }}>*</span>
          </b>{" "}
          <br></br>
          <br></br>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={"Purchase Date"}
              format="YYYY/MM/DD"
              defaultValue={dayjs(data.date_of_purchase)}
              sx={{ width: "100%" }}
              onChange={(value) => {
                if (value === null || !value.isValid()) {
                  setAssetPurchaseDate(
                    dayjs(data.date_of_purchase).format("YYYY-MM-DD")
                  );
                } else {
                  setAssetPurchaseDate(value.format("YYYY-MM-DD"));
                }
              }}
              disabled={readOnly}
            />
          </LocalizationProvider>
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
          <br></br>
          <TextField
            id="outlined-number-warranty-period-modify"
            label="Warranty Period"
            defaultValue={data.warranty_period}
            InputProps={{
              endAdornment: (
                <Tooltip title="Warranty period should be in months Eg: 12, 24">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              ),
            }}
            sx={{ width: "100%" }}
            onChange={(e) => {
              handleWarrantyPeriodChange(e);
            }}
            disabled={readOnly}
          />
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
          <br></br>
          <AssetFieldAutoComplete
            assetField="os"
            value={assetOs}
            setValue={setAssetOs}
            defaultValue={data.os}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    // {
    //   label: "OS Version",
    //   name: "osVersion",
    //   value: (
    //     <Form.Item name="os version">
    //       <b>OS Version:</b>
    //       <br></br>
    //       <br></br>
    //       <AssetFieldAutoComplete
    //         assetField="os_version"
    //         value={assetOsVersion}
    //         setValue={setAssetOsVersion}
    //         defaultValue={data.os_version}
    //         isDisabled={readOnly}
    //       />
    //     </Form.Item>
    //   ),
    // },
    {
      label: "Mobile OS",
      name: "mobileOs",
      value: (
        <Form.Item name="mobile os">
          <b>Mobile OS: </b>
          <br></br>
          <br></br>
          <AssetFieldAutoComplete
            assetField="mobile_os"
            value={assetMobileOs}
            setValue={setAssetMobileOs}
            defaultValue={data.mobile_os}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "License Type",
      name: "licenseType",
      value: (
        <Form.Item name="license type">
          <b>License Type: </b>
          <br></br>
          <br></br>
          <AssetFieldAutoComplete
            assetField="license_type"
            value={assetLicenseType}
            setValue={setAssetLicenseType}
            defaultValue={data.license_type ?? null}
            isDisabled={readOnly}
          />
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
          <br></br>
          <AssetFieldAutoComplete
            assetField="processor"
            value={assetProcessor}
            setValue={setAssetProcessor}
            defaultValue={data.processor}
            isDisabled={readOnly}
          />
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
          <br></br>
          <AssetFieldAutoComplete
            assetField="processor_gen"
            value={assetProcessorGen}
            setValue={setAssetProcessorGen}
            defaultValue={data.Generation}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "Memory",
      name: "memory",
      value: (
        <Form.Item name="business_unit">
          <b>Memory:</b>
          <br></br>
          <br></br>
          <AssetFieldAutoComplete
            assetField="memory"
            value={assetMemory}
            setValue={setAssetMemory}
            defaultValue={data?.memory?.toString()}
            isDisabled={readOnly}
          />
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
          <br></br>
          <AssetFieldAutoComplete
            assetField="storage"
            value={assetStorage}
            setValue={setAssetStorage}
            defaultValue={data.storage}
            isDisabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "Accessories",
      name: "accessories",
      value: (
        <Form.Item name="accessories">
          <b>Accessories:</b> <br></br>
          <br></br>
          <TextField
            id="outlined-textarea-accessories-hardware-modify"
            label="Accessories"
            defaultValue={data.accessories}
            sx={{ width: "100%" }}
            onChange={(e) => {
              var accessoriesValue = e.target.value as string;
              if (accessoriesValue === data?.accessories) {
                removeKeyFromUpdatedData("accessories");
              } else {
                if (accessoriesValue === "" || accessoriesValue === null) {
                  handleUpdateChange("accessories", null);
                } else {
                  handleUpdateChange("accessories", accessoriesValue);
                }
              }
            }}
            disabled={readOnly}
          />
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
    //       <br></br>
    //       <TextField
    //         id="outlined-textarea-configuration-hardware-modify"
    //         label="Configuration"
    //         multiline
    //         disabled={readOnly}
    //         defaultValue={data.configuration}
    //         sx={{ width: "100%" }}
    //         // onChange={(e) => {
    //         //   handleAccessoryChange(e);
    //         // }}
    //       />
    //     </Form.Item>
    //   ),
    // },
    {
      label: "Comments",
      name: "comments",
      value: (
        <Form.Item name="comments">
          <b>Comments: </b>
          <br></br>
          <br></br>
          <TextField
            id="outlined-textarea-comments-modify"
            label="Comments"
            multiline
            defaultValue={data.notes}
            sx={{ width: "100%" }}
            onChange={(e) => {
              var comments = e.target.value as string;
              if (comments === data?.notes) {
                removeKeyFromUpdatedData("notes");
              } else {
                if (comments === "" || comments === null) {
                  handleUpdateChange("notes", null);
                } else {
                  handleUpdateChange("notes", comments);
                }
              }
            }}
            disabled={readOnly}
          />
        </Form.Item>
      ),
    },
    {
      label: "approval_status_message",
      name: "approval_status_message",
      value: (
        <Form.Item name="approval_status_message">
          <b>Approver Message: </b>
          <br></br>
          <br></br>
          <TextField
            id="outlined-textarea-approver-notes-modify"
            label="Approver Notes"
            multiline
            disabled={readOnly}
            defaultValue={data.approval_status_message}
            sx={{ width: "100%" }}
          />
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
      setIsModalVisible(false);
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
        assetDataRefetch();
        setDrawerVisible(false);
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

  const handleRestore = async () => {
    try {
      setIsLoading(true);
      setIsModalVisible(false);
      const restorePayload = {
        asset_uuid: data.key,
      };
      const response = await axiosInstance.put("/asset/", restorePayload);

      if (response.status === 200) {
        setTableData((prevData) =>
          prevData.filter((item) => item.key !== data.key)
        );

        message.success("Asset successfully restored");
        assetDataRefetch();
        setDrawerVisible(false);
      } else {
        message.error("Failed to restore asset. Please try again.");
      }
    } catch (error) {
      message.error("Error restore asset. Please try again.");
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
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
                  {getUserScope() === "SYSTEM_ADMIN" && (
                    <Button
                      style={{
                        marginBottom: "0px",
                        marginTop: "0px",
                        color: "white",
                        border: "none",
                        background: "blue",
                        marginLeft: "600px",
                      }}
                      onClick={handleUpdate}
                      disabled={isLoading} // Disable button while updating
                    >
                      Update
                    </Button>
                  )}
                  {getUserScope() === "LEAD" && (
                    <Button
                      type="primary"
                      danger
                      onClick={handleDeleteClick}
                      style={{
                        marginLeft: "570px",
                        marginTop: "0px",
                      }}
                    >
                      Delete Asset
                    </Button>
                  )}
                  {getUserScope() === "MANAGER" && (
                    <Button
                      type="primary"
                      danger
                      onClick={handleDeleteClick}
                      style={{
                        marginLeft: "570px",
                        marginTop: "0px",
                      }}
                    >
                      Restore Asset
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <Modal
          title="Delete Asset"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            getUserScope() === "LEAD" ? (
              <Button key="delete" type="primary" danger onClick={handleDelete}>
                Delete
              </Button>
            ) : (
              <Button
                key="restore"
                type="primary"
                danger
                onClick={handleRestore}
              >
                Restore
              </Button>
            ),
          ]}
          width={400}
          centered
        >
          <p>Are you sure you want to restore the asset?</p>
        </Modal>
      </div>

      <div className="scrollable-content">
        <Form key={data.asset_id} title="">
          <Row gutter={{ xs: 16, sm: 32, md: 24, lg: 32 }}>
            {filteredFormItems.map((item, index) => (
              <Col
                className="gutter-row"
                span={6}
                xs={24}
                sm={12}
                md={8}
                lg={6}
              >
                <Form.Item key={index}>
                  <div key={index}>{item.value}</div>
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </div>
    </div>
  );
};
export default CardComponent;
