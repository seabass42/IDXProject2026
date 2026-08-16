import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchOpenHousesByDateRange } from '../api/client';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

function combineDateTime(dateStr, timeStr) {
  if (!dateStr) return new Date();
  const base = new Date(dateStr);
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':');
    base.setHours(parseInt(hours), parseInt(minutes), 0);
  }
  return base;
}

function OpenHouseCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString().split('T')[0];
        const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0)
          .toISOString().split('T')[0];

        const data = await fetchOpenHousesByDateRange(startDate, endDate);

        const mapped = data.map((oh) => {
          let title = oh.L_ListingID || 'Open House';
          try {
            const allData = JSON.parse(oh.all_data);
            if (allData.OpenHouseRemarks) {
              title = allData.OpenHouseRemarks.substring(0, 40);
            }
          } catch {
            // keep default title
          }

          return {
            id: oh.id,
            title,
            start: combineDateTime(oh.OpenHouseDate, oh.OH_StartTime),
            end: combineDateTime(oh.OpenHouseDate, oh.OH_EndTime),
            listingId: oh.L_ListingID,
          };
        });

        setEvents(mapped);
      } catch (err) {
        setError('Failed to load open houses.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSelectEvent(event) {
  try {
    const res = await fetch(`/api/properties/${event.listingId}`);
    if (res.status === 404) {
      alert('Property details are no longer available for this listing.');
      return;
    }
    navigate(`/property/${event.listingId}`);
  } catch (err) {
    alert('Unable to load property details.');
  }
}

  if (loading) return <p style={{ padding: '20px' }}>Loading calendar...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Open House Calendar</h1>
      <p style={{ color: '#555', marginBottom: '20px' }}>
        Click any event to view the property details.
      </p>
      <div style={{ height: '700px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}

export default OpenHouseCalendarPage;