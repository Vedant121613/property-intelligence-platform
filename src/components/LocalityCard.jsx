import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function LocalityCard({ locality, title, badge, subtitle, onClick }) {
  const displayTitle = title || `Properties in ${locality?.name || 'Area'}`;
  
  let displayBadge = badge;
  if (!displayBadge) {
    if (locality?.projectCount !== undefined) {
      displayBadge = `${locality.projectCount.toLocaleString()} sale txns`;
    } else if (locality?.saleTxns !== undefined) {
      displayBadge = `${locality.saleTxns} sale txns`;
    } else {
      displayBadge = 'Active Deeds';
    }
  }

  const displaySubtitle = subtitle || (locality?.villageCount ? `${locality.villageCount} villages` : null);

  return (
    <div 
      className="locality-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
    >
      <div className="card-content-left">
        <h3 className="card-title">{displayTitle}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
          <span className="badge-txns">{displayBadge}</span>
          {displaySubtitle && (
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
              • {displaySubtitle}
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={18} className="card-chevron" />
    </div>
  );
}
