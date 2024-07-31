import React from "react";
import styles from "./GlobalSearch.module.css";
import { GlobalSearchProps } from "./types/types";
import { useLocation } from "react-router";
import { ConfigProvider, Input, theme } from "antd";
import { TextInput } from "flowbite-react";

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  assetDataRefetch,
  searchTerm,
  reset,
  setSearchTerm,
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

  const { darkAlgorithm } = theme;
  const customTheme = {
    algorithm: darkAlgorithm,
    components: {
      Table: {
        colorBgContainer: "#161B21",
      },
    },
  };

  return (
    <div className=" flex items-center">
    <form onSubmit={handleSubmit}>
      <ConfigProvider theme={customTheme}>
        <TextInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
          className={styles["global-search-input"]}
        />
      </ConfigProvider>
    </form>
    {location.pathname !== "/exam/dashboard" && (
      <button className="rounded-lg text-white w-20 h-10 ml-2 " onClick={reset}>
        Reset
      </button>
    )}
  </div>
  );
};

export default GlobalSearch;
