import React from 'react';
import { render } from '@testing-library/react';
import RejectedAsset from '../../pages/RejectedAssetPage/RejectedAsset';


test('renders RejectedAsset component without errors', () => {
  render(<RejectedAsset />);
  // If the component renders without throwing any errors, the test passes
});