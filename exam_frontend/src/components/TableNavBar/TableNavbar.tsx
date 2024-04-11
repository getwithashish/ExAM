import React from 'react';
import { DownloadOutlined, UploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import axiosInstance from '../../config/AxiosConfig';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import styles from './TableNavbar.module.css';
import DropDown from '../DropDown/DropDown';

const TableNavbar = ({ showUpload, setShowUpload, assetDataRefetch }) => {
  const handleImportClick = () => {
    setShowUpload(true);
  };

  const handleExport = async (format) => {
    try {
      const response = await axiosInstance.get(`asset/export?export_format=${format}`, {
        responseType: 'blob', // Receive response as a binary blob
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

  const handleDropDownSelect = (key) => {
    if (key === 'import') {
      handleImportClick();
    } else if (key === 'downloadTemplate') {
      handleTemplateDownload();
    } else {
      handleExport(key);
    }
  };

  const importItems = [
    { label: 'Import as csv', key: 'import', icon: <DownloadOutlined /> },
    { label: 'Download Template', key: 'downloadTemplate', icon: <CloudDownloadOutlined /> },
    { label: 'Import as xlsx', key: 'xlsx', icon: <DownloadOutlined /> },
  ];

  const exportItems = [
    { label: 'Export as CSV', key: 'csv', icon: <UploadOutlined /> },
    { label: 'Export as XLSX', key: 'xlsx', icon: <UploadOutlined /> },
    { label: 'Export as PDF', key: 'pdf', icon: <UploadOutlined /> },
  ];

  function handleSearch(_searchTerm) {
    console.log("Global Search Term: ", _searchTerm);
    assetDataRefetch(`&global_search=${_searchTerm}`);
  }

  return (
    <nav className={styles['navbar']}>
      <DropDown onSelect={handleDropDownSelect} items={importItems} buttonLabel="Import" />
      <GlobalSearch onSearch={handleSearch} assetDataRefetch={assetDataRefetch} />
      <DropDown onSelect={handleDropDownSelect} items={exportItems} buttonLabel="Export" />
    </nav>
  );
};

export default TableNavbar;
