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
import DrawerViewRequest from "./DrawerViewRequest";
import { QueryBuilderComponent } from "../QueryBuilder/QueryBuilder";

const TableNavbar = ({ showUpload, setShowUpload, assetDataRefetch }) => {
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
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

  const handleImportClick =async () => {
    setShowUpload(true);
    try {
      // Make a POST request to the backend API endpoint
      const response = await axiosInstance.post("/asset/import-csv", FormData, {
        responseType: "blob" // Receive response as a binary blob
      });
  
      // Check if the response contains data
      if (response.data) {
        // Create a temporary URL for the blob response
        const url = window.URL.createObjectURL(new Blob([response.data]));
  
        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "wronged_assets.csv"); // Set default filename
  
        // Append the link to the document body
        document.body.appendChild(link);
  
        // Wait for the link to be appended before triggering the download
        await new Promise((resolve) => setTimeout(resolve, 100));
  
        // Trigger the download by clicking the link
        link.click();
  
        // Clean up the URL and link
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        // Indicate successful import if no data returned
        console.log("Import successful!");
      }
    } catch (error) {
      console.error("Error importing CSV:", error);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      // Make an API call to the backend to export assets
      const response = await axiosInstance.get(`/asset/export?export_format=${format}`, {
        responseType: 'blob' // Receive response as a binary blob
      });

      // Create a temporary URL for the blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assets.${format}`);

      // Append the link to the document body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up the URL and link
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error exporting assets as ${format.toUpperCase()}:`, error);
    }
  };

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
    } else {
      handleExport(key as 'csv' | 'xlsx' | 'pdf');
    }
  };
  // Define the items for the import dropdown with icons
  const importItems = [
    { label: "Import as csv", key: "import", icon: <DownloadOutlined /> },
    { label: "Download Template", key: "downloadTemplate", icon: <CloudDownloadOutlined /> },
    { label: "Import as xlsx", key: "import-xlsx", icon: <DownloadOutlined /> },
  ];

  // Define the items for the export dropdown with icons
  const exportItems = [
    { label: "Export as CSV", key: "csv", icon: <UploadOutlined /> },
    { label: "Export as XLSX", key: "xlsx", icon: <UploadOutlined /> },
    { label: "Export as PDF", key: "pdf", icon: <UploadOutlined /> },
  ];


  function handleSearch(_searchTerm: string): void {
    console.log("Global Search Term: ", _searchTerm);
    assetDataRefetch(`&global_search=${_searchTerm}`);
  }

  const showQueryBuilder = () => {
    setVisible(true);
  };

  const closeQueryBuilder = () => {
    setVisible(false);
  };
  return (
    <nav className={styles["navbar"]}>
      {getUserScope() === "LEAD" && (
        <DropDown
          onSelect={handleDropDownSelect}
          items={importItems}
          buttonLabel="Import"
        />
      )}
       <GlobalSearch
        onSearch={handleSearch}
        assetDataRefetch={assetDataRefetch}
      />
      <DropDown
        onSelect={handleDropDownSelect}
        items={exportItems}
        buttonLabel="Export"
      />
     
    </nav>
  );
};

export default TableNavbar;
