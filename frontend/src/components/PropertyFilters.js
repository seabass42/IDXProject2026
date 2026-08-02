import React, { useState } from 'react';

const initialFilters = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
};

function PropertyFilters({ onSearch, onClear }) {
  const [filters, setFilters] = useState(initialFilters);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Remove empty values before sending to API
    const cleaned = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    onSearch(cleaned);
  }

  function handleClear() {
    setFilters(initialFilters);
    onClear();
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="zipcode"
        placeholder="ZIP Code"
        value={filters.zipcode}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="minPrice"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
        style={styles.input}
      />
      <select
        name="beds"
        value={filters.beds}
        onChange={handleChange}
        style={styles.input}
      >
        <option value="">Any Beds</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
        <option value="5">5+</option>
      </select>
      <select
        name="baths"
        value={filters.baths}
        onChange={handleChange}
        style={styles.input}
      >
        <option value="">Any Baths</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
      <button type="submit" style={styles.button}>Search</button>
      <button type="button" onClick={handleClear} style={styles.button}>
        Clear Filters
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    padding: '16px',
    background: '#f5f5f5',
    borderRadius: '8px',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    minWidth: '140px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    background: '#333',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default PropertyFilters;