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
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  

  const hardwareSpecificFields = [
    "model_number",
    "asset_id",
    "asset_type",
    "serial_number",
    "warranty_period",
    "location",
    "invoice_location",
    "date_of_purchase",
  ];

  const softwareSpecificFields = [
    "asset_id",
    "product_name",
    "location",
    "date_of_purchase",

    // Add other software specific fields here...
  ];
  const setRequiredFieldsByCategory = (category: string) => {
    let requiredFieldsArray: string[] = [
      "asset_category",
      "asset_id",
      "product_name",
      "serial_number",
      "location",
      "invoice_location",
      "business_unit",
      "os",
      "status",
      "warranty_period",
      "date_of_purchase",
    ];
    if (category === "HARDWARE") {
      requiredFieldsArray = requiredFieldsArray.concat(hardwareSpecificFields);
    } else if (category === "SOFTWARE") {
      requiredFieldsArray = requiredFieldsArray.concat(softwareSpecificFields);
    }

    setRequiredFields(requiredFieldsArray);
  };

  useEffect(() => {
    setRequiredFieldsByCategory(formData.asset_category);
  }, [formData.asset_category]);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const [value, setValue] = React.useState("");
  const [assettypeValue, setassettypeValue] = React.useState("");
  const[assetLocation,setAssetLocation]=React.useState("");
  const[assetInLocation,setAssetInLocation]=React.useState("");

  const[assetBu,setAssetBu]=React.useState("");



  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value,assettypeValue, assetLocation,assetInLocation,assetBu});
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
  const {
    data: memoryData,
    isLoading: isMemoryLoading,
    isError: isMemoryError,
  } = useQuery({
    queryKey: ["memorySpace"],
    queryFn: () =>
      axiosInstance.get("/asset/memory_list").then((res) => res.data.data),
  });
  const {
    data: businessUnitData,
    isLoading: isBusinessUnitLoading,
    isError: isBusinessUnitError,
  } = useQuery({
    queryKey: ["businessUnit"],
    queryFn: () =>
      axiosInstance.get("/asset/business_unit").then((res) => res.data.data),
  });

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

  const handleSubmit = async () => {
    setFormSubmitted(true);

    // Ensure that warranty_period is not undefined for hardware assets
    if (
      formData.asset_category === "HARDWARE" &&
      !formData.warranty_period &&
      !formData.asset_type
    ) {
      formData.warranty_period = "";
    }

    // Check if all mandatory fields are filled for software
    const isAllSoftwareFieldsFilled = softwareSpecificFields.every(
      (field) => !!formData[field]
    );

    // Check if all mandatory fields are filled for hardware
    const isAllHardwareFieldsFilled = hardwareSpecificFields.every(
      (field) => !!formData[field]
    );

    // If it's a software asset and all mandatory fields are filled
    if (formData.asset_category === "SOFTWARE") {
      // Set the asset type to "software"
      formData.asset_type = 1;

      if (isAllSoftwareFieldsFilled) {
        // Your software-specific validation logic goes here
        try {
          // If software-specific validation passes, submit the form
          console.log(
            "Attempting to submit software asset form data:",
            formData
          );
          const response = await axiosInstance.post(
            import.meta.env["VITE_ADD_ASSET_URL"],
            formData
          );
          console.log("Form Data Posted:", response.data);

          // Display success message and reload page
          message.success("Form data submitted successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          return; // Exit the function after successful submission
        } catch (error) {
          console.error("Error submitting form data:", error);
          message.error("Failed to submit form data. Please try again later.");
          return; // Exit the function after encountering an error
        }
      } else {
        message.error("Please fill in all mandatory fields.");
      }
    }

    // If it's a hardware asset and all mandatory fields are filled
    if (formData.asset_category === "HARDWARE" && isAllHardwareFieldsFilled) {
      // Your hardware-specific validation logic goes here
      const warrantyPeriodValue = formData.warranty_period.trim();
      if (warrantyPeriodValue !== "" && !/^\d+$/.test(warrantyPeriodValue)) {
        message.error("Warranty period should be a valid integer.");
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
      try {
        // If hardware-specific validation passes, submit the form
        console.log("Attempting to submit hardware asset form data:", formData);
        const response = await axiosInstance.post(
          import.meta.env["VITE_ADD_ASSET_URL"],
          formData
        );
        console.log("Form Data Posted:", response.data);

        // Display success message and reload page
        message.success("Form data submitted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return; // Exit the function after successful submission
      } catch (error) {
        console.error("Error submitting form data:", error);
        message.error("Failed to submit form data. Please try again later.");
        return; // Exit the function after encountering an error
      }
    }

    // If mandatory fields are not filled for either software or hardware
    message.error("Please fill in all mandatory fields.");
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
          <Form.Item
            label={
              <span>
                Category<span className={styles["star"]}>*</span>
              </span>
            }
            className={styles["formItem"]}
          >
            <Select
              className={styles["input"]}
              placeholder="Select asset category"
              onChange={(value) =>
                setFormData({ ...formData, asset_category: value })
              }
            >
              <Option value="HARDWARE">Hardware</Option>
              <Option value="SOFTWARE">Software</Option>
            </Select>
          </Form.Item>

          {formData.asset_category === "SOFTWARE" && (
            <>
              <Form.Item
                label={
                  <span>
                    Asset ID<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                <Input
                  placeholder="Enter Asset ID"
                  className={styles["input"]}
                  onChange={(e) =>
                    handleInputChange("asset_id", e.target.value)
                  }
                  suffix={
                    <Tooltip title="Asset Id should be alphanumeric Eg:ASS101">
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Product Name<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
               
                 <AssetFieldAutoComplete
              assetField="product_name"
              value={value}
              setValue={setValue}
              onChange={(e: { target: { value: any; }; }) =>
                handleInputChange("product_name", e.target.value)
              }
              
            />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Purchase Date<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
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
                    License Type<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                <Select
                  className={styles["input"]}
                  placeholder="Select license type"
                  onChange={(value) => handleInputChange("license_type", value)}
                >
                  <Option value="monthly">Monthly</Option>
                  <Option value="permanent">Permanent</Option>
                </Select>
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
                    Asset Location<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                 <AssetFieldAutoComplete
              assetField="location"
              value={assetLocation}
              setValue={setAssetLocation}
              onChange={(assetLocation: any) => handleInputChange("location", assetLocation)}

              
            />
              </Form.Item>
              <Form.Item label="Business Unit" className={styles["formItem"]}>
              <AssetFieldAutoComplete
              assetField="business_unit"
              value={assetBu}
              setValue={setAssetBu}
              onChange={(assetBu: any) => handleInputChange("business_unit", assetBu["id"])}

            />
              </Form.Item>
              <Form.Item label="Notes:" className={styles["formItem"]}>
                <Input
                  placeholder="Enter reason for creation"
                  className={styles["input"]}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
              </Form.Item>

              {/* Add more software specific fields as needed */}
            </>
          )}

          {formData.asset_category === "HARDWARE" && (
            <>
              {/* Render hardware specific fields */}
              {/* Example: */}
              <Form.Item
                label={
                  <span>
                    Asset ID<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                <Input
                  placeholder="Enter Asset ID"
                  className={styles["input"]}
                  onChange={(e) =>
                    handleInputChange("asset_id", e.target.value)
                  }
                  suffix={
                    <Tooltip title="Asset Id should be alphanumeric Eg:ASS101">
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
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
              >
                 <AssetFieldAutoComplete
              assetField="asset_type"
              value={assettypeValue}
              setValue={setassettypeValue}
              onChange={(assettypeValue: any) => handleInputChange("asset_type", assettypeValue["id"])}

            />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Product Name<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                <Input
                  placeholder="Enter Product name"
                  className={styles["input"]}
                  onChange={(e) =>
                    handleInputChange("product_name", e.target.value)
                  }
                  suffix={
                    <Tooltip title="Product name should not exceed 20 characters">
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Purchase Date<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
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
                    Model Number<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
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
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
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
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Warranty Period<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
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
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Asset Location<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                 <AssetFieldAutoComplete
              assetField="location"
              value={value}
              setValue={setValue}
              onChange={(assetLocation: any) => handleInputChange("location", assetLocation["id"])}

            />
              
              
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Invoice Location<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                 <AssetFieldAutoComplete
              assetField="invoice_location"
              value={assetInLocation}
              setValue={setAssetInLocation}
              onChange={(assetInLocation: any) => handleInputChange("invoice_location", assetInLocation["id"])}

             
            />
              </Form.Item>

              <Form.Item label="Business Unit" className={styles["formItem"]}>
              <AssetFieldAutoComplete
              assetField="business_unit"
              value={assetBu}
              setValue={setAssetBu}
              onChange={(assetBu: any) => handleInputChange("business_unit", assetBu["id"])}

            />
              </Form.Item>
              <Form.Item label="OS:" className={styles["formItem"]}>
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
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />
              </Form.Item>

              <Form.Item label="Mobile OS" className={styles["formItem"]}>
                <Input
                  placeholder="Enter Mobile OS"
                  className={styles["input"]}
                  onChange={(e) =>
                    handleInputChange("mobile_os", e.target.value)
                  }
                />
              </Form.Item>

              <Form.Item label="Processor" className={styles["formItem"]}>
                <Input
                  placeholder="Enter processor"
                  className={styles["input"]}
                  onChange={(e) =>
                    handleInputChange("processor", e.target.value)
                  }
                  suffix={
                    <Tooltip title="Processor should be alphanumeric">
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
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
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
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
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
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

              <Form.Item label="Notes:" className={styles["formItem"]}>
                <Input
                  placeholder="Enter reason for creation"
                  className={styles["input"]}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
              </Form.Item>
              {/* Add more hardware specific fields as needed */}
            </>
          )}

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
