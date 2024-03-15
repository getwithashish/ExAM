import React, { useState } from "react";
import AssignmentDrawer from "../Assign/AssignmentDrawer";

import UploadComponent from "../Upload/UploadComponent";
import styles from "./TableNavbar.module.css"; // Import CSS module for styling
import axiosInstance from "../../config/AxiosConfig";
import {
  DownloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const TableNavbar = ({ showUpload, setShowUpload }) => {
  // const [showUpload, setShowUpload] = useState(false); // State to control rendering of C1 component

  // Function to handle import button click
  const handleImportClick = () => {
    console.log("Hello");
    setShowUpload(true);
    // <AssignmentDrawer buttonTextDefault="Import" displayDrawer={setShowUpload} >
    //        <UploadComponent/>
    //     </AssignmentDrawer>
  };

  const handleExport = () => {
    axiosInstance
      .get("http://localhost:8000/api/v1/asset/export")
      .then((response) => {
        // Create a Blob object from the CSV data
        const blob = new Blob([response.data], { type: "text/csv" });

        // Create a temporary URL to the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "assets.csv");
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error exporting assets:", error);
      });
  };

  return (
    <nav className={styles["navbar"]}>
      {/* Import button */}
      <button onClick={handleImportClick} className={styles["button"]}>
        <UploadOutlined /> Import
      </button>
      <button onClick={handleExport} className={styles["button"]}>
        <DownloadOutlined /> Export
      </button>

      {/* {showUpload && < UploadComponent/>} */}
    </nav>
  );
};

export default TableNavbar;
