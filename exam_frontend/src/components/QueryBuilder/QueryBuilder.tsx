import React, { useState, useEffect } from 'react';
import axiosInstance from "../../config/AxiosConfig"
import { Field } from "react-querybuilder"
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

interface QueryBuilderComponentProps {
  assetDataRefetch: (queryParam: string) => void
}

export const QueryBuilderComponent: React.FC<QueryBuilderComponentProps> = ({ assetDataRefetch }) => {
  const [selectedFields, setSelectedFields] = useState<{ field: string; value: string }[]>([]);
  const [newFields, setNewFields] = useState<number[]>([]);
  const [suggestion,setSuggestion] = useState<string []>([])
  const [isClicked, setIsClicked] = useState<boolean>(false)

  useEffect(() => {
    const fetchSuggestions = async (index: number) => {
      const { field, value } = selectedFields[index];
      const suggestion_param=`&asset_field_value_filter={"${field}": "${value}"}`
      if (field && value) {
        try {
          const res = await axiosInstance.get(`/asset/?limit=20${suggestion_param}`);
          console.log("Returned Data: ", res.data.data.results);
          
          // Extract product names from the returned data and add them to suggestions array
        const productNames = res.data.data.results.map(result => result.product_name);
        setSuggestion([...productNames]);
        message.success(suggestion)
     
        } catch (error) {
          console.error("Error fetching asset details:", error);
         
        }
      }
    };

    selectedFields.forEach((_, index) => fetchSuggestions(index));
  }, [selectedFields]);

  const handleQueryButtonClick = () => {
    if (selectedFields.some(field => !field.field || !field.value)) {
      message.error("Please select appropriate fields and values for all conditions.");
      return;
    }

    const queryParams = selectedFields.map(field => `&selected_field=${field.field}&input_value=${field.value}`).join("");
    message.success(queryParams);
    assetDataRefetch(queryParams);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    setSelectedFields(prev => {
      const updatedFields = [...prev];
      updatedFields[index].value = value;
      return updatedFields;
    });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
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
    setIsClicked(false)
    setSuggestion([])
  };

  const handleRemoveField = (index: number) => {
    setNewFields(prev => prev.filter((_, i) => i !== index));
    setSelectedFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestedValue: string, index: number) => {
    setSelectedFields(prev => {
      const updatedFields = [...prev];
      updatedFields[index].value = suggestedValue;
      return updatedFields;
    });
    setSuggestion([]); // Clear the suggestion array
    setIsClicked(true)
  };
  return (
    <div>
      <button onClick={handleQueryButtonClick} disabled={!selectedFields.length || !selectedFields.every(field => field.field && field.value)} className='m-2 p-2 h-50 w-50 text-white'>Search</button>
      <Button onClick={handleAddField}>+</Button><br></br>
      {newFields.map((_, index) => (
        <div key={index}>
          <select onChange={e => handleSelectChange(e, index)} value={selectedFields[index]?.field}>
            <option value="">Select a field</option>
            {fields.map(field => (
              <option key={field.name} value={field.name}>{field.label}</option>
            ))}
          </select>
          <input key={index} type="text" value={selectedFields[index]?.value} onChange={e => handleInputChange(e, index)} />
          <Button onClick={() => handleRemoveField(index)}>X</Button>

           {/* Suggestions list */}
      
        {suggestion && suggestion.length > 0 && (
          <ul className={isClicked ? "bg-red-700" : "display-none"}>
            {suggestion.map((item, idx) => (
              <li key={idx} className={isClicked?"":"display-none"}onClick={() => handleSuggestionClick(item, index)}>{item}</li>
            ))}
          </ul>
        )}
     

        </div>
      ))}
    </div>
  );
};
