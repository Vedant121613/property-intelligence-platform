import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  FileText, 
  TrendingUp, 
  Wallet, 
  Home, 
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  ArrowRight
} from 'lucide-react';
import { CITIES, HOMEPAGE_RECENT_TRANSACTIONS, USER_BENEFITS } from '../data/mockData';
import CityMonumentCards from '../components/CityMonumentCards';

export default function HomePage({ onNavigate, currentCity, onSelectCity }) {
  const [selectedCity, setSelectedCity] = useState(currentCity || 'mumbai');
  const [searchVal, setSearchVal] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('transactions');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchVal.toLowerCase();
    if (query.includes('y square') || query.includes('thane')) {
      onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' });
    } else if (query.includes('saswad') || query.includes('pune') || query.includes('heera')) {
      onNavigate('locality', { cityId: 'pune', localityId: 'saswad-road' });
    } else {
      onNavigate('transactions', { projectId: 'y-square', cityId: selectedCity });
    }
  };

  const handleQuickChipClick = (term) => {
    setSearchVal(term);
    if (term.includes('Y Square') || term.includes('Thane')) {
      onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' });
    } else if (term.includes('Saswad')) {
      onNavigate('locality', { cityId: 'pune', localityId: 'saswad-road' });
    } else {
      onNavigate('city', { cityId: 'mumbai' });
    }
  };

  return (
    <div>
      {/* Sub-nav Tabs (Pureframe Custom Service Bar) */}
      <nav className="subnav-tabs-bar" aria-label="Services Sub-navigation">
        <div className="content-wrapper" style={{ display: 'flex', width: '100%', gap: '8px' }}>
          <div 
            className={`subnav-tab-item ${activeSubTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('transactions')}
          >
            <span>Deed Registry Data</span>
            <span className="badge-tag-orange">Live</span>
          </div>
          <div 
            className={`subnav-tab-item ${activeSubTab === 'buy' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('buy')}
          >
            Direct Verified Homes
          </div>
          <div 
            className={`subnav-tab-item ${activeSubTab === 'sell' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('sell')}
          >
            Sell with Valuation Assurance
          </div>
          <div 
            className={`subnav-tab-item ${activeSubTab === 'guarantee' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('guarantee')}
          >
            <span style={{ color: '#F05A28' }}>✦</span>
            <span>Fair Deal Guarantee</span>
          </div>
        </div>
      </nav>

      {/* Elevated Pureframe Hero Section */}
      <section className="home-hero-section">
        <div className="content-wrapper">
          
          {/* Distinctive Pureframe Header Pill */}
          <div className="hero-glow-badge">
            <Sparkles size={14} />
            <span>INDIA'S TRANSPARENT PROPERTY REGISTRY PLATFORM</span>
          </div>

          <h1 className="home-hero-title">
            Authentic Property Valuations.<br />
            Directly From Registered Deeds.
          </h1>
          <p className="home-hero-subtitle">
            Verify actual transaction values recorded at the Inspector General of Registration (IGR). Unbiased, unmanipulated, and free of broker inflation.
          </p>

          {/* Elevated Glass Search Box */}
          <form className="hero-search-box" onSubmit={handleSearchSubmit}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MapPin size={18} color="#F05A28" style={{ marginLeft: '12px' }} />
              <select 
                className="hero-city-select"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  onSelectCity(e.target.value);
                }}
                aria-label="City Selector"
              >
                {CITIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />

            <input 
              type="text"
              className="hero-search-input"
              placeholder="Search by Project, Township, or Locality (e.g. Y Square, Saswad Road)..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              aria-label="Search properties"
            />

            <button type="submit" className="hero-search-btn">
              Explore Deeds
            </button>
          </form>

          {/* Popular Fast Search Chips */}
          <div className="quick-search-chips">
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Popular Searches:</span>
            {['Y Square (Thane West)', 'Saswad Road (Pune)', 'Whitefield (Bangalore)', 'Bandra West (Mumbai)', 'Heera Solitaire'].map(chip => (
              <button
                key={chip}
                type="button"
                className="quick-chip"
                onClick={() => handleQuickChipClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Live Registry Metric Pulse Strip */}
          <div className="hero-pulse-strip">
            <div className="hero-pulse-item">
              <span className="hero-pulse-dot" />
              <span>1.4M+ Deeds Indexed</span>
            </div>
            <div className="hero-pulse-item">
              <span className="hero-pulse-dot" />
              <span>₹48,000 Cr+ Transacted Volume</span>
            </div>
            <div className="hero-pulse-item">
              <span className="hero-pulse-dot" />
              <span>Zero Broker Markups</span>
            </div>
            <div className="hero-pulse-item">
              <span className="hero-pulse-dot" />
              <span>100% IGR Verified</span>
            </div>
          </div>

          {/* Smarter Property Tools Powered by AI */}
          <div style={{ marginTop: '54px' }}>
            <div className="tools-section-title">
              Smarter Property Tools. Powered by AI
            </div>

            <div className="ai-tools-grid">
              <div 
                className="ai-tool-card"
                onClick={() => onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' })}
              >
                <div className="ai-tool-icon-wrap" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                  <Sparkles size={20} />
                </div>
                <div className="ai-tool-text">
                  <h4>Smart Negotiation Report</h4>
                  <p>See what others paid; negotiate with verified facts</p>
                </div>
                <ArrowUpRight size={18} color="#94A3B8" style={{ marginLeft: 'auto' }} />
              </div>

              <div 
                className="ai-tool-card"
                onClick={() => onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' })}
              >
                <div className="ai-tool-icon-wrap" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                  <MapPin size={20} />
                </div>
                <div className="ai-tool-text">
                  <h4>AI Unit Address Search</h4>
                  <p>Type &lt;Unit + Tower&gt; to see what it actually sold for</p>
                </div>
                <ArrowUpRight size={18} color="#94A3B8" style={{ marginLeft: 'auto' }} />
              </div>

              <div 
                className="ai-tool-card"
                onClick={() => onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' })}
              >
                <div className="ai-tool-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
                  <TrendingUp size={20} />
                </div>
                <div className="ai-tool-text">
                  <h4>Save on Home Loan EMI</h4>
                  <p>Match with verified bank interest rates down to 7.1%</p>
                </div>
                <ArrowUpRight size={18} color="#94A3B8" style={{ marginLeft: 'auto' }} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trending projects in Cities with Monument Cards (Screenshot 1) */}
      <CityMonumentCards 
        onSelectCity={onSelectCity}
        onNavigate={onNavigate}
      />

      {/* Aggregation Value Prop Section */}
      <section className="aggregation-banner">
        <div className="content-wrapper aggregation-content">
          <div className="aggregation-text" style={{ maxWidth: '600px' }}>
            <h2>We aggregate and organise publicly available property registration data.</h2>
            <p>
              Check registration data for property purchases, sales, and lease agreements all in one convenient place. Verified from state Inspector General of Registration (IGR) deed registries across Maharashtra, Karnataka, and Telangana.
            </p>
            <div className="aggregation-actions">
              <button 
                type="button" 
                className="btn-primary-orange-outline"
                onClick={() => onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' })}
              >
                View Sample Deeds
              </button>
              <button 
                type="button" 
                className="btn-secondary-white"
                onClick={() => onNavigate('locality', { cityId: 'pune', localityId: 'saswad-road' })}
              >
                Browse Pune Localities
              </button>
            </div>
          </div>

          {/* Deed Document Illustration Card */}
          <div 
            style={{
              background: '#FFFFFF',
              border: '1px solid #FDE68A',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 12px 30px rgba(217, 119, 6, 0.12)',
              width: '320px',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
            </div>
            <div 
              style={{
                height: '110px',
                background: '#FEF3C7',
                border: '1px dashed #D97706',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px'
              }}
            >
              <FileText size={32} color="#B45309" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E', marginTop: '6px' }}>
                GOVERNMENT REGISTRY DEED
              </span>
              <span style={{ fontSize: '0.65rem', color: '#78350F' }}>
                Department of Registration &amp; Stamps
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '12px' }}>
              Official Sale Deed • Authentic Stamp Act Record
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section: Pureframe vs Traditional Portals (Unique to Pureframe) */}
      <section className="comparison-section">
        <div className="content-wrapper">
          <div className="comparison-header">
            <h2>Why Smart Buyers Choose Pureframe</h2>
            <p>The difference between advertised broker quotes and actual registered transaction values</p>
          </div>

          <div className="comparison-cards-grid">
            {/* Traditional Portals */}
            <div className="comparison-box-card comparison-box-traditional">
              <span className="comp-badge-legacy">Traditional Listing Portals</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                Advertised Asking Prices
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Relies on broker quotes, unverified builder listings, and outdated asking estimates.
              </p>

              <ul className="comparison-feature-list">
                <li className="comp-feature-item">
                  <XCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#475569' }}>Inflated quoting prices up to 15-25% higher than actual deal price</span>
                </li>
                <li className="comp-feature-item">
                  <XCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#475569' }}>Unverified listings and duplicate broker advertisements</span>
                </li>
                <li className="comp-feature-item">
                  <XCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#475569' }}>Your phone number shared with dozens of aggressive agents</span>
                </li>
              </ul>
            </div>

            {/* Pureframe Platform */}
            <div className="comparison-box-card comparison-box-pureframe">
              <span className="comp-badge-pureframe">Pureframe Deed Intelligence</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                Actual Registered Sales Deeds
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Direct synchronization with official Sub-Registrar Office deeds and stamp records.
              </p>

              <ul className="comparison-feature-list">
                <li className="comp-feature-item">
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#F1F5F9' }}>100% verified registry transaction prices with exact floor and unit numbers</span>
                </li>
                <li className="comp-feature-item">
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#F1F5F9' }}>Accurate carpet area metrics without misleading super-built-up multipliers</span>
                </li>
                <li className="comp-feature-item">
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: '#F1F5F9' }}>Zero spam guarantee — transparent data access with free unlock privileges</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Registered Transactions */}
      <section className="recent-deeds-section">
        <div className="content-wrapper">
          <div className="recent-deeds-header">
            <h2>Recently Registered Transactions</h2>
            <p>Get access to 1 cr+ property transactions at your fingertips!</p>
          </div>

          <div className="recent-deeds-grid">
            {HOMEPAGE_RECENT_TRANSACTIONS.map((txn) => (
              <div 
                key={txn.id} 
                className="deed-card"
                onClick={() => onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' })}
              >
                <div>
                  <div className="deed-info-date">{txn.soldDate}</div>
                  <div className="deed-info-amount">{txn.amount}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '4px' }}>{txn.locality}</div>
                  <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>{txn.unit} • {txn.carpetArea}</div>
                </div>

                <div className="stamp-paper-thumb">
                  <span>IGR<br/>STAMP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Do You Benefit Section */}
      <section className="benefits-section">
        <div className="content-wrapper">
          <div className="benefits-header">
            <h2>How do you benefit</h2>
            <p>Pureframe empowers you to transact confidently, with complete peace of mind!</p>
          </div>

          <div className="benefits-grid">
            {USER_BENEFITS.map((b) => (
              <div key={b.id} className="benefit-card">
                <div className="benefit-icon-badge">
                  {b.id === 'buyers' && <Wallet size={24} />}
                  {b.id === 'sellers' && <TrendingUp size={24} />}
                  {b.id === 'owners' && <Home size={24} />}
                  {b.id === 'brokers' && <Users size={24} />}
                </div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
