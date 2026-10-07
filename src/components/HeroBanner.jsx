import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Calendar, Info } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { DURATION_FILTERS } from '../data/mockData';

export default function HeroBanner({
  breadcrumbs = [],
  title,
  countBadgeText,
  subtitle = 'Based on # of sale registrations',
  currentDuration = 'all',
  onDurationChange,
  onNavigate
}) {
  const [showDurationMenu, setShowDurationMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const durationRef = useRef(null);

  const activeDurationObj = DURATION_FILTERS.find(d => d.id === currentDuration) || DURATION_FILTERS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (durationRef.current && !durationRef.current.contains(event.target)) {
        setShowDurationMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="hero-banner">
      <div className="content-wrapper">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} light={true} />

        <div className="banner-row">
          <div className="banner-left">
            <div className="banner-icon-badge">
              <Building2 size={24} />
            </div>

            <div className="banner-title-area">
              <div className="banner-title-row">
                <h1 className="banner-title">
                  {title}
                  <ChevronDown size={18} style={{ opacity: 0.8 }} />
                </h1>
                {countBadgeText && (
                  <span className="banner-count-badge">
                    {countBadgeText}
                  </span>
                )}
              </div>
              <p className="banner-subtitle">{subtitle}</p>
            </div>
          </div>

          <div className="banner-right-controls">
            {/* Info Tooltip Button */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="info-tooltip-btn"
                title="About this data"
                onClick={() => setShowTooltip(!showTooltip)}
                aria-label="Transaction methodology info"
              >
                <Info size={18} />
              </button>
              {showTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '260px',
                    background: '#FFFFFF',
                    color: '#1E293B',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    fontSize: '0.8rem',
                    zIndex: 60,
                    lineHeight: 1.4
                  }}
                >
                  <strong>Government Registration Data:</strong> Counts reflect registered property deed sales recorded at the Inspector General of Registration (IGR).
                </div>
              )}
            </div>

            {/* Duration Filter Dropdown */}
            <div style={{ position: 'relative' }} ref={durationRef}>
              <button
                type="button"
                className="filter-dropdown-btn"
                onClick={() => setShowDurationMenu(!showDurationMenu)}
                aria-label="Filter transaction duration"
              >
                <Calendar size={15} color="#CF5C36" />
                <span>{activeDurationObj.label}</span>
                <ChevronDown size={14} color="#64748B" />
              </button>

              {showDurationMenu && (
                <div
                  className="search-results-dropdown"
                  style={{ width: '160px', right: 0, left: 'auto', top: 'calc(100% + 4px)' }}
                >
                  <div className="search-group-title">Filter by Period</div>
                  {DURATION_FILTERS.map(f => (
                    <div
                      key={f.id}
                      className="search-item"
                      style={{
                        fontWeight: f.id === currentDuration ? '600' : 'normal',
                        color: f.id === currentDuration ? '#CF5C36' : 'inherit'
                      }}
                      onClick={() => {
                        if (onDurationChange) onDurationChange(f.id);
                        setShowDurationMenu(false);
                      }}
                    >
                      <span className="search-item-name">{f.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
