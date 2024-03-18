import React from 'react';
import { DownloadOutlined, UploadOutlined, CloudDownloadOutlined} from '@ant-design/icons';
import axiosInstance from '../../config/AxiosConfig';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import styles from './TableNavbar.module.css';
import DropDown from '../DropDown/DropDown';

const TableNavbar = ({ showUpload, setShowUpload }) => {
  // Function to handle import button click
  const handleImportClick = () => {
    setShowUpload(true);
  };

  // Function to handle export button click
  const handleExport = () => {
    axiosInstance
      .get('http://localhost:8000/api/v1/asset/export')
      .then((response) => {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'assets.csv');
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error exporting assets:', error);
      });
  };

  // Function to handle template download button click
  const handleTemplateDownload = () => {
    // Use the direct URL of the static file
    const filePath = '/static/sample_asset_download_template.csv';
   
    // Create a new link element to trigger the download
    const link = document.createElement('a');
    link.href = filePath;
    link.setAttribute('download', 'sample_asset_download_template.csv');
    document.body.appendChild(link);
   
    // Trigger the download
    link.click();
   
    // Cleanup
    document.body.removeChild(link);
  };

  // Function to handle dropdown item selection
  const handleDropDownSelect = (key: string) => {
    if (key === 'import') {
      handleImportClick();
    } else if (key === 'downloadTemplate') {
      handleTemplateDownload();
    }
  };

  // Define the items for the dropdown with icons
  const items = [
    { label: 'Import Files', key: 'import', icon: <DownloadOutlined /> },
    { label: 'Download Template', key: 'downloadTemplate', icon:<CloudDownloadOutlined /> },
  ];

  function handleSearch(_searchTerm: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <nav className={styles['navbar']}>
     
      <DropDown onSelect={handleDropDownSelect} items={items} buttonLabel="Import" />
      <GlobalSearch onSearch={handleSearch} />
      <button onClick={handleExport} className={styles['button']}>
        <UploadOutlined /> Export
      </button>
    </nav>
  );
};

export default TableNavbar;
