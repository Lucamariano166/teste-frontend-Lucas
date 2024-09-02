import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App'; // Default import

test('renders app component', () => {
  render(<App />);
  expect(screen.getByText(/EquipmentMap/i)).toBeInTheDocument();
});
