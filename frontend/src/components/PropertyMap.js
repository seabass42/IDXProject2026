import React from 'react';

function PropertyMap({ lat, lng, address }) {
  if (!lat || !lng || lat === 0 || lng === 0) {
    return <p style={{ color: '#999' }}>Map not available for this property.</p>;
  }

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div>
      <iframe
        title="Property Map"
        src={src}
        width="100%"
        height="400"
        style={{ border: 0, borderRadius: '8px' }}
        allowFullScreen
        loading="lazy"
      />
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', marginTop: '8px', color: '#333' }}
      >
        Get Directions →
      </a>
    </div>
  );
}

export default PropertyMap;