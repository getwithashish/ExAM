// import React, { useState } from 'react';
// import styles from './TableNavbar.module.css'; // Import CSS module for styling

// const TableNavbar = ({setShowUpload}) => {
  

//   // Function to handle import button click
//   const handleImportClick = () => {
//     console.log("Hello")
//     setShowUpload(true);
   

//   };

//   // Function to handle export button click
//   const handleExportClick = () => {
//     // Add export logic here
//     console.log('Export button clicked');
//   };

//   return (
//     <nav className={styles['navbar']}>
      
    
//       <button onClick={handleImportClick} className={styles['button']}>
//         Import
//       </button>
    
//       <button onClick={handleExportClick} className={styles['button']}>
//         Export
//       </button>
     
  
   
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
     
 
    </nav>
  );
};
 
export default TableNavbar;