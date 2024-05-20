import React, { useState } from "react";
import type { Field } from "react-querybuilder";
import { Button, message } from "antd";
import MuiAutocomplete from "./MuiAutocomplete";
import type { FieldValues } from "./types/types";

interface QueryBuilderComponentProps {
  assetDataRefetch: (queryParam: string) => void;
  setJson_query: (queryParams: string) => void;
}

interface QueryBuilderProps {
  setJson_query: React.Dispatch<React.SetStateAction<string>>;
}

export const QueryBuilderComponent: React.FC<QueryBuilderComponentProps & QueryBuilderProps> = ({
  assetDataRefetch,
  setJson_query,

}) => {
  const [selectedFields, setSelectedFields] = useState<
    { field: string; value: string; id: number }[]
  >([]);
  const [newFields, setNewFields] = useState<number[]>([]);
  const initialState = { selectedFields: [], newFields: [] };
  const [filterValue, setFilterValue] = useState<number | string>();
  const [suggestion, setSuggestion] = useState<string[]>([]);

  const handleAddField = () => {
    setNewFields((prev) => [...prev, prev.length]);
    setSelectedFields((prev) => [...prev, { field: "", value: "" }]);
    setSuggestion([]);
  };

  const handleRemoveField = (index: number) => {
    setNewFields((prev) => prev.filter((_, i) => i !== index));
    setSelectedFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setSelectedFields([]);
    setNewFields([]);
    assetDataRefetch("");
    message.success("Query builder reset successfully");
  };

  const [allFieldValues, setAllFieldValues] = React.useState<
    (string | FieldValues)[]
  >([]);

  const handleSubmitFieldValues = (fieldValues) => {
    console.log("Final Values: ", fieldValues);
    const uniqueKeys = Array.from(new Set(fieldValues.flatMap(Object.keys)));
    const valuesByKey = uniqueKeys.reduce((acc, key) => {
      acc[key] = fieldValues
        .map((item) => item[key]) // Extract values for this key
        .filter((value) => value !== undefined); // Remove undefined values
      return acc;
    }, {});

    console.log("Final Values as array: ", valuesByKey);

    let andQueryConditions = [];
    for (const key in valuesByKey) {
      const queryConditions = valuesByKey[key].map((field) => ({
        "==": [{ var: key }, field],
      }));
      const orQueryCondition = { or: queryConditions };
      andQueryConditions = andQueryConditions.concat(orQueryCondition);
      console.log("Query Conditions: ", orQueryCondition);
    }

    const jsonLogic = { and: andQueryConditions };
    console.log("Final Json Logic: ", jsonLogic);

    const jsonLogicString = JSON.stringify(jsonLogic);
    const queryParams = `&json_logic=${encodeURIComponent(jsonLogicString)}`;
    message.success(queryParams);
    console.log(queryParams);
    setJson_query(queryParams);
    assetDataRefetch(queryParams);
  };

  return (
    <div>
      <button onClick={handleReset} className="h-50 w-50 m-5 p-2 text-white">
        Reset
      </button>
      <button
        onClick={() => {
          handleSubmitFieldValues(allFieldValues);
        }}
        className="h-50 w-50 m-5 p-2 text-white"
      >
        Search
      </button>
      <Button onClick={handleAddField} className="m-5">
        +
      </Button>
      <br />
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {newFields.map((_, index) => (

            <div
              key={index}
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <MuiAutocomplete
                key={index}
                allFieldValues={allFieldValues}
                setAllFieldValues={setAllFieldValues}
              />
              <Button onClick={() => handleRemoveField(index)}>X</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
