import React, { useState } from 'react';
import { ChevronRight, Lock, Unlock } from 'lucide-react';

export default function ProjectCard({ project, onClick, defaultUnlocked = false }) {
  const [unlocked, setUnlocked] = useState(defaultUnlocked);

  const formattedCount = project.saleTxns === 0 
    ? '00' 
    : (project.saleTxns !== undefined ? project.saleTxns : 18);

  const hasPrice = Boolean(project.lastSoldPrice || project.quotedPricing);
  const priceText = project.lastSoldPrice ? `Last Sold: ${project.lastSoldPrice}` : project.quotedPricing;

  return (
    <div 
      className="project-card"
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
        <h3 className="card-title" style={{ fontSize: '1.025rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
          {project.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge-txns">{formattedCount} sale txns</span>
          
          {hasPrice && (
            unlocked ? (
              <span style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.8rem', 
                fontWeight: 700, 
                color: '#0F766E', 
                background: '#F0FDFA', 
                padding: '3px 8px', 
                borderRadius: '6px',
                border: '1px solid #CCFBF1'
              }}>
                <Unlock size={12} color="#0D9488" />
                <span>{priceText}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUnlocked(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#B45309',
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Click to unlock price (Unlimited)"
              >
                <Lock size={12} color="#B45309" />
                <span>Unlock Price</span>
              </button>
            )
          )}

          {project.rera && (
            <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>
              • {project.rera}
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={18} className="card-chevron" />
    </div>
  );
}
