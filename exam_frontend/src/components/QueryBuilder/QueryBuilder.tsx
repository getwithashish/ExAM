import React, { useState } from "react";
import { message } from "antd";
import MuiAutocomplete from "./MuiAutocomplete";
import type { FieldValues } from "./types/types";
import { Button, IconButton, Stack, createSvgIcon } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { blue, pink } from "@mui/material/colors";

interface QueryBuilderComponentProps {
  assetDataRefetch: (queryParam: string) => void;
  setJson_query: (queryParams: string) => void;
  reset: () => void;
  setVisible: (queryParams: boolean) => void;
  disabledFields?: string[];
}

interface QueryBuilderProps {
  setJson_query: React.Dispatch<React.SetStateAction<string>>;
}

export const QueryBuilderComponent: React.FC<
  QueryBuilderComponentProps & QueryBuilderProps
> = ({
  assetDataRefetch,
  setJson_query,
  reset,
  setVisible,
  disabledFields,
}) => {
  const [selectedFields, setSelectedFields] = useState<
    { field: string; value: string; id: number }[]
  >([]);
  const [newFields, setNewFields] = useState<string[]>([]);
  const initialState = { selectedFields: [], newFields: [] };
  const [filterValue, setFilterValue] = useState<number | string>();
  const [suggestion, setSuggestion] = useState<string[]>([]);

  const handleAddField = () => {
    setNewFields((prev) => [
      ...prev,
      `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ]);
    setSelectedFields((prev) => [...prev, { field: "", value: "" }]);
    setSuggestion([]);
  };

  type InputObject = { [key: string]: any };
  type MergedObject = { [key: string]: any };

  const mergeObjects = (arr: InputObject[]) => {
    const result: MergedObject[] = [];
    const keyMap: { [key: string]: any[] } = {};

    for (const obj of arr) {
      for (const key in obj) {
        if (!keyMap[key]) {
          keyMap[key] = [];
        }
        keyMap[key].push(obj[key]);
      }
    }

    // Convert the keyMap back to an array of objects
    for (const key in keyMap) {
      result.push({ [key]: keyMap[key] });
    }

    return result;
  };

  const handleRemoveField = (currentEle: string, index: number) => {
    const fieldIndex = newFields.indexOf(currentEle);
    const mergedAllFieldValues = mergeObjects(allFieldValues);
    let fieldName = "";
    if (mergedAllFieldValues && mergedAllFieldValues[fieldIndex]) {
      fieldName = Object.keys(mergedAllFieldValues[fieldIndex])[0];
    } else {
      console.error("Empty Field in Advanced Search");
    }

    setNewFields((prev) => prev.filter((ele) => ele !== currentEle));
    setSelectedFields((prev) => prev.filter((_, i) => i !== index));
    setAllFieldValues((prev) =>
      prev.filter((fieldValue, _) => Object.keys(fieldValue)[0] !== fieldName)
    );
  };

  const [allFieldValues, setAllFieldValues] = React.useState<
    (string | FieldValues)[]
  >([]);

  const handleReset = () => {
    setSelectedFields([]);
    setNewFields([]);
    reset();
    setAllFieldValues([]);
    // assetDataRefetch("");
    message.success("Query builder reset successfully");
  };

  const handleSubmitFieldValues = (fieldValues) => {
    if (fieldValues.length !== 0) {
      const uniqueKeys = Array.from(new Set(fieldValues.flatMap(Object.keys)));
      const valuesByKey = uniqueKeys.reduce((acc, key) => {
        acc[key] = fieldValues
          .map((item) => item[key]) // Extract values for this key
          .filter((value) => value !== undefined); // Remove undefined values
        return acc;
      }, {});

      let andQueryConditions = [];
      for (const key in valuesByKey) {
        const queryConditions = valuesByKey[key].map((field) => ({
          "==": [{ var: key }, field],
        }));
        const orQueryCondition = { or: queryConditions };
        andQueryConditions = andQueryConditions.concat(orQueryCondition);
      }

      const jsonLogic = { and: andQueryConditions };

      const jsonLogicString = JSON.stringify(jsonLogic);
      const queryParams = `&json_logic=${encodeURIComponent(jsonLogicString)}`;
      setJson_query(queryParams);
      assetDataRefetch(queryParams);
      message.success("Advanced Search Successful");
      setVisible(false);
    } else {
      message.error("Search Parameters cannot be empty");
    }
  };

  const PlusIcon = createSvgIcon(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>,
    "Plus"
  );

  return (
    <div>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {newFields.map((currentEle, index) => (
            <div
              key={currentEle}
              style={{
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MuiAutocomplete
                key={currentEle}
                allFieldValues={allFieldValues}
                setAllFieldValues={setAllFieldValues}
                disabledFields={disabledFields}
              />
              <IconButton
                onClick={() => handleRemoveField(currentEle, index)}
                aria-label="remove"
                size="large"
              >
                <Delete sx={{ color: pink[500] }} />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      <div className="w-fit">
        <Stack>
          <div className="text-center mb-5">
            <IconButton onClick={handleAddField} aria-label="add" size="large">
              <PlusIcon sx={{ color: blue[500] }} />
            </IconButton>
          </div>
          <div>
            <Button
              sx={{ paddingX: 5, marginX: 5 }}
              onClick={handleReset}
              variant="outlined"
              color="error"
            >
              Reset
            </Button>
            <Button
              sx={{ paddingX: 5, marginX: 5 }}
              onClick={() => {
                handleSubmitFieldValues(allFieldValues);
              }}
              variant="outlined"
              color="success"
            >
              Search
            </Button>
          </div>
        </Stack>
      </div>
      <br />
    </div>
  );
};
