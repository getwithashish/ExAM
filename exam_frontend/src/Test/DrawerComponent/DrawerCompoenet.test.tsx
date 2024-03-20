import { render, screen } from '@testing-library/react';
import DrawerComponent from '../../components/DrawerComponent/DrawerComponent';


test('renders DrawerComponent with correct title', () => {
  const onCloseMock = jest.fn();

  render(
    <DrawerComponent visible={true} onClose={onCloseMock} drawerTitle="Test Drawer Title">
      <div>Drawer Content</div>
    </DrawerComponent>
  );

  // Ensure that the DrawerComponent renders with the correct title
  const titleElement = screen.getByText('Test Drawer Title');
  expect(titleElement).toBeInTheDocument();

  // Ensure that the DrawerComponent renders children content
  const contentElement = screen.getByText('Drawer Content');
  expect(contentElement).toBeInTheDocument();
});
