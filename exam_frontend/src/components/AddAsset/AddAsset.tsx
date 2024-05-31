import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { message, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import { Button, DatePicker, Input, Form, Select } from "antd";
import styles from "./AddAsset.module.css";
import AssetFieldAutoComplete from "../AutocompleteBox/AssetFieldAutoComplete";

const { Option } = Select;
type SizeType = Parameters<typeof Form>[0]["size"];

const AddAsset: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [_requiredFields, setRequiredFields] = useState<string[]>([]);

  const hardwareSpecificFields = [
    "asset_type",
    "serial_number",
    "location",
    "invoice_location",
    "date_of_purchase",
  ];

  const softwareSpecificFields = [
    "product_name",
    "location",
    "date_of_purchase",
  ];

  const setRequiredFieldsByCategory = (category: string) => {
    let requiredFieldsArray: string[] = [
      "asset_category",
      "product_name",
      "serial_number",
      "location",
      "invoice_location",
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

  const [_formSubmitted, setFormSubmitted] = useState(false);
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [value, setValue] = React.useState("");
  const [assettypeValue, setassettypeValue] = React.useState("");
  const [assetLocation, setAssetLocation] = React.useState("");
  const [assetInLocation, setAssetInLocation] = React.useState("");
  const [assetBu, setAssetBu] = React.useState("");
  const [modelNumber, setModelNumber] = React.useState("");
  const [processor, setProcessor] = React.useState("");
  const [processorGen, setProcessorGen] = React.useState("");
  const [memory, setMemory] = React.useState("");
  const [os, setOs] = React.useState("");
  const [osVersion, setOsVersion] = React.useState("");
  const [mobileOs, setMobileOs] = React.useState("");
  const [storage, setStorage] = React.useState("");

  useEffect(() => {
    handleInputChange("asset_type", assettypeValue["id"]);
  }, [assettypeValue]);

  useEffect(() => {
    handleInputChange("location", assetLocation["id"]);
  }, [assetLocation]);

  useEffect(() => {
    handleInputChange("invoice_location", assetInLocation["id"]);
  }, [assetInLocation]);

  useEffect(() => {
    handleInputChange("business_unit", assetBu["id"]);
  }, [assetBu]);

  useEffect(() => {
    let fieldName = Object.keys(value)[0];
    handleInputChange(fieldName, value[fieldName]);
  }, [value]);

  useEffect(() => {
    let fieldName = Object.keys(modelNumber)[0];
    handleInputChange(fieldName, modelNumber[fieldName]);
  }, [modelNumber]);

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
    if (formData.asset_category === "HARDWARE" && !formData.asset_type) {
    }

    // Check if all mandatory fields are filled for software
    const isAllSoftwareFieldsFilled = softwareSpecificFields.every((field) => {
      return !!formData[field];
    });

    // Check if all mandatory fields are filled for hardware
    const isAllHardwareFieldsFilled = hardwareSpecificFields.every(
      (field) => !!formData[field]
    );

    // If it's a software asset and all mandatory fields are filled
    if (formData.asset_category === "SOFTWARE") {
      // Set the asset type to "software"
      formData.asset_type = 9;

      if (isAllSoftwareFieldsFilled) {
        // Your software-specific validation logic goes here
        try {
          // If software-specific validation passes, submit the form
          const response = await axiosInstance.post(
            import.meta.env["VITE_ADD_ASSET_URL"],
            formData
          );
          // Display success message and reload page
          message.success("Asset created successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          return; // Exit the function after successful submission
        } catch (error) {
          console.error("Error in asset creation form data:", error);
          message.error("Failed to create an asset. Please try again later.");
          return; // Exit the function after encountering an error
        }
      } else {
        message.error("Please fill in all mandatory fields.");
      }
    }

    // If it's a hardware asset and all mandatory fields are filled
    if (formData.asset_category === "HARDWARE" && isAllHardwareFieldsFilled) {
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
        const response = await axiosInstance.post(
          import.meta.env["VITE_ADD_ASSET_URL"],
          formData
        );
        // Display success message and reload page
        message.success("Form data submitted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return; // Exit the function after successful submission
      } catch (error) {
        console.error("Error in asset creation :", error);
        message.error("Failed to create an asset. Please try again later.");
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
                label={<span>Asset ID</span>}
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
                    Asset Name<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                <AssetFieldAutoComplete
                  assetField="product_name"
                  value={value}
                  setValue={setValue}
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
                  <Option value="Monthly">Monthly</Option>
                  <Option value="Permanent">Permanent</Option>
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
                />
              </Form.Item>
              <Form.Item label="Business Unit" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="business_unit"
                  value={assetBu}
                  setValue={setAssetBu}
                />
              </Form.Item>
              <Form.Item label="Notes:" className={styles["formItem"]}>
                <Input
                  placeholder="Enter reason for creation"
                  className={styles["input"]}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
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
                label={<span>Asset ID</span>}
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
                />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Asset Name<span className={styles["star"]}>*</span>
                  </span>
                }
                className={styles["formItem"]}
              >
                <AssetFieldAutoComplete
                  assetField="product_name"
                  value={value}
                  setValue={setValue}
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
                label={<span>Model Number</span>}
                className={styles["formItem"]}
              >
                <AssetFieldAutoComplete
                  assetField="model_number"
                  value={modelNumber}
                  setValue={setModelNumber}
                />
              </Form.Item>

              {/* </Form.Item> */}
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
                label={<span>Warranty Period</span>}
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
                  value={assetLocation}
                  setValue={setAssetLocation}
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
                />
              </Form.Item>

              <Form.Item label="Business Unit" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="business_unit"
                  value={assetBu}
                  setValue={setAssetBu}
                />
              </Form.Item>
              <Form.Item label="OS:" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="os"
                  value={os}
                  setValue={setOs}
                />
              </Form.Item>

              <Form.Item label="OS  version" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="os_version"
                  value={osVersion}
                  setValue={setOsVersion}
                />
              </Form.Item>

              <Form.Item label="Mobile OS" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="mobile_os"
                  value={mobileOs}
                  setValue={setMobileOs}
                />
              </Form.Item>

              <Form.Item label="Processor" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="processor"
                  value={processor}
                  setValue={setProcessor}
                />
              </Form.Item>

              <Form.Item label="Processor Gen:" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="processor_gen"
                  value={processorGen}
                  setValue={setProcessorGen}
                />
              </Form.Item>

              <Form.Item label="Memory:" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="memory"
                  value={memory}
                  setValue={setMemory}
                />
              </Form.Item>

              <Form.Item label="Storage:" className={styles["formItem"]}>
                <AssetFieldAutoComplete
                  assetField="storage"
                  value={storage}
                  setValue={setStorage}
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

              <Form.Item label="Notes:" className={styles["formItem"]}>
                <Input
                  placeholder="Enter reason for creation"
                  className={styles["input"]}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
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
