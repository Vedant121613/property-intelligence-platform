import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import ProjectCard from '../components/ProjectCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLocalityProjects } from '../services/propertyService';

export default function LocalityPage({
  cityId = 'pune',
  localityId = 'saswad-road',
  onNavigate
}) {
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
          {/* Projects Grid */}
          <div className="cards-grid-3">
            {data.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
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
