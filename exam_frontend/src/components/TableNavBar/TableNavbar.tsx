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
  setJson_query,
  json_query,
}) => {
  const [visible, setVisible] = useState(false);

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
    if (jwtToken) {
      const payload = decodeJWT(jwtToken);
      return payload.user_scope;
    }
  };

  const handleImportClick = () => {
    setShowUpload(true);
  };

  const handleExport = (exportFormat: string) => {
    axiosInstance
      .get(
        `/asset/export?export_format=${exportFormat}&json_logic=${json_query}`,
        {
          responseType: "blob", // Set responseType to 'blob' to handle binary data
        }
      )
      .then((response) => {
        const contentType = `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`; // Specify XLSX MIME type
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `assets.${exportFormat}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error exporting assets:", error);
      });
  };

  const exportOptions = [
    { label: "Export as CSV", format: "csv", icon: <DownloadOutlined /> },
    { label: "Export as XLSX", format: "xlsx", icon: <DownloadOutlined /> },
    { label: "Export as PDF", format: "pdf", icon: <DownloadOutlined /> },
  ];

  const handleExportSelect = (format: string) => {
    handleExport(format);
  };

  const handleDropDownSelect = (key: string) => {
    if (key === "import") {
      handleImportClick();
    } else if (key === "downloadTemplate") {
      handleTemplateDownload();
    }
  };

  const handleTemplateDownload = () => {
    const filePath = "/static/sample_asset_download_template.csv";
    const link = document.createElement("a");
    link.href = filePath;
    link.setAttribute("download", "sample_asset_download_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showQueryBuilder = () => {
    setVisible(true);
  };

  const closeQueryBuilder = () => {
    setVisible(false);
  };

  return (
    <nav className={styles["navbar"]}>
      {["MANAGER", "SYSTEM_ADMIN"].includes(getUserScope()) && (
        <DropDown
          onSelect={handleDropDownSelect}
          items={[
            { label: "Import Files", key: "import", icon: <UploadOutlined /> },
            {
              label: "Download Template",
              key: "downloadTemplate",
              icon: <CloudDownloadOutlined />,
            },
          ]}
          buttonLabel="Import"
        />
      )}

      <GlobalSearch
        assetDataRefetch={assetDataRefetch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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
          reset={reset}
          setVisible={setVisible}
        />
      </DrawerViewRequest>

      <DropDown
        onSelect={handleExportSelect}
        items={exportOptions.map((option) => ({
          label: option.label,
          key: option.format,
          icon: option.icon,
        }))}
        buttonLabel="Export"
      />
    </nav>
  );
};

export default TableNavbar;
