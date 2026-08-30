import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock useNavigate before importing PropertyCard
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

import PropertyCard from './PropertyCard';

const mockProperty = {
  id: 1,
  L_ListingID: '1115119412',
  L_Photos: JSON.stringify(['https://example.com/photo.jpg']),
  L_SystemPrice: 500000,
  L_Address: '123 Main St',
  L_City: 'Anaheim',
  L_State: 'CA',
  L_Keyword2: 3,
  LM_Dec_3: 2,
  LM_Int2_3: 1500,
};

function renderCard(props = {}) {
  return render(<PropertyCard property={{ ...mockProperty, ...props }} />);
}

test('renders property price', () => {
  renderCard();
  expect(screen.getByText('$500,000')).toBeInTheDocument();
});

test('renders property address', () => {
  renderCard();
  expect(screen.getByText('123 Main St')).toBeInTheDocument();
});

test('renders city and state', () => {
  renderCard();
  expect(screen.getByText('Anaheim, CA')).toBeInTheDocument();
});

test('renders beds baths and sqft', () => {
  renderCard();
  expect(screen.getByText(/3 beds/)).toBeInTheDocument();
});

test('shows No Photo when L_Photos is null', () => {
  renderCard({ L_Photos: null });
  expect(screen.getByText('No Photo')).toBeInTheDocument();
});

test('shows No Photo when L_Photos is invalid JSON', () => {
  renderCard({ L_Photos: 'not-json' });
  expect(screen.getByText('No Photo')).toBeInTheDocument();
});

test('shows Price unavailable when L_SystemPrice is null', () => {
  renderCard({ L_SystemPrice: null });
  expect(screen.getByText('Price unavailable')).toBeInTheDocument();
});