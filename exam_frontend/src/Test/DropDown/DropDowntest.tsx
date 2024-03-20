import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import DropDown from '../../components/DropDown/DropDown';

describe('DropDown', () => {
  it('renders button with default label and shows menu on click', async () => {
    // Mock onSelect function
    const mockOnSelect = jest.fn();

    // Render the DropDown component
    render(<DropDown onSelect={mockOnSelect} />);

    // Get button element
    const buttonElement = screen.getByRole('button');

    // Click the button
    fireEvent.click(buttonElement);

    // Wait for the menu to be visible
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    // Assert that the button label matches the default label
    expect(buttonElement).toHaveTextContent('Submit');
  });

  it('renders button with custom label and calls onSelect when an item is clicked', async () => {
    // Mock onSelect function
    const mockOnSelect = jest.fn();

    // Define custom items
    const items = [
      { label: 'Item 1', key: '1' },
      { label: 'Item 2', key: '2' },
    ];

    // Render the DropDown component with custom label and items
    render(<DropDown onSelect={mockOnSelect} items={items} buttonLabel="Custom Button" />);

    // Get button element
    const buttonElement = screen.getByRole('button');

    // Click the button
    fireEvent.click(buttonElement);

    // Wait for the menu to be visible
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    // Click on the first menu item
    fireEvent.click(screen.getByText('Item 1'));

    // Assert that onSelect was called with the correct key
    expect(mockOnSelect).toHaveBeenCalledWith('1');

    // Assert that the button label matches the custom label
    expect(buttonElement).toHaveTextContent('Custom Button');
  });
});
