import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  // Format 0 as "00" if desired to match the screenshot "00 sale txns"
  const formattedCount = project.saleTxns === 0 ? '00' : project.saleTxns;

  return (
    <div 
      className="project-card"
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
        <h3 className="card-title">{project.name}</h3>
        <span className="badge-txns">{formattedCount} sale txns</span>
      </div>
      <ChevronRight size={18} className="card-chevron" />
    </div>
  );
}
