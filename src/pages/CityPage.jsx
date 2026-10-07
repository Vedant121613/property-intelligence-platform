import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import LocalityCard from '../components/LocalityCard';
import { getCityLocalities } from '../services/propertyService';

export default function CityPage({ cityId = 'pune', onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState('all');

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

  if (loading || !data) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
        Loading localities in {cityId}...
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', target: { page: 'city', params: { cityId } } }
  ];

  return (
    <div>
      <HeroBanner
        breadcrumbs={breadcrumbs}
        title={`Trending Locations in ${data.city.name}`}
        countBadgeText={`${data.city.totalLocalities || data.totalCount} Localities`}
        subtitle="Based on # of sale registrations"
        currentDuration={duration}
        onDurationChange={(newDuration) => setDuration(newDuration)}
        onNavigate={onNavigate}
      />

      <main className="cards-section">
        <div className="content-wrapper">
          <div className="cards-grid-3">
            {data.localities.map((locality) => (
              <LocalityCard
                key={locality.id}
                locality={locality}
                onClick={() => onNavigate('locality', { cityId, localityId: locality.id })}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
