import React from 'react';

function parseRemarks(allData) {
  try {
    const parsed = JSON.parse(allData);
    return parsed.OpenHouseRemarks || null;
  } catch {
    return null;
  }
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function OpenHouseList({ openHouses }) {
  if (!openHouses || openHouses.length === 0) {
    return <p style={{ color: '#999' }}>No open houses scheduled.</p>;
  }

  return (
    <div>
      {openHouses.map((oh) => {
        const remarks = parseRemarks(oh.all_data);
        return (
          <div key={oh.id} style={styles.card}>
            <p style={styles.date}>{formatDate(oh.OpenHouseDate)}</p>
            <p style={styles.time}>
              {formatTime(oh.OH_StartTime)} – {formatTime(oh.OH_EndTime)}
            </p>
            {remarks && (
              <p style={styles.remarks}>{remarks}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    background: '#fafafa',
  },
  date: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 4px',
  },
  time: {
    color: '#555',
    margin: '0 0 8px',
    fontSize: '14px',
  },
  remarks: {
    color: '#333',
    fontSize: '14px',
    margin: 0,
    lineHeight: '1.5',
  },
};

export default OpenHouseList;