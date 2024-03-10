// TableNavBar.jsx

import React, { useState } from "react";
import styles from "./TableNavBar.module.css";
import { TableNavBarModule } from "./types";

const TableNavBar = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleImport = () => {
        if (selectedFile) {
            // Add your import logic here
            console.log("Importing file:", selectedFile.name);
        }
    };

    const handleExport = () => {
        // Add your export logic here
        console.log("Exporting file.");
    };

    return (
        <nav className={styles["navbar"]}>
            <div className={styles["fileActionsContainer"]}>
                <input type="file" onChange={handleFileSelect} className={styles["fileInput"]} />
                <button onClick={handleImport} disabled={!selectedFile} className={styles["importButton"]}>
                    Import
                </button>
                <button onClick={handleExport} disabled={!selectedFile} className={styles["exportButton"]}>
                    Export
                </button>
            </div>
        </nav>
    );
};

export default TableNavBar;
