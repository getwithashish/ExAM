import axiosInstance from '../../config/AxiosConfig';
import { useQuery } from '@tanstack/react-query';

const ExportButton = () => {
  // Call useQuery hook to fetch the data
  const { data, isLoading, isError } = useQuery(['Assign'], async () => {
    const response = await axiosInstance.get('/asset/export');
    return response.data;
  });

  // Handle export button click
  const handleExport = () => {
    if (!isLoading && !isError && data) {
      // Create a Blob object from the CSV data
      const blob = new Blob([data], { type: 'text/csv' });

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
    }
  };

  return (
    <button onClick={handleExport} disabled={isLoading || isError}>
      {isLoading ? 'Exporting...' : isError ? 'Error exporting assets' : 'Export Assets'}
    </button>
  );
};

export default ExportButton;
