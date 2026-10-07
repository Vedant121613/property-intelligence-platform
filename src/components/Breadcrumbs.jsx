import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [], onNavigate, light = false }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span style={{ opacity: 0.6 }}>/</span>}
            {isLast ? (
              <span style={{ fontWeight: 600, color: light ? '#FFFFFF' : 'inherit' }}>
                {item.label}
              </span>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.target) {
                    onNavigate(item.target.page, item.target.params);
                  }
                }}
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
