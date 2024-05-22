import React from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  getAssetTypeOptions,
  getLocationOptions,
  getMemoryOptions,
  getBusinessUnitOptions,
  getAssetDetails,
} from "./api/getAssetDetails";
import {
  createAssetType,
  createBusinessUnit,
  createLocation,
  createMemory,
} from "./api/postAssetDetails";
import { getUserOptions } from "./api/getUserDetails";

const filter = createFilterOptions();

const AssetFieldAutoComplete = ({ assetField, value, setValue }) => {
  const [open, toggleOpen] = React.useState(false);

  const [dialogValue, setDialogValue] = React.useState({
    [assetField]: "",
  });

  const foreignFieldValueNames = [
    "asset_type",
    "location",
    "invoice_location",
    "business_unit",
    "memory",
    "user",
  ];

  const handleClose = () => {
    setDialogValue({
      [assetField]: "",
    });
    toggleOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutate(dialogValue);
    handleClose();
  };

  const assetFieldKeyName = () => {
    if (!foreignFieldValueNames.includes(assetField)) {
      return assetField;
    } else {
      if (assetField === "location" || assetField === "invoice_location") {
        return "location_name";
      } else if (assetField === "memory") {
        return "memory_space";
      } else if (assetField === "user") {
        return "username";
      } else {
        return `${assetField}_name`;
      }
    }
  };

  const splitAndCapitalizeWords = (assetFieldName) => {
    return assetFieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  const [isQueryEnabled, setIsQueryEnabled] = React.useState(false);

  const {
    data: assetData,
    isLoading: isAssetDataLoading,
    refetch: assetDataRefetch,
  } = useQuery({
    queryKey: ["assetList", assetField],
    queryFn: () => {
      if (assetField !== "") {
        if (assetField === "asset_type") {
          return getAssetTypeOptions();
        } else if (
          assetField === "location" ||
          assetField === "invoice_location"
        ) {
          return getLocationOptions();
        } else if (assetField === "business_unit") {
          return getBusinessUnitOptions();
        } else if (assetField === "memory") {
          return getMemoryOptions();
        } else if (assetField === "user") {
          return getUserOptions();
        } else {
          return getAssetDetails(
            `?asset_field_value_filter={"${assetField}":""}`
          );
        }
      }
    },
    enabled: isQueryEnabled,
    initialData: [],
  });

  const { mutate } = useMutation({
    mutationFn: (dialogValue) => {
      if (assetField !== "") {
        if (assetField === "asset_type") {
          return createAssetType(dialogValue);
        } else if (
          assetField === "location" ||
          assetField === "invoice_location"
        ) {
          return createLocation(dialogValue);
        } else if (assetField === "business_unit") {
          return createBusinessUnit(dialogValue);
        } else if (assetField === "memory") {
          return createMemory(dialogValue);
        }
      }
    },
    onSuccess: (data) => {
      setValue(data);
    },
  });

  return (
    <React.Fragment>
      {foreignFieldValueNames.includes(assetField) && (
        <React.Fragment>
          <Autocomplete
            value={value}
            loading={isAssetDataLoading}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setTimeout(() => {
                  toggleOpen(true);
                  setDialogValue({
                    [assetFieldKeyName()]: newValue,
                  });
                });
              } else if (newValue && newValue.inputValue) {
                toggleOpen(true);
                setDialogValue({
                  [assetFieldKeyName()]: newValue.inputValue,
                });
              } else {
                if (newValue == null) {
                  setValue("");
                } else {
                  setValue(newValue);
                }
              }
            }}
            onOpen={() => {
              setIsQueryEnabled(true);
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const isExisting = options.some(
                (option) =>
                  params.inputValue.trim() === option[assetFieldKeyName()]
              );
              if (params.inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue: params.inputValue.trim(),
                  [assetFieldKeyName()]: `Add "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            id={`autocomplete-${generateRandomString(5)}`}
            options={assetData}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option[assetFieldKeyName()]?.toString();
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={(props, option) => (
              <li {...props} key={option["id"]}>
                {option[assetFieldKeyName()]}
              </li>
            )}
            sx={{ width: "100%" }}
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
                  id={generateRandomString(7)}
                  value={dialogValue[assetFieldKeyName()]}
                  onChange={(event) =>
                    setDialogValue({
                      [assetFieldKeyName()]: event.target.value,
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
      )}

      {!foreignFieldValueNames.includes(assetField) && (
        <Autocomplete
          value={value}
          loading={isAssetDataLoading}
          freeSolo
          onInputChange={(event, newValue) => {
            if (newValue !== "") {
              setValue({ [assetFieldKeyName()]: newValue });
            }
          }}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setTimeout(() => {
                setValue({ [assetFieldKeyName()]: newValue });
              });
            } else if (newValue && newValue.inputValue) {
              setValue({ [assetFieldKeyName()]: newValue });
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
                params.inputValue.trim() === option[assetFieldKeyName()]
            );
            if (params.inputValue !== "" && !isExisting) {
            }

            return filtered;
          }}
          id={`autocomplete-${generateRandomString(7)}`}
          options={assetData}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option[assetFieldKeyName()]?.toString();
          }}
          selectOnFocus
          disableClearable
          handleHomeEndKeys
          renderOption={(props, option) => (
            <li {...props}>{option[assetFieldKeyName()]}</li>
          )}
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
      )}
    </React.Fragment>
  );
};

export default AssetFieldAutoComplete;
