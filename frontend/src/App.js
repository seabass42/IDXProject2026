import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import OpenHouseCalendarPage from './pages/OpenHouseCalendarPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <a href="/" style={styles.navLink}>Property Listings</a>
        <a href="/calendar" style={styles.navLink}>Open House Calendar</a>
      </nav>
      <Routes>
        <Route path="/" element={<ErrorBoundary><ListingsPage /></ErrorBoundary>} />
        <Route path="/property/:id" element={<ErrorBoundary><PropertyDetailPage /></ErrorBoundary>} />
        <Route path="/calendar" element={<ErrorBoundary><OpenHouseCalendarPage /></ErrorBoundary>} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: 'flex',
    gap: '20px',
    padding: '12px 20px',
    background: '#333',
    alignItems: 'center',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
  },
};

export default App;