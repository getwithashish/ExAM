import React from "react";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  getAssetDetails,
  getAssetTypeOptions,
  getLocationOptions,
  getMemoryOptions,
  getBusinessUnitOptions,
} from "./api/getAssetDetails";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { getUserOptions } from "./api/getUserDetails";

const filter = createFilterOptions();

const MuiAutocomplete = ({ allFieldValues, setAllFieldValues }) => {
  const fieldNames = [
    { label: "Product Name", value: "product_name" },
    { label: "Model Number", value: "model_number" },
    {
      label: "Asset Type",
      value: "asset_type_name",
      queryFieldName: "asset_type",
    },
    { label: "Warranty Period", value: "warranty_period" },
    { label: "Version", value: "version" },
    { label: "Operating System", value: "os" },
    { label: "Operating System Version", value: "os_version" },
    { label: "Mobile OS", value: "mobile_os" },
    { label: "Processor", value: "processor" },
    { label: "Processor Generation", value: "processor_gen" },
    { label: "Memory", value: "memory_space", queryFieldName: "memory" },
    { label: "Storage", value: "storage" },
    { label: "Configuration", value: "configuration" },
    { label: "Owner", value: "owner" },
    { label: "Location", value: "location_name", queryFieldName: "location" },
    {
      label: "Invoice Location",
      value: "invoice_location",
      queryFieldName: "invoice_location",
    },
    {
      label: "Business Unit",
      value: "business_unit_name",
      queryFieldName: "business_unit",
    },
    {
      label: "Requester",
      value: "requester",
      queryFieldName: "requester",
    },
    {
      label: "Approved By",
      value: "approved_by",
      queryFieldName: "approved_by",
    },
  ];

  const foreignFieldValueNames = [
    "asset_type_name",
    "location_name",
    "invoice_location",
    "business_unit_name",
    "memory_space",
    "requester",
    "approved_by",
  ];

  const [value, setValue] = React.useState([]);
  const [open, toggleOpen] = React.useState(false);

  const [fieldName, setFieldName] = React.useState("");

  const [isQueryEnabled, setIsQueryEnabled] = React.useState(false);

  const {
    data: assetData,
    isLoading: isAssetDataLoading,
    refetch: assetDataRefetch,
  } = useQuery({
    queryKey: ["assetList", fieldName],
    queryFn: () => {
      if (fieldName !== "") {
        if (fieldName == "asset_type_name") {
          return getAssetTypeOptions();
        } else if (
          fieldName == "location_name" ||
          fieldName == "invoice_location"
        ) {
          return getLocationOptions();
        } else if (fieldName == "business_unit_name") {
          return getBusinessUnitOptions();
        } else if (fieldName == "memory_space") {
          return getMemoryOptions();
        } else if (fieldName == "requester" || fieldName == "approved_by") {
          return getUserOptions();
        } else {
          return getAssetDetails(
            `?asset_field_value_filter={"${fieldName}":""}`
          );
        }
      }
    },
    enabled: isQueryEnabled,
    initialData: [],
  });

  const getFieldName = () => {
    if (fieldName == "location_name" || fieldName == "invoice_location") {
      return "location_name";
    } else if (fieldName == "requester" || fieldName == "approved_by") {
      return "username";
    } else {
      return fieldName;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Field Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={fieldName}
          label="Select Field Name"
          sx={{ minWidth: 300 }}
          onChange={(event) => {
            setFieldName(event.target.value as string);
            let newFieldValues = [];
            if (!foreignFieldValueNames.includes(fieldName)) {
              newFieldValues = allFieldValues.filter(
                (item) => !item.hasOwnProperty(fieldName)
              );
            } else {
              const itemElement = fieldNames.find(
                (item) => item["value"] == fieldName
              );
              newFieldValues = allFieldValues.filter(
                (item) => !item.hasOwnProperty(itemElement["queryFieldName"])
              );
            }

            setAllFieldValues(newFieldValues);
            setValue([]);
          }}
        >
          {fieldNames.map((field, index) => (
            <MenuItem key={index} value={field.value}>
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {fieldName !== "" && !foreignFieldValueNames.includes(fieldName) && (
        <Autocomplete
          multiple
          value={value}
          loading={isAssetDataLoading}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
            } else if (newValue && newValue.inputValue) {
            } else {
              let newFieldValues = allFieldValues.filter(
                (item) => !item.hasOwnProperty(fieldName)
              );
              setAllFieldValues([...newFieldValues, ...newValue]);
              setValue(newValue);
            }
          }}
          onOpen={() => {
            setIsQueryEnabled(true);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const isExisting = options.some(
              (option) => params.inputValue.trim() === option[fieldName]
            );
            if (params.inputValue !== "" && !isExisting) {
            }

            return filtered;
          }}
          id="free-solo-dialog-demo"
          options={assetData}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option[fieldName];
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => (
            <li {...props}>{option[fieldName]}</li>
          )}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
      )}

      {fieldName !== "" && foreignFieldValueNames.includes(fieldName) && (
        <Autocomplete
          multiple
          value={value}
          loading={isAssetDataLoading}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
            } else if (newValue && newValue.inputValue) {
            } else {
              const itemElement = fieldNames.find(
                (item) => item["value"] == fieldName
              );
              let newFieldValues = allFieldValues.filter(
                (item) => !item.hasOwnProperty(itemElement["queryFieldName"])
              );
              setAllFieldValues([
                ...newFieldValues,
                ...newValue.map((obj) => ({
                  [itemElement.queryFieldName]: obj["id"],
                })),
              ]);
              setValue(newValue);
            }
          }}
          onOpen={() => {
            setIsQueryEnabled(true);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const isExisting = options.some(
              (option) => params.inputValue.trim() === option[getFieldName()]
            );
            if (params.inputValue !== "" && !isExisting) {
            }

            return filtered;
          }}
          id="advanced-query-autcomplete-foreign-fields"
          options={assetData}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option[getFieldName()].toString();
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderOption={(props, option) => (
            <li {...props} key={option["id"]}>
              {option[getFieldName()]}
            </li>
          )}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
      )}
    </div>
  );
};

export default MuiAutocomplete;
