import React from 'react';
import { CITIES } from '../data/mockData';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CityMonumentCards({ onSelectCity, onNavigate }) {
  const renderMonumentSvg = (monumentKey) => {
    switch (monumentKey) {
      case 'gateway-of-india': // Mumbai
        return (
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 56h40M16 56V26h32v30M24 56V34h16v22M12 26h40M18 26V18h28v8M28 18V12h8v6" />
            <path d="M26 34c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <rect x="20" y="20" width="4" height="4" />
            <rect x="40" y="20" width="4" height="4" />
          </svg>
        );
      case 'shaniwar-wada': // Pune
      default:
        return (
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 54h44M14 54V28h36v26M24 54V38h16v16M8 28h48l-4-10H12l-4 10z" />
            <path d="M20 18V12h24v6M26 38c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <circle cx="32" cy="23" r="2" />
          </svg>
        );
    }
  };

  return (
    <section className="trending-cities-section" style={{ padding: '36px 0 28px', background: '#FFFFFF' }}>
      <div className="content-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
              Active Coverage
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Deed Registry Metros
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px', margin: 0 }}>
              Direct Inspector General of Registration (IGR) property records & verified values
            </p>
          </div>
        </div>

        {/* 2 Focused City Cards: Pune (Live) & Mumbai (Upcoming) */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 360px))',
            gap: '18px'
          }}
          className="city-monument-grid"
        >
          {CITIES.map((city) => {
            const isUpcoming = Boolean(city.isUpcoming);

            return (
              <div
                key={city.id}
                onClick={(e) => {
                  if (isUpcoming) {
                    e.preventDefault();
                    return; // Mumbai cannot be selected
                  }
                  if (onSelectCity) onSelectCity(city.id);
                  onNavigate('city', { cityId: city.id });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  padding: '20px',
                  borderRadius: '16px',
                  background: isUpcoming 
                    ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' 
                    : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  border: isUpcoming ? '1px solid #FDE68A' : '1px solid #BFDBFE',
                  cursor: isUpcoming ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(30, 58, 138, 0.05)',
                  userSelect: 'none',
                  opacity: isUpcoming ? 0.85 : 1
                }}
                className="city-monument-card-item"
              >
                {/* Monument Icon Box */}
                <div 
                  style={{
                    width: '72px',
                    height: '72px',
                    flexShrink: 0,
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isUpcoming ? '1px solid #FCD34D' : '1px solid #93C5FD',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {renderMonumentSvg(city.monument)}
                </div>

                {/* City Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {city.name}
                    </h3>
                    {isUpcoming ? (
                      <span 
                        style={{
                          fontSize: '0.68rem',
                          background: '#FEF3C7',
                          color: '#B45309',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          border: '1px solid #FCD34D',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Sparkles size={11} />
                        Upcoming
                      </span>
                    ) : (
                      <span 
                        style={{
                          fontSize: '0.68rem',
                          background: '#DCFCE7',
                          color: '#15803D',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          border: '1px solid #86EFAC',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <CheckCircle2 size={11} />
                        Live Registry
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500, marginBottom: '8px' }}>
                    {isUpcoming ? 'Deed Indexing in Progress' : `${city.totalLocalities} Localities • ${city.totalProjects}+ Projects`}
                  </div>

                  <div 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: isUpcoming ? '#92400E' : '#1D4ED8'
                    }}
                  >
                    <span>{isUpcoming ? 'Launching Soon (Registry Pending)' : 'Explore Deeds'}</span>
                    {!isUpcoming && <ArrowRight size={13} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
