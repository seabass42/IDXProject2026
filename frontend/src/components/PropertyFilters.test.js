import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

test('renders all six filter inputs', () => {
  render(<PropertyFilters onSearch={jest.fn()} onClear={jest.fn()} />);
  expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('ZIP Code')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
  expect(screen.getByText('Any Beds')).toBeInTheDocument();
  expect(screen.getByText('Any Baths')).toBeInTheDocument();
});

test('calls onSearch with filled values when submitted', () => {
  const onSearch = jest.fn();
  render(<PropertyFilters onSearch={onSearch} onClear={jest.fn()} />);

  fireEvent.change(screen.getByPlaceholderText('City'), {
    target: { name: 'city', value: 'Anaheim' },
  });
  fireEvent.submit(screen.getByRole('button', { name: /search/i }).closest('form'));

  expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ city: 'Anaheim' }));
});

test('clear button resets form and calls onClear', () => {
  const onClear = jest.fn();
  render(<PropertyFilters onSearch={jest.fn()} onClear={onClear} />);

  fireEvent.change(screen.getByPlaceholderText('City'), {
    target: { name: 'city', value: 'Anaheim' },
  });
  fireEvent.click(screen.getByText('Clear Filters'));

  expect(screen.getByPlaceholderText('City').value).toBe('');
  expect(onClear).toHaveBeenCalled();
});