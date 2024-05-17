import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { message, Popover, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons"; //
import axiosInstance from "../../config/AxiosConfig";
import { AssetData } from "./types";
import { Button, DatePicker, Input, Form, InputNumber, Select } from "antd";
import dayjs from "dayjs";
const { TextArea } = Input;
import styles from "./AddAsset.module.css";
import AssetFieldAutoComplete from "../AutocompleteBox/AssetFieldAutoComplete";

const { Option } = Select;

type SizeType = Parameters<typeof Form>[0]["size"];

const AddAsset: React.FC = () => {
  // State to store form data
  const [formData, setFormData] = useState<any>({});
  const [requiredFields, setRequiredFields] = useState<string[]>([
    "asset_category",
    "asset_id",
    "product_name",
    "serial_number",
    "asset_type",
    "location",
    "invoice_location",
    "business_unit",
    "os",
    "status",
    "version",
    "warranty_period",
    "date_of_purchase",
    "model_number",
  ]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const [warningShown, setWarningShown] = useState(false);

  const validateWarrantyPeriod = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!warningShown && isNaN(value as any)) {
      message.warning("Warranty period should only contain digits.");
      setWarningShown(true);
    } else if (warningShown && !isNaN(value as any)) {
      setWarningShown(false);
    }
    handleInputChange("warranty_period", value);
  };

  const validateOsVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!warningShown && isNaN(value as any)) {
      message.warning("Os Version should only contain digits.");
      setWarningShown(true);
    } else if (warningShown && !isNaN(value as any)) {
      setWarningShown(false);
    }
    handleInputChange("os_version", value);
  };
  const validateVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!warningShown && isNaN(value as any)) {
      message.warning("Version should only contain digits.");
      setWarningShown(true);
    } else if (warningShown && !isNaN(value as any)) {
      setWarningShown(false);
    }
    handleInputChange("version", value);
  };

  const [processorGenWarningShown, setProcessorGenWarningShown] =
    useState(false);

  const validateProcessorGeneration = (value: string) => {
    const alphanumericPattern = /^[a-zA-Z0-9]+$/;
    const digitPattern = /^\d+$/;
    const alphabetPattern = /^[a-zA-Z]+$/;

    if (digitPattern.test(value)) {
      if (!processorGenWarningShown) {
        message.warning("Processor generation should not contain only digits");
        setProcessorGenWarningShown(true);
      }
    } else if (alphabetPattern.test(value)) {
      if (!processorGenWarningShown) {
        message.warning(
          "Processor generation should not contain only alphabets"
        );
        setProcessorGenWarningShown(true);
      }
    } else if (!alphanumericPattern.test(value)) {
      if (!processorGenWarningShown) {
        message.warning("Processor generation should be alphanumeric");
        setProcessorGenWarningShown(true);
      }
    } else {
      setProcessorGenWarningShown(false);
    }
  };

  const [maxLengthWarningShown, setMaxLengthWarningShown] = useState(false);
  const [touched, setTouched] = useState(false); // Track if the input field has been touched

  const validateStorage = (value: string) => {
    if (!value.trim()) {
      setTouched(false); // Reset touched state if input is empty
      return; // Exit validation
    }

    setTouched(true);

    const formatPattern = /^\d{1,3}GB$/;

    const maxLength = 5;

    if (value.length > maxLength) {
      if (!maxLengthWarningShown) {
        message.warning(
          `Storage length should not exceed ${maxLength} characters.`
        );
        setMaxLengthWarningShown(true);
      }
    } else {
      setMaxLengthWarningShown(false);
    }

    if (!formatPattern.test(value)) {
      if (!warningShown && touched) {
        // Only show warning if the field has been touched
        message.warning(
          'Storage should be in the format "###GB", where ### is any one to three digits.'
        );
        setWarningShown(true);
      }
    } else {
      setWarningShown(false);
    }
  };

  const [accessoryValue, setAccessoryValue] = useState("");
  const [accessoryWarningShown, setAccessoryWarningShown] = useState(false);

  const handleAccessoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const accessories = value.split(",").map((accessory) => accessory.trim()); // Split and trim accessories

    if (accessories.length > 4 && !accessoryWarningShown) {
      message.warning("Only four accessories are allowed");
      setAccessoryWarningShown(true);
    } else if (accessories.length <= 4 && accessoryWarningShown) {
      setAccessoryWarningShown(false);
    }

    setAccessoryValue(value);
  };

  // Fetch the asset type details
  const {
    data: assetTypeData,
    isLoading: isAssetTypeLoading,
    isError: isAssetTypeError,
  } = useQuery({
    queryKey: ["assetType"],
    queryFn: () =>
      axiosInstance.get("/asset/asset_type").then((res) => res.data.data),
  });

  // Fetch memory space options
  const {
    data: memoryData,
    isLoading: isMemoryLoading,
    isError: isMemoryError,
  } = useQuery({
    queryKey: ["memorySpace"],
    queryFn: () =>
      axiosInstance.get("/asset/memory_list").then((res) => res.data.data),
  });

  // Fetch business unit details
  const {
    data: businessUnitData,
    isLoading: isBusinessUnitLoading,
    isError: isBusinessUnitError,
  } = useQuery({
    queryKey: ["businessUnit"],
    queryFn: () =>
      axiosInstance.get("/asset/business_unit").then((res) => res.data.data),
  });

  //Fetch location details

  const {
    data: locationData,
    isLoading: isLocationLoading,
    isError: isLocationError,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: () => axiosInstance.get("/asset/location").then((res) => res.data),
  });

  if (
    isAssetTypeLoading ||
    isMemoryLoading ||
    isBusinessUnitLoading ||
    isLocationLoading
  )
    return <div>Loading...</div>;
  if (
    isAssetTypeError ||
    isMemoryError ||
    isBusinessUnitError ||
    isLocationError
  )
    return <div>Error fetching data</div>;

  const asset_type = assetTypeData.map((item: any) => ({
    value: item.id,
    label: item.asset_type_name,
  }));

  const memory_space = memoryData.map((item: any) => ({
    id: item.id,
    memory_space: item.memory_space,
  }));

  const business_units = businessUnitData.map((item: any) => ({
    id: item.id,
    name: item.business_unit_name,
  }));

  const locations = locationData.data.map((item: any) => ({
    id: item.id,
    name: item.location_name,
  }));
  // Fetch data queries...

  const handleSubmit = async () => {
    setFormSubmitted(true);
    if (!formData.warranty_period) {
      // If warranty_period is undefined, set it to an empty string
      formData.warranty_period = "";
    }
    if (
      !formData.asset_category ||
      !formData.asset_id ||
      !formData.product_name ||
      !formData.serial_number ||
      !formData.asset_type ||
      !formData.location ||
      !formData.invoice_location ||
      !formData.business_unit ||
      !formData.os ||
      !formData.version ||
      !formData.warranty_period ||
      !formData.date_of_purchase
    ) {
      message.error("Please fill in all mandatory fields.");
      return;
    }
    const warrantyPeriodValue = formData.warranty_period.trim();
    if (warrantyPeriodValue !== "" && !/^\d+$/.test(warrantyPeriodValue)) {
      message.error("Warranty period should be a valid integer.");
      return;
    }
    const versionValue = formData.version.trim();
    if (versionValue !== "" && !/^\d+$/.test(versionValue)) {
      message.error("Version should only contain digits.");
      return;
    }
    const osVersionValue = formData.os_version.trim();
    if (osVersionValue !== "" && !/^\d+$/.test(osVersionValue)) {
      message.error("OS version should only contain digits.");
      return;
    }
    const storageValue = formData.storage?.trim();
    const formatPattern = /^\d{1,3}GB$/;

    if (storageValue && !formatPattern.test(storageValue)) {
      message.error(
        'Storage should be in the format "###GB", where ### is any one to three digits.'
      );
      return;
    }
    const processorValue = formData.processor?.trim();
    const processorGenValue = formData.processor_gen?.trim();
    const alphanumericPattern = /^[a-zA-Z0-9]+$/;

    if (
      (processorValue && !alphanumericPattern.test(processorValue)) ||
      (processorGenValue && !alphanumericPattern.test(processorGenValue))
    ) {
      message.error(
        "Processor and Processor Generation should be alphanumeric."
      );
      return;
    }

    console.log("Attempting to submit form data:", formData);
    const response = await axiosInstance.post(
      import.meta.env["VITE_ADD_ASSET_URL"],
      formData
    );
    console.log("Form Data Posted:", response.data);
    message.success("Form data submitted successfully");

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="font-display">
      <div className={styles["container"]}>
        <h1 className={styles["heading"]}>Create a new asset</h1>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          onValuesChange={onFormLayoutChange}
          size={componentSize as SizeType}
          labelAlign="left"
          style={{ padding: "20px", overflowX: "hidden" }}
          className={styles["formContainer"]}
        >
          {/* Form items... */}

          
          <Form.Item
            label={
              <span>
                Autocomplete<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.asset_category &&
              requiredFields.includes("asset_category") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.asset_category &&
              requiredFields.includes("asset_category") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <AssetFieldAutoComplete assetField="user" />
          </Form.Item>

          {/* Category */}
          <Form.Item
            label={
              <span>
                Category<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.asset_category &&
              requiredFields.includes("asset_category") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.asset_category &&
              requiredFields.includes("asset_category") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Select
              className={styles["input"]}
              placeholder="Select asset category"
              onChange={(value) => handleInputChange("asset_category", value)}
            >
              <Option value="HARDWARE">Hardware</Option>
              <Option value="SOFTWARE">Software</Option>
            </Select>
          </Form.Item>

          {/* Asset ID */}
          <Form.Item
            label={
              <span>
                Asset ID<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.asset_id &&
              requiredFields.includes("asset_id") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.asset_id &&
              requiredFields.includes("asset_id") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Input
              placeholder="Enter Asset ID"
              className={styles["input"]}
              onChange={(e) => handleInputChange("asset_id", e.target.value)}
              suffix={
                <Tooltip title="Asset Id should be alphanumeric Eg:ASS101">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Version<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.version &&
              requiredFields.includes("version") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.version &&
              requiredFields.includes("version") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Input
              className={styles["input"]}
              placeholder="Enter version number"
              onChange={(e) => validateVersion(e)}
              suffix={
                <Tooltip title="Version number should be digit eg:2,3">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Asset Type<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.asset_type &&
              requiredFields.includes("asset_type") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.asset_type &&
              requiredFields.includes("asset_type") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Select
              className={styles["input"]}
              placeholder="Select asset type"
              onChange={(value) => handleInputChange("asset_type", value)}
              options={asset_type}
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Product Name<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.product_name &&
              requiredFields.includes("product_name") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.product_name &&
              requiredFields.includes("product_name") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Input
              placeholder="Enter Product name"
              className={styles["input"]}
              onChange={(e) =>
                handleInputChange("product_name", e.target.value)
              }
              suffix={
                <Tooltip title="Product name should not exceed 20 characters">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Model Number<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.model_number &&
              requiredFields.includes("model_number") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.model_number &&
              requiredFields.includes("model_number") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Input
              placeholder="Enter Model number"
              className={styles["input"]}
              onChange={(e) =>
                handleInputChange("model_number", e.target.value)
              }
              suffix={
                <Tooltip
                  placement="top"
                  title="Model number should be alphanumeric Eg:MN101"
                >
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Serial Number<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.serial_number &&
              requiredFields.includes("serial_number") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.serial_number &&
              requiredFields.includes("serial_number") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Input
              placeholder="Enter serial number"
              className={styles["input"]}
              onChange={(e) =>
                handleInputChange("serial_number", e.target.value)
              }
              suffix={
                <Tooltip
                  placement="top"
                  title="Serial number should be alphanumeric and should not exceed 30 characters Eg:ABC123DEF456"
                >
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item label="Owner" className={styles["formItem"]}>
            <Select
              className={styles["input"]}
              placeholder="Select owner"
              onChange={(value) => handleInputChange("owner", value)}
            >
              <Option value="EXPERION">EXPERION</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span>
                Purchase Date<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.date_of_purchase &&
              requiredFields.includes("date_of_purchase") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.date_of_purchase &&
              requiredFields.includes("date_of_purchase") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <DatePicker
              className={styles["input"]}
              placeholder="Enter purchase date"
              format="YYYY-MM-DD" // Set the format to YYYY-MM-DD
              onChange={(_date, dateString) =>
                handleInputChange("date_of_purchase", dateString)
              } // Use dateString to get the formatted date
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Warranty Period<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.warranty_period &&
              requiredFields.includes("warranty_period") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.warranty_period &&
              requiredFields.includes("warranty_period") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Input
              className={styles["input"]}
              placeholder="Enter warranty period"
              onChange={(e) => validateWarrantyPeriod(e)}
              suffix={
                <Tooltip
                  placement="top"
                  title="Warranty period should be digit Eg:2,3"
                >
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Product Location<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.location &&
              requiredFields.includes("location") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.location &&
              requiredFields.includes("location") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Select
              className={styles["input"]}
              placeholder="Select product location"
              onChange={(value) => handleInputChange("location", value)}
            >
              {locations.map((location: any) => (
                <Option key={location.id}>{location.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span>
                Invoice Location<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
            validateStatus={
              !formData.invoice_location &&
              requiredFields.includes("invoice_location") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.invoice_location &&
              requiredFields.includes("invoice_location") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Select
              className={styles["input"]}
              placeholder="Select invoice location"
              onChange={(value) => handleInputChange("invoice_location", value)}
            >
              {locations.map((location: any) => (
                <Option key={location.id}>{location.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Business Unit"
            className={styles["formItem"]}
            validateStatus={
              !formData.business_unit &&
              requiredFields.includes("business_unit") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.business_unit &&
              requiredFields.includes("business_unit") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Select
              className={styles["input"]}
              placeholder="Select business unit"
              onChange={(value) => handleInputChange("business_unit", value)}
            >
              {business_units.map((item: any) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="OS:"
            className={styles["formItem"]}
            validateStatus={
              !formData.business_unit &&
              requiredFields.includes("business_unit") &&
              formSubmitted
                ? "error"
                : ""
            }
            help={
              !formData.business_unit &&
              requiredFields.includes("business_unit") &&
              formSubmitted
                ? "Required"
                : ""
            }
          >
            <Select
              className={styles["input"]}
              placeholder="Select OS"
              onChange={(value) => handleInputChange("os", value)}
            >
              <Option value="WINDOWS">Windows</Option>

              <Option value="MAC">Mac</Option>
              <Option value="LINUX">Linux</Option>
            </Select>
          </Form.Item>

          <Form.Item label="OS  version" className={styles["formItem"]}>
            <Input
              placeholder="Enter OS version "
              className={styles["input"]}
              onChange={(e) => validateOsVersion(e)}
              suffix={
                <Tooltip title="Enter OS version in X.Y.Z format">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item label="Mobile OS" className={styles["formItem"]}>
            <Input
              placeholder="Enter Mobile OS"
              className={styles["input"]}
              onChange={(e) => handleInputChange("mobile_os", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Processor" className={styles["formItem"]}>
            <Input
              placeholder="Enter processor"
              className={styles["input"]}
              onChange={(e) => handleInputChange("processor", e.target.value)}
              suffix={
                <Tooltip title="Processor should be alphanumeric">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item label="Processor Gen:" className={styles["formItem"]}>
            <Input
              placeholder="Enter processor generation"
              className={styles["input"]}
              onChange={(e) => {
                validateProcessorGeneration(e.target.value);
                handleInputChange("processor_gen", e.target.value);
              }}
              suffix={
                <Tooltip title="Processor gen should be alphanumeric">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item label="Memory:" className={styles["formItem"]}>
            <Select
              className={styles["input"]}
              placeholder="Select memory space"
            >
              {memory_space.map((item: any) => (
                <Option key={item.id}>{item.memory_space}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Storage:" className={styles["formItem"]}>
            <Input
              placeholder="Enter Storage"
              className={styles["input"]}
              onChange={(e) => {
                const value = e.target.value;
                validateStorage(value); // Validate the storage input
                handleInputChange("storage", value); // Update the form data
              }}
              suffix={
                <Tooltip title="Storage should be in the format ###GB Eg:512GB">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item label="Configuration:" className={styles["formItem"]}>
            <Input
              placeholder="Enter configuration"
              className={styles["input"]}
              onChange={(e) =>
                handleInputChange("configuration", e.target.value)
              }
            />
          </Form.Item>

          <Form.Item label="Accessories:" className={styles["formItem"]}>
            <Input
              placeholder="Enter Accessory"
              className={styles["input"]}
              onChange={(e) => handleAccessoryChange(e)}
            />
          </Form.Item>

          <Form.Item label="Status:" className={styles["formItem"]}>
            <Select
              className={styles["input"]}
              defaultValue="in store"
              placeholder="Select Approval"
              onChange={(value) => handleInputChange("status", value)}
            >
              <Option value="in store">IN-STOCK</Option>
              <Option value="in repair">IN-REPAIR</Option>
              <Option value="expired">EXPIRED</Option>
              <Option value="disposed">DISPOSED</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Asset Remark/s:" className={styles["formItem"]}>
            <TextArea
              rows={4}
              className={styles["input"]}
              placeholder="Enter asset remarks/s"
              onChange={(e) => handleInputChange("remark", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Reason of creation:" className={styles["formItem"]}>
            <Input
              placeholder="Enter reason for creation"
              className={styles["input"]}
              onChange={(e) => handleInputChange("message", e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              className={styles["button"]}
              ghost
              style={{
                background: "rgb(22, 119, 255)",
                marginTop: "30px",
                width: "120px",
                height: "40px",
              }}
              onClick={() => handleSubmit()} // Example: Log form data on submit
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddAsset;
