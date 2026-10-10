import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const formattedCount = project.saleTxns === 0 
    ? '00' 
    : (project.saleTxns !== undefined ? project.saleTxns : 18);

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
