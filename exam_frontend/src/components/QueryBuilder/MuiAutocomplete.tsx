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
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { getEmployeeOptions, getUserOptions } from "./api/getUserDetails";
import type {
  MuiAutocompleteProps,
  FieldValues,
  ItemElementTypeWithString,
  ItemElementTypeWithUndefined,
} from "./types/types";

const filter = createFilterOptions();

const MuiAutocomplete = ({
  allFieldValues,
  setAllFieldValues,
}: MuiAutocompleteProps) => {
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
    { label: "Status", value: "status" },
    { label: "Asset Approval Status", value: "asset_detail_status" },
    { label: "Asset Assignment Status", value: "assign_status" },
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
      label: "Custodian",
      value: "custodian",
      queryFieldName: "custodian",
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
    "custodian",
    "requester",
    "approved_by",
  ];

  const DropDownFieldValue = {
    status: ["IN STOCK", "IN USE", "IN REPAIR", "DISPOSED"],
    asset_detail_status: ["CREATED", "UPDATED", "PENDING", "REJECTED"],
    assign_status: ["ASSIGNED", "UNASSIGNED", "PENDING", "REJECTED"],
  };
  const DropDownFieldValueNames = Object.keys(DropDownFieldValue);

  const [value, setValue] = React.useState<(FieldValues | string)[]>([]);

  const [fieldName, setFieldName] = React.useState("");

  const [isQueryEnabled, setIsQueryEnabled] = React.useState(false);

  const { data: assetData, isLoading: isAssetDataLoading } = useQuery({
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
        } else if (fieldName == "custodian") {
          return getEmployeeOptions();
        } else {
          return getAssetDetails(
            `?asset_field_value_filter={"${fieldName}":""}`
          );
        }
      }
      return "";
    },
    enabled: isQueryEnabled,
    initialData: [],
  });

  const getFieldName = () => {
    if (fieldName == "location_name" || fieldName == "invoice_location") {
      return "location_name";
    } else if (fieldName == "requester" || fieldName == "approved_by") {
      return "username";
    } else if (fieldName == "custodian") {
      return "employee_name";
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
                (item: FieldValues) =>
                  !Object.prototype.hasOwnProperty.call(item, fieldName)
              );
            } else {
              const itemElement = fieldNames.find(
                (item) => item.value == fieldName
              );
              newFieldValues = allFieldValues.filter(
                (item) =>
                  !Object.prototype.hasOwnProperty.call(
                    item,
                    itemElement?.queryFieldName!
                  )
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

      {fieldName !== "" &&
        !foreignFieldValueNames.includes(fieldName) &&
        !DropDownFieldValueNames.includes(fieldName) && (
          <Autocomplete
            multiple
            value={value}
            loading={isAssetDataLoading}
            onChange={(_event, newValue) => {
              if (typeof newValue === "string") {
                return;
              } else {
                const newFieldValues = allFieldValues.filter(
                  (item) =>
                    !Object.prototype.hasOwnProperty.call(item, fieldName)
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
              return option[fieldName] as string;
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

      {fieldName !== "" &&
        foreignFieldValueNames.includes(fieldName) &&
        !DropDownFieldValueNames.includes(fieldName) && (
          <Autocomplete
            multiple
            value={value}
            loading={isAssetDataLoading}
            onChange={(_event, newValue) => {
              if (typeof newValue === "string") {
                return;
              } else {
                const itemElement:
                  | ItemElementTypeWithString
                  | ItemElementTypeWithUndefined
                  | undefined = fieldNames.find(
                  (item) => item.value == fieldName
                );
                const newFieldValues = allFieldValues.filter(
                  (item) =>
                    !Object.prototype.hasOwnProperty.call(
                      item,
                      itemElement?.queryFieldName!
                    )
                );
                setAllFieldValues([
                  ...newFieldValues,
                  ...newValue.map<FieldValues>((obj) => ({
                    [itemElement.queryFieldName]: obj.id,
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
              <li {...props} key={option.id}>
                {option[getFieldName()]}
              </li>
            )}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Search" />}
          />
        )}

      {fieldName !== "" &&
        !foreignFieldValueNames.includes(fieldName) &&
        DropDownFieldValueNames.includes(fieldName) && (
          <FormControl>
            <InputLabel id="simple-status-select">Select Status</InputLabel>
            <Select
              labelId="simple-status-select"
              id="demo-simple-select"
              multiple
              value={value}
              label="Select Status"
              sx={{ minWidth: 300 }}
              onChange={(event) => {
                const newValue = event.target.value;
                const newFieldValues = allFieldValues.filter(
                  (item) =>
                    !Object.prototype.hasOwnProperty.call(item, fieldName)
                );
                setAllFieldValues([
                  ...newFieldValues,
                  // Using flatMap() here is very important, since we are returning an array for "PENDING" and "REJECTED"
                  ...newValue.flatMap((obj: string) => {
                    if (fieldName == "status") {
                      return {
                        [fieldName]: obj == "IN STOCK" ? "IN STORE" : obj,
                      };
                    } else if (fieldName == "asset_detail_status") {
                      if (obj == "PENDING") {
                        return [
                          { [fieldName]: "CREATE_PENDING" },
                          { [fieldName]: "UPDATE_PENDING" },
                        ];
                      } else if (obj == "REJECTED") {
                        return [
                          { [fieldName]: "CREATE_REJECTED" },
                          { [fieldName]: "UPDATE_REJECTED" },
                        ];
                      }
                      return { [fieldName]: obj };
                    } else if (fieldName == "assign_status") {
                      if (obj == "PENDING") {
                        return [{ [fieldName]: "ASSIGN_PENDING" }];
                      }
                      return { [fieldName]: obj };
                    } else {
                      return;
                    }
                  }),
                ]);
                setValue(newValue);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {DropDownFieldValue[fieldName].map(
                (field: string, index: number) => (
                  <MenuItem key={index} value={field}>
                    {field}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        )}
    </div>
  );
};

export default MuiAutocomplete;
