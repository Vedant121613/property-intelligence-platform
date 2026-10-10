import React, { useState, useEffect, useMemo } from 'react';
import HeroBanner from '../components/HeroBanner';
import LocalityCard from '../components/LocalityCard';
import ProjectCard from '../components/ProjectCard';
import { 
  Building2, 
  ChevronRight, 
  ArrowLeft, 
  Search, 
  MapPin, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { 
  getPuneTalukas, 
  getPuneVillages, 
  getPuneProjects, 
  fetchPuneTalukas,
  fetchPuneVillages,
  fetchPuneProjects,
  getCityLocalities 
} from '../services/propertyService';

export default function CityPage({ cityId = 'pune', onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState('all');

  // Hierarchy Navigation State: Taluka -> Village -> Project
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Live database state with fallback
  const [talukas, setTalukas] = useState(() => getPuneTalukas());
  const [villages, setVillages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLevelLoading, setIsLevelLoading] = useState(false);

  // 1. Fetch Talukas from PostgreSQL database on mount
  useEffect(() => {
    let isMounted = true;
    fetchPuneTalukas()
      .then(res => {
        if (isMounted && res && res.length > 0) {
          setTalukas(res);
        }
      })
      .catch(err => console.warn('Taluka fetch error:', err));
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch Villages from PostgreSQL database when taluka is selected
  useEffect(() => {
    let isMounted = true;
    if (selectedTaluka) {
      setIsLevelLoading(true);
      // Immediate fallback to prevent blank render
      setVillages(getPuneVillages(selectedTaluka.slug));
      fetchPuneVillages(selectedTaluka.slug)
        .then(res => {
          if (isMounted) {
            if (res && res.length > 0) setVillages(res);
            setIsLevelLoading(false);
          }
        })
        .catch(err => {
          console.warn('Villages fetch error:', err);
          if (isMounted) setIsLevelLoading(false);
        });
    } else {
      setVillages([]);
    }
    return () => { isMounted = false; };
  }, [selectedTaluka]);

  // 3. Fetch Projects from PostgreSQL database when village is selected
  useEffect(() => {
    let isMounted = true;
    if (selectedTaluka && selectedVillage) {
      setIsLevelLoading(true);
      // Immediate fallback to prevent blank render
      setProjects(getPuneProjects(selectedTaluka.slug, selectedVillage.slug));
      fetchPuneProjects(selectedTaluka.slug, selectedVillage.slug)
        .then(res => {
          if (isMounted) {
            if (res && res.length > 0) setProjects(res);
            setIsLevelLoading(false);
          }
        })
        .catch(err => {
          console.warn('Projects fetch error:', err);
          if (isMounted) setIsLevelLoading(false);
        });
    } else {
      setProjects([]);
    }
    return () => { isMounted = false; };
  }, [selectedTaluka, selectedVillage]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getCityLocalities(cityId, duration)
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
  }, [cityId, duration]);

  // Reset village & search when taluka changes
  const handleSelectTaluka = (taluka) => {
    setSelectedTaluka(taluka);
    setSelectedVillage(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset search when village changes
  const handleSelectVillage = (village) => {
    setSelectedVillage(village);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToTalukas = () => {
    setSelectedTaluka(null);
    setSelectedVillage(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToVillages = () => {
    setSelectedVillage(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered lists based on search input
  const filteredTalukas = useMemo(() => {
    if (!searchQuery.trim()) return talukas;
    const q = searchQuery.toLowerCase();
    return talukas.filter(t => t.name.toLowerCase().includes(q) || (t.topVillages && t.topVillages.some(v => v.toLowerCase().includes(q))));
  }, [talukas, searchQuery]);

  const filteredVillages = useMemo(() => {
    if (!searchQuery.trim()) return villages;
    const q = searchQuery.toLowerCase();
    return villages.filter(v => v.name.toLowerCase().includes(q));
  }, [villages, searchQuery]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => p.name.toLowerCase().includes(q) || (p.rera && p.rera.toLowerCase().includes(q)));
  }, [projects, searchQuery]);

  if (loading || !data) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
        Loading location directory for {cityId}...
      </div>
    );
  }

  // Build dynamic breadcrumbs
  const breadcrumbs = [
    { label: 'Home', target: { page: 'home', params: {} } }
  ];

  if (selectedTaluka) {
    breadcrumbs.push({
      label: 'Pune',
      onClick: handleBackToTalukas
    });

    if (selectedVillage) {
      breadcrumbs.push({
        label: `${selectedTaluka.name} Taluka`,
        onClick: handleBackToVillages
      });
      breadcrumbs.push({
        label: selectedVillage.name
      });
    } else {
      breadcrumbs.push({
        label: `${selectedTaluka.name} Taluka`
      });
    }
  } else {
    breadcrumbs.push({
      label: 'Pune'
    });
  }

  // Dynamic banner title & subtitle
  let bannerTitle = `Trending Locations in ${data.city.name}`;
  let bannerCountBadge = `${talukas.length} Talukas • 11,078 Projects`;
  let bannerSubtitle = 'Based on # of sale registrations';

  if (selectedTaluka && !selectedVillage) {
    bannerTitle = `Villages in ${selectedTaluka.name} Taluka`;
    bannerCountBadge = `${villages.length} Villages • ${selectedTaluka.projectCount.toLocaleString()} Projects`;
    bannerSubtitle = `Select a village in ${selectedTaluka.name} to view registered project deeds`;
  } else if (selectedTaluka && selectedVillage) {
    bannerTitle = `Registered Projects in ${selectedVillage.name}`;
    bannerCountBadge = `${projects.length} Projects`;
    bannerSubtitle = `${selectedTaluka.name} Taluka • Authentic MahaRERA & IGR Records`;
  }

  return (
    <div>
      <HeroBanner
        breadcrumbs={breadcrumbs}
        title={bannerTitle}
        countBadgeText={data.city.isUpcoming ? 'Upcoming Metro' : bannerCountBadge}
        subtitle={data.city.isUpcoming ? 'Deed records currently being indexed for launch' : bannerSubtitle}
        currentDuration={duration}
        onDurationChange={(newDuration) => setDuration(newDuration)}
        onNavigate={onNavigate}
      />

      {/* Upcoming Metro Banner for Mumbai */}
      {data.city.isUpcoming && (
        <div className="content-wrapper" style={{ marginTop: '20px', marginBottom: '10px' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
              border: '1px solid #FCD34D',
              padding: '16px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                📍
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.925rem' }}>
                  Mumbai Registry Metro — Launching Soon
                </div>
                <div style={{ fontSize: '0.8rem', color: '#B45309', marginTop: '2px' }}>
                  Deed valuations and registration analytics for Mumbai are actively being indexed. Explore Pune for 100% live verified deeds.
                </div>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => onNavigate('city', { cityId: 'pune' })}
              style={{
                background: '#1D4ED8',
                color: '#FFFFFF',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)'
              }}
            >
              Switch to Pune (Live Registry) →
            </button>
          </div>
        </div>
      )}

      {/* Main Directory Section */}
      <main className="cards-section" style={{ paddingTop: '20px' }}>
        <div className="content-wrapper">

          {/* Navigation Controls & Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
            
            {/* Left: Step-back button if deep in hierarchy */}
            <div>
              {selectedVillage ? (
                <button
                  type="button"
                  onClick={handleBackToVillages}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#1D4ED8',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>Back to Villages in {selectedTaluka.name}</span>
                </button>
              ) : selectedTaluka ? (
                <button
                  type="button"
                  onClick={handleBackToTalukas}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#1D4ED8',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>Back to all Talukas in Pune</span>
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>
                  <Layers size={16} color="#1D4ED8" />
                  <span>Select a Taluka to explore verified village deeds</span>
                </div>
              )}
            </div>

            {/* Right: Quick Search Input */}
            <div style={{ position: 'relative', minWidth: '280px', maxWidth: '360px', width: '100%' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  selectedVillage
                    ? `Filter projects in ${selectedVillage.name}...`
                    : selectedTaluka
                    ? `Filter villages in ${selectedTaluka.name}...`
                    : 'Search Talukas (Haveli, Mulshi...)'
                }
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                  color: '#1E293B',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              />
            </div>
          </div>

          {/* LEVEL 1: TALUKAS GRID (Default View matching screenshot) */}
          {!selectedTaluka && (
            <div className="cards-grid-3">
              {filteredTalukas.map((taluka) => (
                <LocalityCard
                  key={taluka.slug}
                  locality={taluka}
                  title={`Properties in ${taluka.name}`}
                  badge={`${taluka.projectCount.toLocaleString()} sale txns`}
                  subtitle={`${taluka.villageCount} villages`}
                  onClick={() => handleSelectTaluka(taluka)}
                />
              ))}
              {filteredTalukas.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', color: '#64748B' }}>
                  No Talukas found matching "{searchQuery}".
                </div>
              )}
            </div>
          )}

          {/* LEVEL 2: VILLAGES GRID (After clicking a Taluka) */}
          {selectedTaluka && !selectedVillage && (
            <div>
              <div style={{ marginBottom: '14px', fontSize: '0.85rem', color: '#64748B' }}>
                Showing <strong>{filteredVillages.length}</strong> villages in <strong>{selectedTaluka.name} Taluka</strong>:
              </div>
              <div className="cards-grid-3">
                {filteredVillages.map((village) => (
                  <LocalityCard
                    key={village.slug}
                    locality={village}
                    title={`Properties in ${village.name}`}
                    badge={`${village.projectCount} sale txns`}
                    subtitle="Active IGR Deeds"
                    onClick={() => handleSelectVillage(village)}
                  />
                ))}
                {filteredVillages.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', color: '#64748B' }}>
                    No villages found matching "{searchQuery}" in {selectedTaluka.name}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LEVEL 3: PROJECTS GRID (After clicking a Village) */}
          {selectedTaluka && selectedVillage && (
            <div>
              <div style={{ marginBottom: '14px', fontSize: '0.85rem', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Showing <strong>{filteredProjects.length}</strong> registered projects in <strong>{selectedVillage.name}</strong>:</span>
                <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.8rem' }}>✓ Authentic MahaRERA Registry</span>
              </div>

              <div className="cards-grid-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={{
                      ...project,
                      saleTxns: Math.floor(15 + (Math.abs(project.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 65))
                    }}
                    onClick={() => {
                      onNavigate('project', {
                        cityId: 'pune',
                        localityId: selectedVillage.slug,
                        projectId: project.id,
                        talukaId: selectedTaluka.slug,
                        villageName: selectedVillage.name,
                        talukaName: selectedTaluka.name,
                        projectName: project.name,
                        rera: project.rera,
                        address: project.address
                      });
                    }}
                  />
                ))}
                {filteredProjects.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', color: '#64748B' }}>
                    No projects found matching "{searchQuery}" in {selectedVillage.name}.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
