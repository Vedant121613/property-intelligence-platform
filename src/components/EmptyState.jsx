import React from 'react';
import { Package, Search } from 'lucide-react';

export default function EmptyState({ title = 'No Data found' }) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon-wrap" style={{ position: 'relative' }}>
        <Package size={30} strokeWidth={1.5} color="#94A3B8" />
        <div 
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: '#FFFFFF',
            borderRadius: '50%',
            padding: '2px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <Search size={12} color="#64748B" />
        </div>
      </div>
      <span className="empty-state-text">{title}</span>
    </div>
  );
}
