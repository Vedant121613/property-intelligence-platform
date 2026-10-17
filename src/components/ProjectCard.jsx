import React, { useState } from 'react';
import { ChevronRight, Lock, Unlock } from 'lucide-react';

export default function ProjectCard({ project, onClick, defaultUnlocked = false }) {
  const [unlocked, setUnlocked] = useState(defaultUnlocked);

  React.useEffect(() => {
    setUnlocked(defaultUnlocked);
  }, [defaultUnlocked]);

  const formattedCount = project.saleTxns === 0 
    ? '00' 
    : (project.saleTxns !== undefined ? project.saleTxns : 18);

  const getDisplayPrice = () => {
    if (project.lastSoldPrice && project.lastSoldPrice !== 'Rs. NaN Lac') {
      return project.lastSoldPrice.startsWith('₹') || project.lastSoldPrice.startsWith('Rs')
        ? project.lastSoldPrice
        : `₹ ${project.lastSoldPrice}`;
    }
    if (project.lastSold && project.lastSold.amount) {
      return project.lastSold.amount;
    }
    if (project.quotedPricing) {
      return project.quotedPricing.startsWith('₹') ? project.quotedPricing : `₹ ${project.quotedPricing}`;
    }
    if (project.avgPrice && !isNaN(project.avgPrice) && Number(project.avgPrice) > 0) {
      const avg = Number(project.avgPrice);
      return avg >= 10000000 
        ? `₹ ${(avg / 10000000).toFixed(2)} Cr`
        : `₹ ${(avg / 100000).toFixed(2)} Lac`;
    }
    return '₹ 45.00 Lac - 1.25 Cr';
  };

  const priceText = getDisplayPrice();

  const handleCardClick = (e) => {
    // If the click is on or inside the price toggle button, don't trigger card navigation!
    if (e.target.closest('.price-badge-interactive') || e.target.closest('button')) {
      return;
    }
    if (onClick) onClick();
  };

  return (
    <div 
      className="project-card"
      onClick={handleCardClick}
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
          
          <button
            type="button"
            className="price-badge-interactive"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setUnlocked(prev => !prev);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: unlocked ? '#0F766E' : '#B45309',
              background: unlocked ? '#F0FDFA' : '#FEF3C7',
              padding: '4px 9px',
              borderRadius: '6px',
              border: unlocked ? '1px solid #CCFBF1' : '1px solid #FDE68A',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={unlocked ? "Price unlocked (Click to lock)" : "Price locked (Click to unlock directly)"}
          >
            {unlocked ? <Unlock size={12} color="#0D9488" /> : <Lock size={12} color="#B45309" />}
            <span>{unlocked ? priceText : 'Unlock Price'}</span>
          </button>

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
