import React, { useState, useEffect } from 'react';
import axiosInstance from "../../config/AxiosConfig"
import { Field } from "react-querybuilder"
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Button, message } from 'antd';

const fields: Field[] = [
  { name: "product_name", label: "Product Name" },
  { name: "asset_type", label: "Asset Type" },
  { name: "version", label: "Version" },
  { name: "model_number", label: "Model Number" },
  { name: "status", label: "Status" },
  { name: "location", label: "Location" },
  { name: "invoice_location", label: "Invoice Location" },
  { name: "business_unit", label: "Business Unit" },
  { name: "os", label: "Operating System" },
  { name: "processor", label: "Processor" },
  { name: "memory", label: "Memory" },
  { name: "storage", label: "Storage" },
  { name: "asset_detail_status", label: "Asset Detail Status" },
  { name: "assign_status", label: "Assign Status" },
];

interface AutocompleteProps {
  selectedFieldIndex: number;
  field: string;
  value: string;
  onFieldChange: (event: React.ChangeEvent<HTMLSelectElement>, index: number) => void;
  onInputChange: (event: React.ChangeEvent<{}>, newValue: string) => void;
  setSelectedFields: React.Dispatch<React.SetStateAction<{ field: string; value: string }[]>>; // Add setSelectedFields prop
}

const CustomAutocomplete: React.FC<AutocompleteProps> = ({ selectedFieldIndex, field, value, onFieldChange, onInputChange, setSelectedFields }) => { // Add setSelectedFields to props
  const [suggestion, setSuggestion] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (field && value) {
        try {
          const res = await axiosInstance.get(`/asset/?limit=20&asset_field_value_filter={"${field}":"${value}"}`);
          const productNames = res.data.data.results.map(result => result.product_name);
          setSuggestion([...productNames]);
          message.success('Suggestions fetched successfully');
        } catch (error) {
          console.error("Error fetching asset details:", error);
          message.error('Failed to fetch suggestions');
        }
      }
    };

    fetchSuggestions();
  }, [field, value]);

  const handleSuggestionClick = (suggestedValue: string | null) => {
    if(suggestedValue)
      {
        setSelectedFields(prev => {
          const updatedFields = [...prev];
          updatedFields[selectedFieldIndex].value = suggestedValue;
          return updatedFields;
        });

      }
   
    setSuggestion([]); // Clear the suggestion array
  };

  return (
    <Autocomplete
      disablePortal
      freeSolo
      autoSelect
      value={value}
      inputValue={value}
      onInputChange={onInputChange}
      options={suggestion}
      renderInput={params => (
        <TextField
          {...params}
          margin='normal'
        />
      )}
      onChange={(event, newValue) => handleSuggestionClick(newValue)}
    />
  );
};

interface QueryBuilderComponentProps {
  assetDataRefetch: (queryParam: string) => void
}

export const QueryBuilderComponent: React.FC<QueryBuilderComponentProps> = ({ assetDataRefetch }) => {
  const [selectedFields, setSelectedFields] = useState<{ field: string; value: string }[]>([]);
  const [newFields, setNewFields] = useState<number[]>([]);

  const handleInputChange = (event: React.ChangeEvent<{}>, newValue: string | null, index: number) => {
    if (newValue !== null) {
       setSelectedFields(prev => {
         const updatedFields = [...prev];
         updatedFields[index].value = newValue; // Directly assign newValue if it's not null
         return updatedFields;
       });
    } else {
       // Handle the case where newValue is null (e.g., when the Autocomplete box is cleared)
       // You might want to clear the value for the specific field or handle it differently
       setSelectedFields(prev => {
         const updatedFields = [...prev];
         updatedFields[index].value = ''; // Clear the value for the specific field
         return updatedFields;
       });
    }
   };
  
  
  
  

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { value } = event.target;
    setSelectedFields(prev => {
      const updatedFields = [...prev];
      updatedFields[index].field = value;
      return updatedFields;
    });
  };

  const handleAddField = () => {
    setNewFields(prev => [...prev, prev.length]);
    setSelectedFields(prev => [...prev, { field: '', value: '' }]);
  };

  const handleRemoveField = (index: number) => {
    setNewFields(prev => prev.filter((_, i) => i !== index));
    setSelectedFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleQueryButtonClick = () => {
    if (selectedFields.some(field => !field.field || !field.value)) {
      message.error("Please select appropriate fields and values for all conditions.");
      return;
    }

    const queryConditions = selectedFields.map(field => ({
      "==": [{ "var": field.field }, field.value]
    }));
    const queryParams = `&{ "and" : {[${queryConditions}]}`
    message.success(queryParams);
    assetDataRefetch(queryParams);
  };

  return (
    <div>
      <button onClick={handleQueryButtonClick} disabled={!selectedFields.length || !selectedFields.every(field => field.field && field.value)} className='m-2 p-2 h-50 w-50 text-white'>Search</button>
      <Button onClick={handleAddField}>+</Button><br></br>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {newFields.map((_, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <select onChange={e => handleFieldChange(e, index)} value={selectedFields[index]?.field} style={{ padding: '14.5px 10px' , marginTop : '7px' }}>
              <option value="">Select a field</option>
              {fields.map(field => (
                <option key={field.name} value={field.name}>{field.label}</option>
              ))}
            </select>
            <div style={{ width: '200px', marginLeft: '10px' }}>
              <CustomAutocomplete
                selectedFieldIndex={index}
                field={selectedFields[index]?.field}
                value={selectedFields[index]?.value}
                onFieldChange={(event, index) => handleFieldChange(event, index)}
                onInputChange={(event, newValue) => {if(newValue !== null) {handleInputChange(event, newValue, index)}} }
                setSelectedFields={setSelectedFields} // Pass setSelectedFields prop
              />
            </div>
            <Button onClick={() => handleRemoveField(index)}>X</Button>
          </div>
        ))}
      </div>
    </div>
  );
};