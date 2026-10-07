import React from 'react';
import { CITIES } from '../data/mockData';

export default function CityMonumentCards({ onSelectCity, onNavigate }) {
  const renderMonumentSvg = (monumentKey) => {
    switch (monumentKey) {
      case 'gateway-of-india': // Mumbai
        return (
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#2F6D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 56h40M16 56V26h32v30M24 56V34h16v22M12 26h40M18 26V18h28v8M28 18V12h8v6" />
            <path d="M26 34c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <rect x="20" y="20" width="4" height="4" />
            <rect x="40" y="20" width="4" height="4" />
          </svg>
        );
      case 'shaniwar-wada': // Pune
        return (
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#2F6D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 54h44M14 54V28h36v26M24 54V38h16v16M8 28h48l-4-10H12l-4 10z" />
            <path d="M20 18V12h24v6M26 38c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <circle cx="32" cy="23" r="2" />
          </svg>
        );
      case 'vidhana-soudha': // Bangalore
        return (
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#2F6D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 56h48M14 56V32h36v24M26 56V42h12v14M10 32h44M20 32V22h24v10M28 22c0-2.2 1.8-4 4-4s4 1.8 4 4" />
            <path d="M32 18V10M16 32V26M48 32V26" />
          </svg>
        );
      case 'charminar': // Hyderabad
        return (
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#2F6D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 56h36M18 56V16M46 56V16M22 56V34h20v22M22 34c0-5.5 4.5-10 10-10s10 4.5 10 10" />
            <path d="M16 16c0-2 2-4 4-4s4 2 4 4M40 16c0-2 2-4 4-4s4 2 4 4M18 10V6M46 10V6" />
          </svg>
        );
      case 'ripon-building': // Chennai
        return (
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#2F6D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 56h44M16 56V34h32v22M28 34V14l4-4 4 4v20M24 56V44h16v12" />
            <circle cx="32" cy="24" r="3" />
            <path d="M12 34h40" />
          </svg>
        );
      case 'noida-tower': // Noida
        return (
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#2F6D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 56h40M22 56V16l10-8 10 8v40M32 8v48M22 28h20M22 40h20" />
            <path d="M14 56V36h8v20M42 56V36h8v20" />
          </svg>
        );
      case 'india-gate': // Delhi
        return (
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#2F6D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 56h36M18 56V22h28v34M24 56V36h16v20M14 22h36M20 22V14h24v8" />
            <path d="M24 36c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        );
      case 'sidi-saiyyed': // Ahmedabad
        return (
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="#2F6D69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 56h44M14 56V26h36v30M24 56V38h16v18M10 26c0-6.6 5.4-12 12-12h20c6.6 0 12 5.4 12 12" />
            <path d="M26 38c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <circle cx="32" cy="22" r="3" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="trending-cities-section" style={{ padding: '40px 0 24px', background: '#FFFFFF' }}>
      <div className="content-wrapper">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B' }}>
            Trending projects in
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
            Based on # of sale registrations
          </p>
        </div>

        {/* 8 City Cards Row (Matches Screenshot 1) */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '14px',
            overflowX: 'auto',
            paddingBottom: '8px'
          }}
          className="city-monument-grid"
        >
          {CITIES.map((city) => (
            <div
              key={city.id}
              onClick={() => {
                if (onSelectCity) onSelectCity(city.id);
                onNavigate('city', { cityId: city.id });
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                userSelect: 'none'
              }}
              className="city-monument-item"
            >
              {/* Mint Green / Soft Aqua Monument Icon Box (Screenshot 1) */}
              <div 
                style={{
                  width: '100%',
                  aspectRatio: '1.05 / 1',
                  background: '#E6F3F1',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  border: '1px solid #D1EBE7',
                  transition: 'all 0.2s ease'
                }}
                className="monument-box"
              >
                {renderMonumentSvg(city.monument)}
              </div>

              <span 
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#334155',
                  textAlign: 'center'
                }}
              >
                {city.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
