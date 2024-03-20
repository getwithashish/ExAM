import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GlobalSearch from '../../components/GlobalSearch/GlobalSearch';


describe('GlobalSearch', () => {
  it('calls onSearch with the search term when form is submitted', () => {
    // Mock onSearch function
    const mockOnSearch = jest.fn();

    // Render the GlobalSearch component with the mock function
    render(<GlobalSearch onSearch={mockOnSearch} assetDataRefetch={() => {}} />);

    // Get input element
    const inputElement = screen.getByPlaceholderText('Search...');

    // Simulate user input
    fireEvent.change(inputElement, { target: { value: 'test search' } });

    // Get form element
    const formElement = screen.getByRole('form');

    // Submit the form
    fireEvent.submit(formElement);

    // Assert that onSearch was called with the correct search term
    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('calls onSearch with the search term when search button is clicked', () => {
    // Mock onSearch function
    const mockOnSearch = jest.fn();

    // Render the GlobalSearch component with the mock function
    render(<GlobalSearch onSearch={mockOnSearch} assetDataRefetch={() => {}} />);

    // Get input element
    const inputElement = screen.getByPlaceholderText('Search...');

    // Simulate user input
    fireEvent.change(inputElement, { target: { value: 'test search' } });

    // Get search button
    const searchButton = screen.getByRole('button');

    // Click the search button
    fireEvent.click(searchButton);

    // Assert that onSearch was called with the correct search term
    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });
});
