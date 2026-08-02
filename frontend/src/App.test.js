import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders property listings heading', () => {
  render(<App />);
  expect(screen.getByText(/property listings/i)).toBeInTheDocument();
});