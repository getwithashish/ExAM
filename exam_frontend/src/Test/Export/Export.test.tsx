import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axiosInstance from '../../config/AxiosConfig';
import ExportButton from '../../components/Export/Export';


jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('ExportButton component', () => {
  it('renders export button correctly', () => {
    const { getByText } = render(<ExportButton />);
    expect(getByText('Export Assets')).toBeInTheDocument();
  });

  it('handles export button click', async () => {
    const mockData = 'asset1,asset2,asset3';
    const { getByText } = render(<ExportButton />);
    
    // Mocking useQuery hook response
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    // Trigger export button click
    fireEvent.click(getByText('Export Assets'));

    // Wait for the download to finish
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith('/asset/export');
    });
  });

  it('disables button while loading', () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: true,
      isError: false,
    });
    const { getByText } = render(<ExportButton />);
    expect(getByText('Exporting...')).toBeDisabled();
  });

  it('displays error message if there is an error', () => {
    (useQuery as jest.Mock).mockReturnValueOnce({
      isLoading: false,
      isError: true,
    });
    const { getByText } = render(<ExportButton />);
    expect(getByText('Error exporting assets')).toBeInTheDocument();
  });
});
function expect(get: <T = any, R = import("axios").AxiosResponse<T, any>, D = any>(url: string, config?: import("axios").AxiosRequestConfig<D> | undefined) => Promise<R>) {
  throw new Error('Function not implemented.');
}

