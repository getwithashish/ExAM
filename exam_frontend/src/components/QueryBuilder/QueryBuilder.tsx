import { useState } from 'react';
import { Field, QueryBuilder, RuleGroupType, formatQuery } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import axiosInstance from '../../config/AxiosConfig';

const fields: Field[] = [
  { name: 'product_name', label: 'product_name' },
  { name: 'asset_type', label: 'ssset_type' },
];

export const QueryBuilderComponent = () => {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: 'and',
    rules: [
      { field: 'product_name', operator: '=', value: 'HP' },
      { field: 'asset_type', operator: '=', value: 'Laptop' },
    ],
  });

  const handleQueryButtonClick = () => {
    const formattedQuery = formatQuery(query, 'cel');
    console.log("query", formattedQuery)
    // Make a POST request to the backend endpoint
    axiosInstance.post('/asset/queryBuilder', { cel_query: formattedQuery })
      .then(response => {
        console.log('Response:', response.data.result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <QueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
      <button onClick={handleQueryButtonClick}>Show Query</button>
    </div>
  );
};
