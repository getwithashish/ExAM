import React, { useCallback, useState } from "react";
import styles from "./GlobalSearch.module.css";
import { GlobalSearchProps } from "./types/types";
import { useLocation } from "react-router";
import { ConfigProvider, Input, theme } from "antd";
import { TextInput } from "flowbite-react";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";
import { QueryBuilderComponent } from "../QueryBuilder/QueryBuilder";

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  assetDataRefetch,
  searchTerm,
  reset,
  setSearchTerm,
  setJson_query,
  json_query,
  advancedSearchDisabledFields,
  isAdvancedSearchDisabled,
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

  const [visible, setVisible] = useState(false);
  const toggleQueryBuilder = useCallback(() => setVisible((prev) => !prev), []);

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
      {
        <>
          <button className={styles["button"]} onClick={reset}>
            Reset
          </button>

          <button
            onClick={toggleQueryBuilder}
            className={styles["button"]}
            hidden={isAdvancedSearchDisabled}
          >
            Advanced Search
          </button>

          <DrawerViewRequest
            title="Advanced Search"
            onClose={toggleQueryBuilder}
            open={visible}
          >
            <QueryBuilderComponent
              assetDataRefetch={assetDataRefetch}
              setJson_query={setJson_query}
              reset={reset}
              setVisible={setVisible}
              disabledFields={advancedSearchDisabledFields}
            />
          </DrawerViewRequest>
        </>
      }
    </div>
  );
};

export default GlobalSearch;
