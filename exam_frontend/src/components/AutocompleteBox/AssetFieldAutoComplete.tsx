import React from "react";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import {
  getAssetTypeOptions,
  getLocationOptions,
  getMemoryOptions,
  getBusinessUnitOptions,
} from "./api/getAssetDetails";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";


const filter = createFilterOptions();

const AssetFieldAutoComplete = ({ assetField }) => {
  const [value, setValue] = React.useState("");
  const [open, toggleOpen] = React.useState(false);

  // const [fieldName, setFieldName] = React.useState("");

  const [dialogValue, setDialogValue] = React.useState({
    [assetField]: "",
  });

  const handleClose = () => {
    setDialogValue({
      [assetField]: "",
    });
    toggleOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue({
      title: dialogValue.title,
    });
    handleClose();
  };

  const splitAndCapitalizeWords = (assetFieldName) => {
    return assetFieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [isQueryEnabled, setIsQueryEnabled] = React.useState(false);

  const {
    data: assetData,
    isLoading: isAssetDataLoading,
    refetch: assetDataRefetch,
  } = useQuery({
    queryKey: ["assetList"],
    queryFn: () => {
      if (assetField !== "") {
        if (assetField == "asset_type") {
          return getAssetTypeOptions();
        } else if (
          assetField == "location" ||
          assetField == "invoice_location"
        ) {
          return getLocationOptions();
        } else if (assetField == "business_unit") {
          return getBusinessUnitOptions();
        } else if (assetField == "memory") {
          return getMemoryOptions();
        }
      }
    },
    enabled: isQueryEnabled,
    initialData: [],
  });

  const { mutate } = useMutation(postMessage, {
    onSuccess: (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: inputMessage },
        { role: "bot", content: data.data },
      ]);
      setInputMessage("");
    },
  });

  return (
    <React.Fragment>
      <Autocomplete
        value={value}
        loading={isAssetDataLoading}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
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
            setValue(newValue);
          }
        }}
        onOpen={() => {
          setIsQueryEnabled(true);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const isExisting = options.some(
            (option) =>
              params.inputValue.trim() ===
              option[
                assetField == "location" || assetField == "invoice_location"
                  ? "location_name"
                  : assetField == "memory"
                  ? "memory_space"
                  : `${assetField}_name`
              ]
          );
          if (params.inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue: params.inputValue.trim(),
              [assetField == "location" || assetField == "invoice_location"
                ? "location_name"
                : assetField == "memory"
                ? "memory_space"
                : `${assetField}_name`]: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        id={`autocomplete-${assetField}`}
        options={assetData}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option[
            assetField == "location" || assetField == "invoice_location"
              ? "location_name"
              : assetField == "memory"
              ? "memory_space"
              : `${assetField}_name`
          ].toString();
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => (
          <li {...props} key={option["id"]}>
            {
              option[
                assetField == "location" || assetField == "invoice_location"
                  ? "location_name"
                  : assetField == "memory"
                  ? "memory_space"
                  : `${assetField}_name`
              ]
            }
          </li>
        )}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            Add a new {splitAndCapitalizeWords(assetField)}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              If the {splitAndCapitalizeWords(assetField)} you want does not
              exist, Please add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.title}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  [assetField == "location" || assetField == "invoice_location"
                    ? "location_name"
                    : assetField == "memory"
                    ? "memory_space"
                    : `${assetField}_name`]: event.target.value,
                })
              }
              label={splitAndCapitalizeWords(assetField)}
              type="text"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default AssetFieldAutoComplete;
