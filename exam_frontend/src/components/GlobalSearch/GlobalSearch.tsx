import React from "react";
import styles from "./GlobalSearch.module.css";
import { GlobalSearchProps } from "./types/types";

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  assetDataRefetch,
  searchTerm,
  setSearchTerm
}) => {
  // const [searchTerm, setSearchTerm] = useState(""); // Initialize searchTerm state

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
