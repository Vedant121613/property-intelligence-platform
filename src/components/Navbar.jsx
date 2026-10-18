import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  ChevronDown, 
  Heart, 
  User, 
  ArrowRight,
  X,
  LogOut,
  ShieldCheck,
  Unlock,
  Sparkles,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { CITIES } from '../data/mockData';
import { searchProperties } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import ProfileDrawer from './ProfileDrawer';

export default function Navbar({ 
  currentCity = 'pune', 
  onSelectCity, 
  onNavigate 
}) {
  const { user, isAuthenticated, logout, unlockedTxns, savedProperties, freeAttemptsLeft, isPaymentDone, openAuthModal } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ localities: [], projects: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const cityRef = useRef(null);
  const userMenuRef = useRef(null);

  const activeCityObj = CITIES.find(c => c.id === currentCity) || CITIES[0];

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ localities: [], projects: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProperties(searchQuery, currentCity);
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, currentCity]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        // Only close dropdown, keep search bar if desired, or let user close via X
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocality = (localityId) => {
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
    setSearchQuery('');
    onNavigate('locality', { cityId: currentCity, localityId });
  };

  const handleSelectProject = (projectId, localityId) => {
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
    setSearchQuery('');
    if (projectId === 'y-square') {
      onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' });
    } else {
      onNavigate('project', { cityId: currentCity, localityId, projectId });
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="content-wrapper navbar-inner">
          {/* Brand Logo with Pureframe Distinct Identity */}
          <div 
            className="navbar-brand" 
            onClick={() => onNavigate('home', {})}
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon-box">
              <Building2 size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-name">
                Pure<span>frame</span>
              </span>
              <span style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '-3px' }}>
                Deed Intelligence
              </span>
            </div>
          </div>

          {/* Global Search with City Picker */}
          <div className="navbar-search-container" ref={searchRef}>
            {/* City Selector */}
            <div className="city-picker-wrapper" style={{ position: 'relative' }} ref={cityRef}>
              <button 
                type="button"
                className="city-selector-btn"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                aria-label="Select City"
              >
                <MapPin size={15} color="#1D4ED8" />
                <span>{activeCityObj.name}</span>
                {activeCityObj.isUpcoming && (
                  <span style={{ fontSize: '0.65rem', background: '#FEF3C7', color: '#92400E', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                    Upcoming
                  </span>
                )}
                <ChevronDown size={14} color="#64748B" />
              </button>

              {showCityDropdown && (
                <div 
                  className="search-results-dropdown" 
                  style={{ width: '230px', top: '100%', left: 0, padding: '6px' }}
                >
                  <div className="search-group-title" style={{ padding: '6px 8px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Select Registry Metro
                  </div>
                  {CITIES.map(city => {
                    const isUpcoming = Boolean(city.isUpcoming);
                    return (
                      <div
                        key={city.id}
                        className={`search-item ${isUpcoming ? 'disabled-upcoming-item' : ''}`}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '8px',
                          background: city.id === currentCity ? '#EFF6FF' : 'transparent',
                          border: city.id === currentCity ? '1px solid #BFDBFE' : '1px solid transparent',
                          marginBottom: '4px',
                          cursor: isUpcoming ? 'not-allowed' : 'pointer',
                          opacity: isUpcoming ? 0.65 : 1
                        }}
                        onClick={(e) => {
                          if (isUpcoming) {
                            e.preventDefault();
                            e.stopPropagation();
                            return; // Mumbai cannot be selected
                          }
                          onSelectCity(city.id);
                          setShowCityDropdown(false);
                          onNavigate('city', { cityId: city.id });
                        }}
                        title={isUpcoming ? 'Mumbai is upcoming and cannot be selected yet' : `Switch to ${city.name}`}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="search-item-name" style={{ fontWeight: 700, color: isUpcoming ? '#64748B' : '#1E293B' }}>{city.name}</span>
                            {isUpcoming ? (
                              <span style={{ fontSize: '0.62rem', background: '#FEF3C7', color: '#92400E', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, border: '1px solid #FDE68A' }}>
                                Upcoming
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.62rem', background: '#DCFCE7', color: '#166534', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, border: '1px solid #BBF7D0' }}>
                                Live
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{city.state}</div>
                        </div>
                        <span className="search-item-sub" style={{ fontSize: '0.72rem', fontWeight: 500, color: isUpcoming ? '#B45309' : '#64748B' }}>
                          {isUpcoming ? 'Coming Soon' : `${city.totalLocalities} areas`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="search-divider" />

            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={16} color="#94A3B8" />
              <input 
                type="text"
                placeholder="Search Projects, Deeds or Localities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSearchDropdown(true);
                }}
                aria-label="Search Projects or Locality"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  style={{ color: '#94A3B8', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Autocomplete Results Dropdown */}
            {showSearchDropdown && (searchResults.localities.length > 0 || searchResults.projects.length > 0) && (
              <div className="search-results-dropdown">
                {searchResults.localities.length > 0 && (
                  <div>
                    <div className="search-group-title">Localities</div>
                    {searchResults.localities.slice(0, 5).map(loc => (
                      <div 
                        key={loc.id} 
                        className="search-item"
                        onClick={() => handleSelectLocality(loc.id)}
                      >
                        <div className="search-item-info">
                          <MapPin size={14} color="#64748B" />
                          <div>
                            <div className="search-item-name">Properties in {loc.name}</div>
                            <div className="search-item-sub">{loc.saleTxns} registered deed transactions</div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="#94A3B8" />
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.projects.length > 0 && (
                  <div>
                    <div className="search-group-title">Projects</div>
                    {searchResults.projects.slice(0, 5).map(proj => (
                      <div 
                        key={proj.id} 
                        className="search-item"
                        onClick={() => handleSelectProject(proj.id, 'saswad-road')}
                      >
                        <div className="search-item-info">
                          <Building2 size={14} color="#1D4ED8" />
                          <div>
                            <div className="search-item-name">{proj.name}</div>
                            <div className="search-item-sub">{proj.locality}, {proj.city}</div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="#94A3B8" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Navigation Actions */}
          <div className="navbar-actions">
            {/* Mobile Search Toggle Button (Visible only on mobile) */}
            <button 
              type="button" 
              className="navbar-action-btn mobile-search-toggle-btn"
              title="Search Localities & Projects"
              aria-label="Search Localities & Projects"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              {showMobileSearch ? <X size={19} color="#1D4ED8" /> : <Search size={19} />}
            </button>

            {/* Cart / Orders Button (Desktop Only) */}
            <button 
              type="button" 
              className="navbar-action-btn desktop-nav-only"
              title="Deed Agreements & Cart"
              aria-label="Deed Agreements & Cart"
              onClick={() => onNavigate('profile')}
            >
              <ShoppingCart size={19} />
            </button>

            {/* Viewed Transactions (Desktop Only) */}
            <button 
              type="button" 
              className="navbar-action-btn desktop-nav-only"
              title="Viewed Transactions"
              aria-label="Viewed Transactions"
              onClick={() => onNavigate('profile')}
            >
              <Eye size={19} />
              <span className="badge-counter">{unlockedTxns.length || 0}</span>
            </button>

            {/* Watchlist Button (Desktop Only) */}
            <button 
              type="button" 
              className="navbar-action-btn desktop-nav-only"
              title="Saved Watchlist"
              aria-label="Saved Watchlist"
              onClick={() => onNavigate('profile')}
            >
              <Heart size={19} />
              {savedProperties.length > 0 && (
                <span className="badge-counter">{savedProperties.length}</span>
              )}
            </button>
            
            {/* User Profile / Login Actions */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* 3 of 3 Attempts Tracker */}
                <div 
                  className="pro-badge-nav-chip"
                  onClick={() => onNavigate('profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: isPaymentDone ? '#EFF6FF' : '#ECFDF5',
                    border: isPaymentDone ? '1px solid #BFDBFE' : '1px solid #A7F3D0',
                    color: isPaymentDone ? '#1D4ED8' : '#047857',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                  title={isPaymentDone ? 'Pro Member' : `${freeAttemptsLeft} of 3 Free Attempts remaining`}
                >
                  <ShieldCheck size={13} />
                  <span>{isPaymentDone ? 'PRO' : `${freeAttemptsLeft}/3 Free`}</span>
                </div>

                <button 
                  type="button" 
                  className="user-profile-chip-btn"
                  onClick={() => setShowProfileDrawer(true)}
                  aria-label="User profile drawer"
                  title="Open User Profile"
                >
                  <div className="user-avatar-btn">
                    {user?.avatar || 'PF'}
                  </div>
                  <span className="user-profile-chip-name">{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
                  <ChevronDown size={14} color="#64748B" />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="desktop-nav-only"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#1E293B',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--brand-gradient)',
                    color: '#FFFFFF',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Sparkles size={13} />
                  <span>Sign Up (3 Free)</span>
                </button>

                {/* Mobile Drawer Trigger for Guests */}
                <button
                  type="button"
                  onClick={() => setShowProfileDrawer(true)}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#475569'
                  }}
                  aria-label="Open menu"
                >
                  <User size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Drawer */}
        {showMobileSearch && (
          <div className="mobile-search-dropdown-bar" ref={mobileSearchRef}>
            <div className="mobile-search-input-box">
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search Pune localities, deeds, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-label="Mobile property search"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} style={{ color: '#94A3B8', padding: '2px' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {(searchResults.localities.length > 0 || searchResults.projects.length > 0) && (
              <div className="mobile-search-results">
                {searchResults.localities.length > 0 && (
                  <div>
                    <div className="search-group-title">Localities</div>
                    {searchResults.localities.slice(0, 4).map(loc => (
                      <div 
                        key={loc.id} 
                        className="search-item"
                        onClick={() => handleSelectLocality(loc.id)}
                      >
                        <div className="search-item-info">
                          <MapPin size={14} color="#1D4ED8" />
                          <div>
                            <div className="search-item-name">{loc.name}</div>
                            <div className="search-item-sub">{loc.saleTxns} deeds</div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="#94A3B8" />
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.projects.length > 0 && (
                  <div>
                    <div className="search-group-title">Projects</div>
                    {searchResults.projects.slice(0, 4).map(proj => (
                      <div 
                        key={proj.id} 
                        className="search-item"
                        onClick={() => handleSelectProject(proj.id, 'saswad-road')}
                      >
                        <div className="search-item-info">
                          <Building2 size={14} color="#1D4ED8" />
                          <div>
                            <div className="search-item-name">{proj.name}</div>
                            <div className="search-item-sub">{proj.locality}</div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="#94A3B8" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Profile Slide-Over Drawer (Screenshot 4) */}
      <ProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
