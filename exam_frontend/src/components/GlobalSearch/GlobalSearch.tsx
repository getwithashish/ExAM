import React from "react";
import styles from "./GlobalSearch.module.css";
import { GlobalSearchProps } from "./types/types"; 
import { useLocation } from "react-router";

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  assetDataRefetch,
  searchTerm,
  reset,
  setSearchTerm
}) => {
  
  const location = useLocation();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);

    if (newValue === "") {
      assetDataRefetch("");
    } else {
      assetDataRefetch(`&global_search=${newValue}`);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex">
    <form className={styles["global-search-form"]} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        className={styles["global-search-input"]}
      />
    </form>
    {location.pathname !=='/exam/dashboard' && (
        <button className="rounded-lg text-white w-20" onClick={reset}>
        Reset
      </button>
    )}
    </div>   
  );
};

export default GlobalSearch;
