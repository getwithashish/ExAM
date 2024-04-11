import { useState } from 'react';
import { Field, QueryBuilder, RuleGroupType, formatQuery } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import styles from './QueryBuilder.css'

const fields: Field[] = [
  { name: 'product_name', label: 'product_name' },
  { name: 'asset_type', label: 'asset_type' },
  { name: 'version', label: 'version' },
  { name: 'model_number', label: 'model_number' },
  { name: 'status', label: 'status' },
  { name: 'location', label: 'location' },
  { name: 'invoice_location', label: 'invoice_location' },
  { name: 'business_unit', label: 'business_unit' },
  { name: 'os', label: 'os' },
  { name: 'processor', label: 'processor' },
  { name: 'memory', label: 'memory' },
  { name: 'storage', label: 'storage' },
  { name: 'asset_detail_status', label: 'asset_detail_status' },
  { name: 'assign_status', label: 'assign_status' },
  
];

interface QueryBuilderComponentProps {
 assetDataRefetch: (queryParam:string) => void
}

export const QueryBuilderComponent:React.FC<QueryBuilderComponentProps> = ({assetDataRefetch}) => {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: 'and',
    rules: [
      { field: 'product_name', operator: '=', value: '' },
      
    ],
  });
  const handleQueryButtonClick = () => {
    let formattedQuery = formatQuery(query, 'jsonlogic');
    console.log( "formatted query",formattedQuery)
    formattedQuery = JSON.stringify(formattedQuery);
    // Make a get request to the backend endpointa
    let queryParam = `&json_logic=${formattedQuery}`
    assetDataRefetch(queryParam)
   
  };

  return (
    <div className={styles['queryBuilder']}>
      <QueryBuilder fields={fields} query={query} onQueryChange={setQuery}  />
      <button onClick={handleQueryButtonClick} className='m-2 p-2 h-50 w-50 text-white'>Search</button>
    </div>
  );
};
