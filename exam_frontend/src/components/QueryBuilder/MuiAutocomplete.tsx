import React from "react";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getAssetDetails } from "./api/getAssetDetails";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const filter = createFilterOptions();

const MuiAutocomplete = ({ allFieldValues, setAllFieldValues }) => {
  const fieldNames = [
    { label: "Product Name", value: "product_name" },
    { label: "Model Number", value: "model_number" },
    { label: "Owner", value: "owner" },
    { label: "Warranty Period", value: "warranty_period" },
    { label: "Version", value: "version" },
    { label: "Operating System", value: "os" },
    { label: "Operating System Version", value: "os_version" },
    { label: "Mobile OS", value: "mobile_os" },
    { label: "Processor", value: "processor" },
    { label: "Processor Generation", value: "processor_gen" },
    { label: "Storage", value: "storage" },
    { label: "Configuration", value: "configuration" },
  ];

  const [value, setValue] = React.useState([]);
  const [open, toggleOpen] = React.useState(false);

  const [fieldName, setFieldName] = React.useState("");
  const [fieldValue, setFieldValue] = React.useState("");

  const handleClose = () => {
    setDialogValue({
      title: "",
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    title: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue({
      title: dialogValue.title,
      year: parseInt(dialogValue.year, 10),
    });
    handleClose();
  };

  const [isQueryEnabled, setIsQueryEnabled] = React.useState(false);

  const {
    data: assetData,
    isLoading: isAssetDataLoading,
    refetch: assetDataRefetch,
  } = useQuery({
    queryKey: ["assetList", fieldName],
    queryFn: () =>
      getAssetDetails(`?asset_field_value_filter={"${fieldName}":""}`),
    enabled: isQueryEnabled,
    initialData: [],
  });

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
            let newFieldValues = allFieldValues.filter(
              (item) => !item.hasOwnProperty(fieldName)
            );
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

      {fieldName !== "" && (
        <Autocomplete
          multiple
          value={value}
          loading={isAssetDataLoading}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              // timeout to avoid instant validation of the dialog's form.
              setTimeout(() => {
                toggleOpen(true);
                setDialogValue({
                  title: newValue,
                });
              });
            } else if (newValue && newValue.inputValue) {
              toggleOpen(true);
              setDialogValue({
                title: newValue.inputValue,
              });
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

            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                fieldName: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          id="free-solo-dialog-demo"
          // options={top100Films}
          // onOpen={() => {
          //   setOptions(
          //     getAssetDetails(
          //       `&asset_field_value_filter={${fieldName}:${fieldValue}}`
          //     )
          //   );
          // }}
          options={assetData}
          getOptionLabel={(option) => {
            // for example value selected with enter, right from the input
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
      <Button
        onClick={() => {
          console.log(
            "Autocomplete Values: ",
            value,
            " ---- Field Name: ",
            fieldName
          );
        }}
      >
        Click ME
      </Button>
    </div>
  );
};

export default MuiAutocomplete;
