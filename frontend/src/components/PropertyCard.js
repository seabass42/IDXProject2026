import React from 'react';

function parsePhotos(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [];
  } catch {
    return [];
  }
}

function PropertyCard({ property }) {
  const photos = parsePhotos(property.L_Photos);
  const firstPhoto = photos[0] || null;

  return (
    <div style={styles.card}>
      {firstPhoto ? (
        <img src={firstPhoto} alt="property" style={styles.image} />
      ) : (
        <div style={styles.noImage}>No Photo</div>
      )}
      <div style={styles.info}>
        <p style={styles.price}>
          {property.L_SystemPrice
            ? `$${Number(property.L_SystemPrice).toLocaleString()}`
            : 'Price unavailable'}
        </p>
        <p style={styles.address}>{property.L_Address}</p>
        <p style={styles.city}>{property.L_City}, {property.L_State}</p>
        <p style={styles.details}>
          {property.L_Keyword2 ?? '?'} beds &bull;{' '}
          {property.LM_Dec_3 ?? '?'} baths &bull;{' '}
          {property.LM_Int2_3 ? `${Number(property.LM_Int2_3).toLocaleString()} sqft` : '? sqft'}
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    background: '#fff',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  noImage: {
    width: '100%',
    height: '200px',
    background: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
  },
  info: { padding: '12px' },
  price: { fontWeight: 'bold', fontSize: '18px', margin: '0 0 4px' },
  address: { margin: '0 0 4px', fontSize: '14px' },
  city: { margin: '0 0 4px', fontSize: '14px', color: '#555' },
  details: { margin: 0, fontSize: '13px', color: '#777' },
};

export default PropertyCard;