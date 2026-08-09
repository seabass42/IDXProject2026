import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyById, fetchOpenHouses } from '../api/client';
import PropertyMap from '../components/PropertyMap';
import PropertyImageGallery from '../components/PropertyImageGallery';
import OpenHouseList from '../components/OpenHouseList';

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [prop, oh] = await Promise.all([
          fetchPropertyById(id),
          fetchOpenHouses(id),
        ]);
        setProperty(prop);
        setOpenHouses(oh);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p style={{ padding: '20px' }}>Loading property...</p>;
  if (error) return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <p style={{ color: 'red' }}>{error}</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back to Listings
      </button>

      <PropertyImageGallery photos={property.L_Photos} />

      <div style={styles.header}>
        <h1 style={styles.price}>
          {property.L_SystemPrice
            ? `$${Number(property.L_SystemPrice).toLocaleString()}`
            : 'Price unavailable'}
        </h1>
        <p style={styles.address}>
          {property.L_Address}, {property.L_City}, {property.L_State} {property.L_Zip}
        </p>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}>
          <strong>{property.L_Keyword2 ?? '?'}</strong>
          <span>Beds</span>
        </div>
        <div style={styles.stat}>
          <strong>{property.LM_Dec_3 ?? '?'}</strong>
          <span>Baths</span>
        </div>
        <div style={styles.stat}>
          <strong>{property.LM_Int2_3
            ? Number(property.LM_Int2_3).toLocaleString()
            : '?'}</strong>
          <span>Sq Ft</span>
        </div>
        <div style={styles.stat}>
          <strong>{property.YearBuilt ?? '?'}</strong>
          <span>Year Built</span>
        </div>
      </div>

      {property.L_Remarks && (
        <div style={styles.section}>
          <h2>Description</h2>
          <p style={{ lineHeight: '1.6' }}>{property.L_Remarks}</p>
        </div>
      )}

      <div style={styles.section}>
        <h2>Property Details</h2>
        <div style={styles.detailsGrid}>
          <div><strong>Status:</strong> {property.L_Status ?? 'N/A'}</div>
          <div><strong>Type:</strong> {property.L_Type_ ?? 'N/A'}</div>
          <div><strong>Lot Size:</strong> {property.LotSizeAcres ? `${property.LotSizeAcres} acres` : 'N/A'}</div>
          <div><strong>Days on Market:</strong> {property.DaysOnMarket ?? 'N/A'}</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Location</h2>
        <PropertyMap
          lat={property.LMD_MP_Latitude}
          lng={property.LMD_MP_Longitude}
          address={`${property.L_Address}, ${property.L_City}, ${property.L_State}`}
        />
      </div>

      <div style={styles.section}>
        <h2>Open Houses</h2>
        <OpenHouseList openHouses={openHouses} />
      </div>
    </div>
  );
}

const styles = {
  backButton: {
    marginBottom: '20px',
    padding: '8px 16px',
    cursor: 'pointer',
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  header: { margin: '20px 0' },
  price: { fontSize: '32px', margin: '0 0 8px' },
  address: { fontSize: '18px', color: '#555', margin: 0 },
  stats: {
    display: 'flex',
    gap: '32px',
    padding: '20px 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    margin: '20px 0',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    fontSize: '18px',
  },
  section: { margin: '32px 0' },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    fontSize: '15px',
  },
};

export default PropertyDetailPage;