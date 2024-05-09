import React, { useState } from "react";
import {
  DownloadOutlined,
  UploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import GlobalSearch from "../GlobalSearch/GlobalSearch";
import styles from "./TableNavbar.module.css";
import DropDown from "../DropDown/DropDown";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";
import { QueryBuilderComponent } from "../QueryBuilder/QueryBuilder";
import { TableNavbarProps } from "./types";

const TableNavbar: React.FC<TableNavbarProps> = ({
  showUpload,
  setShowUpload,
  assetDataRefetch,
  reset,
  searchTerm, 
  setSearchTerm,
}) => {
  const [visible, setVisible] = useState(false);
  const [json_query, setJson_query] = useState<string>("");

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) {
        throw new Error("Invalid token format: missing base64Url");
      }
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const getUserScope = () => {
    const jwtToken = localStorage.getItem("jwt");
    console.log(jwtToken);
    if (jwtToken) {
      const payload = decodeJWT(jwtToken);
      return payload.user_scope;
    }
  };

  // Function to handle import button click
  const handleImportClick = () => {
    setShowUpload(true);
  };

  // Function to handle export button click
  const handleExport = () => {
    console.log("handleexport", json_query);
    axiosInstance
      .get(`/asset/export?export_format=csv&json_logic=${json_query}`)
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "assets.csv");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error exporting assets:", error);
      });
  };

  // Function to handle template download button click
  const handleTemplateDownload = () => {
    // Use the direct URL of the static file
    const filePath = "/static/sample_asset_download_template.csv";

    // Create a new link element to trigger the download
    const link = document.createElement("a");
    link.href = filePath;
    link.setAttribute("download", "sample_asset_download_template.csv");
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };

  // Function to handle dropdown item selection
  const handleDropDownSelect = (key: string) => {
    if (key === "import") {
      handleImportClick();
    } else if (key === "downloadTemplate") {
      handleTemplateDownload();
    }
  };

  // Define the items for the dropdown with icons
  const items = [
    { label: "Import Files", key: "import", icon: <DownloadOutlined /> },
    {
      label: "Download Template",
      key: "downloadTemplate",
      icon: <CloudDownloadOutlined />,
    },
  ];

  const showQueryBuilder = () => {
    setVisible(true);
  };

  const closeQueryBuilder = () => {
    setVisible(false);
  };

  return (
    <nav className={styles["navbar"]}>
      {getUserScope() === "LEAD" ? (
        <DropDown
          onSelect={handleDropDownSelect}
          items={items}
          buttonLabel="Import"
        />
      ) : null}

      <GlobalSearch
        assetDataRefetch={assetDataRefetch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm} // Pass searchTerm prop
      />

      <button className={styles["button"]} onClick={reset}>
        Reset
      </button>

      <button onClick={showQueryBuilder} className={styles["button"]}>
        Advanced Search
      </button>
      <DrawerViewRequest
        title="Advanced Search"
        onClose={closeQueryBuilder}
        open={visible}
      >
        <QueryBuilderComponent
          assetDataRefetch={assetDataRefetch}
          setJson_query={setJson_query}
        />
      </DrawerViewRequest>

      <button onClick={handleExport} className={styles["button"]}>
        <UploadOutlined /> Export
      </button>
    </nav>
  );
};

export default TableNavbar;
