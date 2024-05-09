import React, { useState } from "react";
import styles from "./GlobalSearch.module.css";
import { GlobalSearchProps } from "./types/types";

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  assetDataRefetch,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue); // Update the searchTerm state with the new value

    // Refetch asset data with the new search term
    if (newValue === "") {
      assetDataRefetch(``);
    } else {
      assetDataRefetch(`&global_search=${newValue}`);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Optionally, you can perform any actions related to form submission here
  };

  return (
    <form className={styles["global-search-form"]} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        className={styles["global-search-input"]}
      />
    </form>
  );
};

export default GlobalSearch;
