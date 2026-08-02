import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { fetchProperties } from '../api/client';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [activeFilters, setActiveFilters] = useState({});
  const limit = 20;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProperties({ limit, offset, ...activeFilters });
        setProperties(data.results);
        setTotal(data.total);
      } catch (err) {
        setError('Failed to load properties, backend may be down.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [offset, activeFilters]);

  function handleSearch(filters) {
    setActiveFilters(filters);
    setOffset(0);
  }

  function handleClear() {
    setActiveFilters({});
    setOffset(0);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Property Listings</h1>
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
      {loading && <p>Loading properties...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <>
          <p>Showing {properties.length} of {total.toLocaleString()} properties</p>
          {properties.length === 0 && (
            <p>No properties found. Try adjusting your filters.</p>
          )}
          <div style={styles.grid}>
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setOffset(o => Math.max(0, o - limit))}
              disabled={offset === 0}
            >
              Previous
            </button>
            <span>Page {Math.floor(offset / limit) + 1}</span>
            <button
              onClick={() => setOffset(o => o + limit)}
              disabled={offset + limit >= total}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
};

export default ListingsPage;