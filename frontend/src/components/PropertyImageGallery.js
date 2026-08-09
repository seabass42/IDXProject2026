import React, { useState } from 'react';

function parsePhotos(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [];
  } catch {
    return [];
  }
}

function PropertyImageGallery({ photos }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = parsePhotos(photos);

  if (images.length === 0) {
    return (
      <div style={styles.noPhoto}>No photos available</div>
    );
  }

  function handleLightboxClose(e) {
    if (e.target === e.currentTarget) setLightboxOpen(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') setLightboxOpen(false);
    if (e.key === 'ArrowRight') setActiveIndex(i => (i + 1) % images.length);
    if (e.key === 'ArrowLeft') setActiveIndex(i => (i - 1 + images.length) % images.length);
  }

  return (
    <div>
      {/* Main image */}
      <img
        src={images[activeIndex]}
        alt={`property ${activeIndex + 1}`}
        style={styles.mainImage}
        onClick={() => setLightboxOpen(true)}
      />

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={styles.thumbnailStrip}>
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`thumbnail ${i + 1}`}
              style={{
                ...styles.thumbnail,
                border: i === activeIndex ? '2px solid #333' : '2px solid transparent',
              }}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={styles.lightboxOverlay}
          onClick={handleLightboxClose}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          ref={el => el && el.focus()}
        >
          <button
            style={styles.closeButton}
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          <button
            style={{ ...styles.arrowButton, left: '20px' }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(i => (i - 1 + images.length) % images.length);
            }}
          >
            ‹
          </button>
          <img
            src={images[activeIndex]}
            alt={`lightbox ${activeIndex + 1}`}
            style={styles.lightboxImage}
          />
          <button
            style={{ ...styles.arrowButton, right: '20px' }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(i => (i + 1) % images.length);
            }}
          >
            ›
          </button>
          <p style={styles.counter}>
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  mainImage: {
    width: '100%',
    height: '450px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  noPhoto: {
    width: '100%',
    height: '300px',
    background: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    borderRadius: '8px',
  },
  thumbnailStrip: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  thumbnail: {
    width: '80px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  lightboxOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    outline: 'none',
  },
  lightboxImage: {
    maxWidth: '90vw',
    maxHeight: '85vh',
    objectFit: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '32px',
    cursor: 'pointer',
  },
  arrowButton: {
    position: 'absolute',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    fontSize: '48px',
    cursor: 'pointer',
    borderRadius: '4px',
    padding: '0 12px',
  },
  counter: {
    position: 'absolute',
    bottom: '20px',
    color: '#fff',
    fontSize: '16px',
  },
};

export default PropertyImageGallery;