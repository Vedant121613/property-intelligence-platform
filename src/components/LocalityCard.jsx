import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function LocalityCard({ locality, onClick }) {
  return (
    <div 
      className="locality-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="card-content-left">
        <h3 className="card-title">Properties in {locality.name}</h3>
        <span className="badge-txns">{locality.saleTxns} sale txns</span>
      </div>
      <ChevronRight size={18} className="card-chevron" />
    </div>
  );
}
