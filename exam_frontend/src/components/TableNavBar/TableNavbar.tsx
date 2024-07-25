import React, { useState, useCallback, useMemo } from "react";
import { DownloadOutlined, UploadOutlined, CloudDownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import axiosInstance from "../../config/AxiosConfig";
import GlobalSearch from "../GlobalSearch/GlobalSearch";
import styles from "./TableNavbar.module.css";
import DropDown from "../DropDown/DropDown";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";
import { QueryBuilderComponent } from "../QueryBuilder/QueryBuilder";
import { TableNavbarProps } from "./types";
import { message, Spin } from "antd";

const TableNavbar: React.FC<TableNavbarProps> = ({
  setShowUpload,
  assetDataRefetch,
  reset,
  searchTerm,
  setSearchTerm,
  setJson_query,
  json_query,
}) => {
  const [visible, setVisible] = useState(false);
  const [exporting, setExporting] = useState(false);

  const decodeJWT = useCallback((token: string) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) throw new Error("Invalid token format: missing base64Url");
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }, []);

  const userScope = useMemo(() => {
    const jwtToken = localStorage.getItem("jwt");
    return jwtToken ? decodeJWT(jwtToken)?.user_scope : null;
  }, [decodeJWT]);

  const handleExport = useCallback((exportFormat: string) => {
    setExporting(true);
    message.info("Please wait, the export may take some time");
    axiosInstance.get(`/asset/export?export_format=${exportFormat}&json_logic=${json_query}`, { responseType: "blob" })
      .then((response) => {
        const contentType = `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`;
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `assets.${exportFormat}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success("Asset export successful");
      })
      .catch((error) => {
        console.error("Error exporting assets:", error);
        message.error("Asset export failed");
      })
      .finally(() => {
        setExporting(false);
      });
  }, [json_query]);

  const exportOptions = useMemo(() => [
    { label: "Export as CSV", format: "csv", icon: <DownloadOutlined /> },
    { label: "Export as XLSX", format: "xlsx", icon: <DownloadOutlined /> },
    { label: "Export as PDF", format: "pdf", icon: <DownloadOutlined /> },
  ], []);

  const handleDropDownSelect = useCallback((key: string) => {
    if (key === "import") {
      setShowUpload(true);
    } else if (key === "downloadTemplate") {
      const link = document.createElement("a");
      link.href = "/static/sample_asset_download_template.csv";
      link.setAttribute("download", "sample_asset_download_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [setShowUpload]);

  const toggleQueryBuilder = useCallback(() => setVisible(prev => !prev), []);

  const exportButton = (
    <Spin spinning={exporting} indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}>
      <span>Export</span>
    </Spin>
  );

  return (
    <nav className={styles["navbar"]}>
      {["MANAGER", "SYSTEM_ADMIN"].includes(userScope) && (
        <DropDown
          onSelect={handleDropDownSelect}
          items={[
            { label: "Import Files", key: "import", icon: <UploadOutlined /> },
            { label: "Download Template", key: "downloadTemplate", icon: <CloudDownloadOutlined /> },
          ]}
          buttonLabel="Import"
        />
      )}

      <GlobalSearch
        assetDataRefetch={assetDataRefetch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <button className={styles["button"]} onClick={reset}>Reset</button>

      <button onClick={toggleQueryBuilder} className={styles["button"]}>Advanced Search</button>
      
      <DrawerViewRequest title="Advanced Search" onClose={toggleQueryBuilder} open={visible}>
        <QueryBuilderComponent
          assetDataRefetch={assetDataRefetch}
          setJson_query={setJson_query}
          reset={reset}
          setVisible={setVisible}
        />
      </DrawerViewRequest>

      <DropDown
        onSelect={handleExport}
        items={exportOptions.map(option => ({
          label: option.label,
          key: option.format,
          icon: option.icon,
        }))}
        buttonLabel={exportButton}
        disabled={exporting}
      />
    </nav>
  );
};

export default TableNavbar;