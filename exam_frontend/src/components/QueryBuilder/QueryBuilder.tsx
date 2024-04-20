import React, { useState } from 'react';

const fields: Field[] = [
  { name: "product_name", label: "product_name" },
  { name: "asset_type", label: "asset_type" },
  { name: "version", label: "version" },
  { name: "model_number", label: "model_number" },
  { name: "status", label: "status" },
  { name: "location", label: "location" },
  { name: "invoice_location", label: "invoice_location" },
  { name: "business_unit", label: "business_unit" },
  { name: "os", label: "os" },
  { name: "processor", label: "processor" },
  { name: "memory", label: "memory" },
  { name: "storage", label: "storage" },
  { name: "asset_detail_status", label: "asset_detail_status" },
  { name: "assign_status", label: "assign_status" },
];

interface QueryBuilderComponentProps {
 assetDataRefetch: (queryParam:string) => void
}

export const QueryBuilderComponent: React.FC<QueryBuilderComponentProps> = ({ assetDataRefetch }) => {
  const [selectedField, setSelectedField] = useState<string>('');

  const handleQueryButtonClick = () => {
    if (!selectedField) {
      // Handle case where no field is selected
      return;
    }

    let formattedQuery = formatQuery(selectedField, 'jsonlogic');
    console.log("formatted query", formattedQuery);
    formattedQuery = JSON.stringify(formattedQuery);
    let queryParam = `&json_logic=${formattedQuery}`;
    assetDataRefetch(queryParam);
  };s

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(event.target.value);
  };

  return (
    <div>
      <select onChange={handleSelectChange} value={selectedField}>
        <option value="">Select a field</option>
        {fields.map(field => (
          <option key={field.name} value={field.name}>{field.label}</option>
        ))}
      </select>
      <button onClick={handleQueryButtonClick} className='m-2 p-2 h-50 w-50 text-white'>Search</button>
    </div>
  );
};
