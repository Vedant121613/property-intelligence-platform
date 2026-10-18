import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import ProjectCard from '../components/ProjectCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLocalityProjects } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';

export default function LocalityPage({
  cityId = 'pune',
  localityId = 'saswad-road',
  onNavigate
}) {
  const { isAuthenticated, openAuthModal, isPaymentDone } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState('12m');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getLocalityProjects(cityId, localityId, duration)
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [cityId, localityId, duration]);

  if (loading || !data) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
        Loading projects in {localityId}...
      </div>
    );
  }

  const cityName = cityId.charAt(0).toUpperCase() + cityId.slice(1);
  const breadcrumbs = [
    { label: 'Home', target: { page: 'city', params: { cityId } } },
    { label: cityName, target: { page: 'city', params: { cityId } } }
  ];

  const [unlockAllPrices, setUnlockAllPrices] = useState(false);

  return (
    <div>
      <HeroBanner
        breadcrumbs={breadcrumbs}
        title={`Trending projects in ${data.localityName}`}
        countBadgeText={`${data.totalProjects} projects`}
        subtitle="Based on # of sale registrations"
        currentDuration={duration}
        onDurationChange={(newDuration) => setDuration(newDuration)}
        onNavigate={onNavigate}
      />

      <main className="cards-section">
        <div className="content-wrapper">
          {/* Quick Toolbar for Unlocks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>
              Showing {data.projects.length} verified projects in {data.localityName}
            </span>
            <button
              type="button"
              onClick={() => {
                if (isPaymentDone) {
                  setUnlockAllPrices(prev => !prev);
                  return;
                }
                if (!isAuthenticated) {
                  openAuthModal('signup');
                  return;
                }
                onNavigate('plans');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 700,
                background: unlockAllPrices ? '#0F766E' : '#EFF6FF',
                color: unlockAllPrices ? '#FFFFFF' : '#1D4ED8',
                border: unlockAllPrices ? '1px solid #0F766E' : '1px solid #BFDBFE',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{unlockAllPrices ? '🔒 Lock Prices' : '⚡ Unlock All Prices (Unlimited)'}</span>
            </button>
          </div>

          {/* Projects Grid */}
          <div className="cards-grid-3">
            {data.projects.map((project) => (
              <ProjectCard
                key={`${project.id}-${unlockAllPrices}`}
                project={project}
                defaultUnlocked={unlockAllPrices}
                onClick={() => onNavigate('project', { 
                  cityId, 
                  localityId, 
                  projectId: project.id 
                })}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <button 
              type="button" 
              className="page-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span className="page-number-active">{currentPage}</span>

            <button 
              type="button" 
              className="page-btn"
              disabled={true}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
