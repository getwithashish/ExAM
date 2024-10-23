import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { message, Spin, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import { Button, Form } from "antd";
import styles from "./AddAsset.module.css";
import AssetFieldAutoComplete from "../AutocompleteBox/AssetFieldAutoComplete";
import { MenuItem, Select, TextField } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  hardwareSpecificFields,
  softwareSpecificFields,
} from "./constants/constants";

const { Option } = Select;
type SizeType = Parameters<typeof Form>[0]["size"];
interface Props {
  loading?: any;
  setLoading?: any;
  setDisplayDrawer?: any;
}

const AddAsset: React.FC = ({
  loading,
  setLoading,
  setDisplayDrawer,
}: Props) => {
  const [formData, setFormData] = useState<any>({});
  const [_requiredFields, setRequiredFields] = useState<string[]>([]);
  const [_formSubmitted, setFormSubmitted] = useState(false);
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [assetCategoryValue, setAssetCategoryValue] = React.useState("");
  const [value, setValue] = React.useState("");
  const [licenseValue, setLicenseValue] = React.useState("");
  const [ownerValue, setOwnerValue] = React.useState("");
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
  const [accessoryValue, setAccessoryValue] = useState("");
  const [maxLengthWarningShown, setMaxLengthWarningShown] = useState(false);
  const [touched, setTouched] = useState(false);
  const [resetForm, setResetForm] = useState(false);

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
    handleInputChange("memory", memory["id"]);
  }, [memory]);

  useEffect(() => {
    let fieldName = Object.keys(value)[0];
    handleInputChange(fieldName, value[fieldName]);
  }, [value]);

  useEffect(() => {
    let fieldName = Object.keys(os)[0];
    handleInputChange(fieldName, os[fieldName]);
  }, [os]);

  useEffect(() => {
    let fieldName = Object.keys(osVersion)[0];
    handleInputChange(fieldName, osVersion[fieldName]);
  }, [osVersion]);

  useEffect(() => {
    let fieldName = Object.keys(mobileOs)[0];
    handleInputChange(fieldName, mobileOs[fieldName]);
  }, [mobileOs]);

  useEffect(() => {
    let fieldName = Object.keys(processor)[0];
    handleInputChange(fieldName, processor[fieldName]);
  }, [processor]);

  useEffect(() => {
    let fieldName = Object.keys(processorGen)[0];
    handleInputChange(fieldName, processorGen[fieldName]);
  }, [processorGen]);

  useEffect(() => {
    let fieldName = Object.keys(storage)[0];
    handleInputChange(fieldName, storage[fieldName]);
  }, [storage]);

  useEffect(() => {
    let fieldName = Object.keys(licenseValue)[0];
    handleInputChange(fieldName, licenseValue[fieldName]);
  }, [licenseValue]);

  useEffect(() => {
    let fieldName = Object.keys(ownerValue)[0];
    handleInputChange(fieldName, ownerValue[fieldName]);
  }, [ownerValue]);

  useEffect(() => {
    let fieldName = Object.keys(modelNumber)[0];
    handleInputChange(fieldName, modelNumber[fieldName]);
  }, [modelNumber]);

  useEffect(() => {
    let fieldName = "accessories";
    handleInputChange(fieldName, accessoryValue);
  }, [accessoryValue]);

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const handleInputChange = (key: string, value: any) => {
    if (value !== "") {
      setFormData({ ...formData, [key]: value });
    } else {
      var newFormData = { ...formData };
      delete newFormData[key];
      setFormData({ ...newFormData });
    }
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
    if (value === "" || /^[0-9]*$/.test(value)) {
      handleInputChange("warranty_period", value);
    }
  };

  const validateOsVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!warningShown && isNaN(value as any)) {
      message.warning("OS Version should only contain digits");
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
  const handleResetForm = () => {
    setFormData({});
    setResetForm(true);
    setassettypeValue("");
    setValue("");
    setLicenseValue("");
    setOwnerValue("");
    setAssetLocation("");
    setAssetInLocation("");
    setAssetBu("");
    setModelNumber("");
    setOs("");
    setOsVersion("");
    setMobileOs("");
    setProcessor("");
    setProcessorGen("");
    setMemory("");
    setStorage("");
    setTimeout(() => {
      setResetForm(false);
    }, 100);
  };

  const validateStorage = (value: string) => {
    if (!value.trim()) {
      setTouched(false);
      return;
    }
    setTouched(true);
    const formatPattern = /^\d{1,5}\s?(GB|TB)$/i;
    const maxLength = 10;
    const minValueGB = 0;
    const maxValueTB = 20;
    const normalizedValue = value.trim().toUpperCase().replace(/\s/g, "");

    if (normalizedValue.length > maxLength) {
      if (!maxLengthWarningShown) {
        message.warning(
          `Storage length should not exceed ${maxLength} characters.`
        );
        setMaxLengthWarningShown(true);
      }
    } else {
      setMaxLengthWarningShown(false);
    }

    if (!formatPattern.test(normalizedValue)) {
      if (!warningShown && touched) {
        message.warning(
          'Storage should be in the format "###GB" or "###TB", where ### is any one to five digits.'
        );
        setWarningShown(true);
      }
    } else {
      setWarningShown(false);
      const [, numericValue, unit] =
        normalizedValue.match(/^(\d+)\s?(GB|TB)$/i) || [];
      const storageInGB =
        unit.toUpperCase() === "GB"
          ? parseInt(numericValue, 10)
          : parseInt(numericValue, 10) * 1024;
      if (storageInGB < minValueGB) {
        message.warning(`Minimum storage requirement is ${minValueGB} GB.`);
      } else if (
        unit.toUpperCase() === "TB" &&
        storageInGB > maxValueTB * 1024
      ) {
        message.warning(`Maximum storage allowed is ${maxValueTB} TB.`);
      }
    }
  };

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
      // Handle the case where warranty_period is not defined
    }

    // Check if all mandatory fields are filled for software
    const isAllSoftwareFieldsFilled = softwareSpecificFields.every(
      (field) => !!formData[field]
    );

    // Check if all mandatory fields are filled for hardware
    const isAllHardwareFieldsFilled = hardwareSpecificFields.every(
      (field) => !!formData[field]
    );

    if (formData.asset_category === "SOFTWARE") {
      try {
        if (isAllSoftwareFieldsFilled) {
          setLoading(true);
          const submitResponse = await axiosInstance.post(
            import.meta.env["VITE_ADD_ASSET_URL"],
            formData
          );
          message.success(submitResponse.data?.message);
          handleResetForm();
          setAssetCategoryValue("");
          return;
        }
      } catch (error) {
        console.error("Error fetching asset type or asset creation :", error);
        message.error(`Error: ${error.response.data?.message}`);
        return;
      } finally {
        setLoading(false);
        setDisplayDrawer(false);
      }
    }

    if (formData.asset_category === "HARDWARE" && isAllHardwareFieldsFilled) {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          import.meta.env["VITE_ADD_ASSET_URL"],
          formData
        );
        message.success(response.data?.message);
        handleResetForm();
        setAssetCategoryValue("");
        return;
      } catch (error) {
        console.error("Error in asset creation :", error);
        message.error(`Error: ${error.response.data?.message}`);
        return;
      } finally {
        setLoading(false);
        setDisplayDrawer(false);
      }
    }

    message.error("Please fill in all mandatory fields.");
  };

  return (
    <Spin spinning={loading}>
      <div className="font-display">
        <div className={styles["container"]}>
          <h1 className={styles["heading"]}>Create a new Asset</h1>
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
                labelId="asset-category-select-label"
                id="asset-category-select"
                label="Asset Category"
                value={assetCategoryValue}
                sx={{ width: "100%" }}
                displayEmpty
                onChange={(event) => {
                  setAssetCategoryValue(event.target.value as string);
                  handleResetForm();
                  setFormData({
                    asset_category: event.target.value as string,
                  });
                }}
              >
                <MenuItem value={"HARDWARE"}>Hardware</MenuItem>
                <MenuItem value={"SOFTWARE"}>Software</MenuItem>
              </Select>
            </Form.Item>

            {formData.asset_category === "SOFTWARE" && (
              <>
                <Form.Item
                  label={<span>Asset ID</span>}
                  className={styles["formItem"]}
                >
                  <TextField
                    id="outlined-basic"
                    label="Enter Asset ID"
                    variant="outlined"
                    onChange={(e) =>
                      handleInputChange("asset_id", e.target.value)
                    }
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Asset Id should be alphanumeric Eg:ASS101">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      ),
                    }}
                    sx={{ width: "100%" }}
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                      sx={{
                        backgroundColor: 'transparent',
                      }}
                      slotProps={{
                        toolbar: {
                          toolbarFormat: "ddd DD MMMM",
                          hidden: false,
                        },
                        actionBar: {
                          actions: ["today"],
                        },
                      }}
                      onChange={(dateinDateJs) => {
                        var dateString = dateinDateJs?.format("YYYY-MM-DD");
                        handleInputChange("date_of_purchase", dateString);
                      }}
                    />
                  </LocalizationProvider>
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      License Type<span className={styles["star"]}>*</span>
                    </span>
                  }
                  className={styles["formItem"]}
                >
                  <AssetFieldAutoComplete
                    assetField="license_type"
                    value={licenseValue}
                    setValue={setLicenseValue}
                  />
                </Form.Item>

                <Form.Item label="Owner" className={styles["formItem"]}>
                  <AssetFieldAutoComplete
                    assetField="owner"
                    value={ownerValue}
                    setValue={setOwnerValue}
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
                <Form.Item label="Business Unit" className={styles["formItem"]}>
                  <AssetFieldAutoComplete
                    assetField="business_unit"
                    value={assetBu}
                    setValue={setAssetBu}
                  />
                </Form.Item>
                <Form.Item label="Notes:" className={styles["formItem"]}>
                  <TextField
                    id="outlined-textarea-notes-hardware"
                    label="Notes"
                    placeholder="Information related to the Asset"
                    sx={{ width: "100%" }}
                    multiline
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
                  <TextField
                    id="outlined-basic-asset-id-software"
                    label="Enter Asset ID"
                    variant="outlined"
                    onChange={(e) =>
                      handleInputChange("asset_id", e.target.value)
                    }
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Asset Id should be alphanumeric Eg:ASS101">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      ),
                    }}
                    sx={{ width: "100%" }}
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                      sx={{
                        backgroundColor: 'transparent',
                      }}
                      slotProps={{
                        toolbar: {
                          toolbarFormat: "ddd DD MMMM",
                          hidden: false,
                        },
                        actionBar: {
                          actions: ["today"],
                        },
                      }}
                      onChange={(dateinDateJs) => {
                        var dateString = dateinDateJs?.format("YYYY-MM-DD");
                        handleInputChange("date_of_purchase", dateString);
                      }}
                    />
                  </LocalizationProvider>
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
                  <TextField
                    id="outlined-basic-serial-number"
                    label="Enter Serial Number"
                    variant="outlined"
                    onChange={(e) =>
                      handleInputChange("serial_number", e.target.value)
                    }
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Serial Number should be alphanumeric and should not exceed 30 characters Eg:ABC123DEF456">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      ),
                    }}
                    sx={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  label={<span>Warranty Period</span>}
                  className={styles["formItem"]}
                >
                  <TextField
                    id="outlined-number-warranty-period"
                    label="Warranty Period"
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="Warranty period should be in months Eg: 12, 24">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      ),
                    }}
                    sx={{ width: "100%" }}
                    onChange={(e) => {
                      validateWarrantyPeriod(e);
                    }}
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

                <Form.Item label="Owner" className={styles["formItem"]}>
                  <AssetFieldAutoComplete
                    assetField="owner"
                    value={ownerValue}
                    setValue={setOwnerValue}
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

                <Form.Item label="OS Version" className={styles["formItem"]}>
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

                <Form.Item
                  label="Processor Gen:"
                  className={styles["formItem"]}
                >
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

                {/* <Form.Item
                  label="Configuration:"
                  className={styles["formItem"]}
                >
                  <TextField
                    id="outlined-textarea-configuration-hardware"
                    label="Configuration"
                    sx={{ width: "100%" }}
                    multiline
                    onChange={(e) => {
                      handleInputChange("configuration", e.target.value);
                    }}
                  />
                </Form.Item> */}

                <Form.Item label="Accessories:" className={styles["formItem"]}>
                  <TextField
                    id="outlined-textarea-accessories-hardware"
                    label="Accessories"
                    placeholder="Accessories obtained with the hardware"
                    sx={{ width: "100%" }}
                    multiline
                    onChange={(e) => {
                      handleAccessoryChange(e);
                    }}
                  />
                </Form.Item>

                <Form.Item label="Notes:" className={styles["formItem"]}>
                  <TextField
                    id="outlined-textarea-notes-software"
                    label="Notes"
                    placeholder="Information related to the Asset"
                    sx={{ width: "100%" }}
                    multiline
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
                  color: "white",
                }}
                onClick={() => handleSubmit()}
              >
                Submit
              </Button>
              <Button
                className={styles["button"]}
                ghost
                style={{
                  background: "#FF474C",
                  marginTop: "30px",
                  marginLeft: "30px",
                  width: "120px",
                  height: "40px",
                  color: "white"
                }}
                onClick={() => {
                  handleResetForm();
                  setAssetCategoryValue("");
                }}
              >
                Reset
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default AddAsset;
