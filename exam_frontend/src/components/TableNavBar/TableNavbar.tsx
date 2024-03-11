// import React, { useState } from "react";
// import styles from "./TableNavbar.module.css";

// const TableNavbar = () => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileSelect = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleImport = () => {
//     if (selectedFile) {
//       // Add your import logic here
//       console.log("Importing file:", selectedFile.name);
//     }
//   };

//   const handleExport = () => {
//     // Add your export logic here
//     console.log("Exporting file.");
//   };

//   return (
//     <nav className={styles["fileActionsNavbar"]}>
//       <div className={styles["fileActionsContainer"]}>
//         <div className={styles["fileInputContainer"]}>
//           <label htmlFor="fileInput" className={styles["fileInputLabel"]}>
//             Browse...
//           </label>
//           <input
//             type="file"
//             id="fileInput"
//             onChange={handleFileSelect}
//             className={styles["fileInput"]}
//           />
//           {selectedFile ? (
//             <span className={styles["selectedFileName"]}>{selectedFile.name}</span>
//           ) : (
//             <span className={styles["noFileSelected"]}>No file selected.</span>
//           )}
//         </div>
//         <div className={styles["buttonContainer"]}>
//           <button onClick={handleImport} disabled={!selectedFile} className={styles["importButton"]}>
//             Import
//           </button>
//           <button onClick={handleExport} disabled={!selectedFile} className={styles["exportButton"]}>
//             Export
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default TableNavbar;



import React, { useState } from 'react';
import AssignmentDrawer from '../Assign/AssignmentDrawer';

import UploadComponent from '../Upload/UploadComponent';
import styles from './TableNavbar.module.css'; // Import CSS module for styling

const TableNavbar = ({showUpload, setShowUpload}) => {
  // const [showUpload, setShowUpload] = useState(false); // State to control rendering of C1 component

  // Function to handle import button click
  const handleImportClick = () => {
    console.log("Hello")
    setShowUpload(true);
    // <AssignmentDrawer buttonTextDefault="Import" displayDrawer={setShowUpload} >
    //        <UploadComponent/>
    //     </AssignmentDrawer>
  

  };

  // Function to handle export button click
  const handleExportClick = () => {
    // Add export logic here
    console.log('Export button clicked');
  };

  return (
    <nav className={styles['navbar']}>
      
      {/* Import button */}
      <button onClick={handleImportClick} className={styles['button']}>
        Import
      </button>
      {/* Export button */}
      <button onClick={handleExportClick} className={styles['button']}>
        Export
      </button>
     
  
      {/* {showUpload && < UploadComponent/>} */}
    </nav>
  );
};

export default TableNavbar;
