import React, { useState, useEffect } from 'react';
import axiosInstance from "../../config/AxiosConfig"
import { Field } from "react-querybuilder"
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Button, message } from 'antd';

const fields: Field[] = [
  { name: "product_name", label: "Product Name" },
  { name: "asset_type", label: "Asset Type" },
  { name: "model_number", label: "Model Number" },
  { name: "location", label: "Location" },
  { name: "invoice_location", label: "Invoice Location" },
  { name: "business_unit", label: "Business Unit" },
  { name: "os", label: "Operating System" },
  { name: "processor", label: "Processor" },
  { name: "memory", label: "Memory" },
  { name: "storage", label: "Storage" },
]

interface AutocompleteProps {
  selectedFieldIndex: number;
  field: string;
  value: string;
  onFieldChange: (event: React.ChangeEvent<HTMLSelectElement>, index: number) => void;
  onInputChange: (event: React.ChangeEvent<{}>, newValue: string) => void;
  setSelectedFields: React.Dispatch<React.SetStateAction<{ field: string; value: string }[]>>; // Add setSelectedFields prop
}

const CustomAutocomplete: React.FC<AutocompleteProps> = ({ selectedFieldIndex, field, value, onFieldChange, onInputChange, setSelectedFields, setFilterValue }) => { // Add setSelectedFields to props
  const [suggestion, setSuggestion] = useState<string[]>([]);
  

  const fieldEndpointMapping = {
    "location": "/asset/location",
    "invoice_location": "/asset/location",
    "business_unit": "/asset/business_unit",
    "memory": "/asset/memory_list",
    "asset_type": "/asset/asset_type",
    // ... define mappings for other relevant fields with separate endpoints
  };
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (field && value) {
        try {
          const endpoint = fieldEndpointMapping[field];
          let suggestions;
           ;
          
        

          const url = endpoint ? `${endpoint}?query=${value}` : `/asset/?limit=20&asset_field_value_filter={"${field}":"${value}"}`;
   
          const res = await axiosInstance.get(url);
          console.warn(res)
          if (res.data.data.results) {
            const data = res.data.data.results;
            if(data[0].product_name)
            suggestions = data.map(result => result.product_name);
            else if(data[0].os)
            suggestions = data.map(result => result.os);
            else if(data[0].storage)
              suggestions = data.map(result => result.storage);
            else if(data[0].model_number)
                suggestions = data.map(result => result.model_number);
            else if(data[0].processor)
              suggestions = data.map(result => result.processor);
                
           
          } else if(res.data.data){
            const data = res.data.data
            
            if(data[0].asset_type_name)
            suggestions =data?.map((result) => ({ label: result.asset_type_name, id: result.id }))
            else if(data[0].memory_space)
              suggestions =data?.map((result) => ({ label: result.memory_space, id: result.id }))
            else if(data[0].business_unit_name)
              suggestions =data?.map((result) => ({ label: result.business_unit_name, id: result.id }))
            else if(data[0].location_name){
              // suggestions =data?.map(result => result.location_name)
              suggestions = data?.map((result) => ({ label: result.location_name, id: result.id }))
              console.error(suggestions)

            }
              
                  
            console.warn(suggestions)
          
          
        }
   
          setSuggestion(suggestions);
          if (endpoint && suggestions) {
            // Use the id of the respective field as the filter value
            setFilterValue(suggestions.find(item => item.label === value).id);
           
            
        } else {
            // Use the original value as the filter value
            setFilterValue(value);
        }
          message.success('Suggestions fetched successfully');
        } catch (error) {
          console.error("Error fetching asset details:", error);
          message.error('Failed to fetch suggestions');
        }
      }
   };
   
   
    fetchSuggestions();
}, [field, value, axiosInstance]);


  const handleSuggestionClick = (suggestedValue: string | null) => {
    if(suggestedValue)
      {
        setSelectedFields(prev => {
          const updatedFields = [...prev];
          if(suggestedValue.label)
          updatedFields[selectedFieldIndex].value = suggestedValue.label;
          else
          updatedFields[selectedFieldIndex].value = suggestedValue
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
  const initialState = { selectedFields: [], newFields: [] };
  const [filterValue,setFilterValue] = useState<number | string>()

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
    console.log("filter value in query is " ,filterValue)
    // Construct an array of query conditions for each selected field
    const queryConditions = selectedFields.map(field => ({
      "==": [{ "var": field.field },filterValue]
    }));
  
    // Construct the JSON logic expression for the 'and' operation
    const jsonLogic = { "and": queryConditions };
  
    // Convert the JSON logic expression to a string
    const jsonLogicString = JSON.stringify(jsonLogic);
  
    // Construct the query parameters with the JSON logic expression
    const queryParams = `&json_logic=${encodeURIComponent(jsonLogicString)}`;
  
    // Display the constructed query parameters
    message.success(queryParams);
    console.log(queryParams)
  
    // Call the assetDataRefetch function with the constructed query parameters
    assetDataRefetch(queryParams);
  };
  
  const handleReset = () => {
    setSelectedFields([]);
    setNewFields([]);
    assetDataRefetch('')
    message.success('Query builder reset successfully');
  };

  return (
    <div>
       <button onClick={handleReset} className='m-5 p-2 h-50 w-50 text-white'>
        Reset
      </button>
      <button onClick={handleQueryButtonClick} disabled={!selectedFields.length || !selectedFields.every(field => field.field && field.value)} className='m-5 p-2 h-50 w-50 text-white'>Search</button>
      <Button onClick={handleAddField} className='m-5'>+</Button><br></br>
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
                setFilterValue={setFilterValue}
              />
            </div>
            <Button onClick={() => handleRemoveField(index)}>X</Button>
          </div>
        ))}
      </div>
    </div>
  );
};