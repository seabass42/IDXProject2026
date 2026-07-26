import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties } from '../api/client';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProperties({ limit: 20, offset: 0 });
        setProperties(data.results);
        setTotal(data.total);
      } catch (err) {
        setError('Failed to load properties, backend may be down.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading properties...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Property Listings</h1>
      <p>Showing {properties.length} of {total.toLocaleString()} properties</p>
      <div style={styles.grid}>
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
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