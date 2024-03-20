import BarAnimation from '../../components/charts/chartHandlers/BarChartHandler';

import { render, waitFor } from '@testing-library/react';
import axiosInstance from '../../config/AxiosConfig'; // Import your axios instance here

// Mock axiosInstance.get function
jest.mock('../../../config/AxiosConfig', () => ({
  get: jest.fn(),
}));

describe('BarAnimation component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', async () => {
    // Mock axiosInstance.get to return a promise that never resolves
    axiosInstance.get.mockImplementationOnce(() => new Promise(() => {}));

    // Render the BarAnimation component
    const { getByText, queryByText } = render(<BarAnimation />);

    // Assert that the loading message is displayed
    expect(getByText('Loading...')).toBeInTheDocument();
    
    // Assert that the error message is not rendered
    expect(queryByText(/^Error:/)).not.toBeInTheDocument();
  });

  it('renders error state', async () => {
    const errorMessage = 'Failed to fetch data';

    // Mock axiosInstance.get to return a rejected promise with the provided error
    axiosInstance.get.mockRejectedValueOnce(new Error(errorMessage));

    // Render the BarAnimation component
    const { getByText, queryByText } = render(<BarAnimation />);

    // Assert that the error message is displayed
    expect(await waitFor(() => getByText(`Error: ${errorMessage}`))).toBeInTheDocument();
    
    // Assert that the loading message is not rendered
    expect(queryByText('Loading...')).not.toBeInTheDocument();
  });
});
