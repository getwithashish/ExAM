import React from 'react';
import axios from 'axios';

const ExportButton = () => {
  const handleExport = () => {
  
  axios.get('http://localhost:8000/api/v1/asset/export')
      .then(response => {
        // Create a Blob object from the CSV data
        const blob = new Blob([response.data], { type: 'text/csv' });
        
        // Create a temporary URL to the Blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'assets.csv');
        document.body.appendChild(link);
        
        // Trigger the download
        link.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error exporting assets:', error);
      });
  };

  return (
    
    <button onClick={handleExport}>Export Assets</button>
  );
}

export default ExportButton;
