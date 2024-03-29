import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import styles from './GlobalSearch.module.css';

interface GlobalSearchProps {
  onSearch: (searchTerm: string) => void;
  assetDataRefetch: (queryParam: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSearch, assetDataRefetch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.value === ""){
      setSearchTerm(event.target.value);
      assetDataRefetch(``)
    }
    else{
      setSearchTerm(event.target.value);
      assetDataRefetch(`&global_search=${event.target.value}`)
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // onSearch(searchTerm);
  };

  const handleSearchButtonClick = () => {
    onSearch(searchTerm); // Call the onSearch callback function with the search term when the search button is clicked
  };

  return (
    <form className={styles['global-search-form']} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        className={styles['global-search-input']}
      />
      {/* <button type="button" className={styles['global-search-button']} onClick={handleSearchButtonClick}>
        <SearchOutlined />
      </button> */}
    </form>
  );
};

export default GlobalSearch;
