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
import AuthModal from './AuthModal';
import ProfileDrawer from './ProfileDrawer';

export default function Navbar({ 
  currentCity = 'mumbai', 
  onSelectCity, 
  onNavigate 
}) {
  const { user, isAuthenticated, logout, unlockedTxns, savedProperties } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ localities: [], projects: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const searchRef = useRef(null);
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
    setSearchQuery('');
    onNavigate('locality', { cityId: currentCity, localityId });
  };

  const handleSelectProject = (projectId, localityId) => {
    setShowSearchDropdown(false);
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
                <MapPin size={15} color="#F05A28" />
                <span>{activeCityObj.name}</span>
                <ChevronDown size={14} color="#64748B" />
              </button>

              {showCityDropdown && (
                <div 
                  className="search-results-dropdown" 
                  style={{ width: '210px', top: '100%', left: 0 }}
                >
                  <div className="search-group-title">Select Registry Metro</div>
                  {CITIES.map(city => (
                    <div
                      key={city.id}
                      className="search-item"
                      onClick={() => {
                        onSelectCity(city.id);
                        setShowCityDropdown(false);
                        onNavigate('city', { cityId: city.id });
                      }}
                    >
                      <div>
                        <span className="search-item-name">{city.name}</span>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{city.state}</div>
                      </div>
                      <span className="search-item-sub">{city.totalLocalities} areas</span>
                    </div>
                  ))}
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
                          <Building2 size={14} color="#F05A28" />
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

          {/* Right Navigation Actions (Matching Screenshots 2, 3, 4) */}
          <div className="navbar-actions">
            {/* Cart / Orders Button */}
            <button 
              type="button" 
              className="navbar-action-btn"
              title="Deed Agreements & Cart"
              aria-label="Deed Agreements & Cart"
              onClick={() => onNavigate('profile')}
            >
              <ShoppingCart size={19} />
            </button>

            {/* Viewed Transactions (Eye Icon with count badge) */}
            <button 
              type="button" 
              className="navbar-action-btn"
              title="Viewed Transactions"
              aria-label="Viewed Transactions"
              onClick={() => onNavigate('profile')}
            >
              <Eye size={19} />
              <span className="badge-counter">{unlockedTxns.length || 0}</span>
            </button>

            {/* Watchlist Button */}
            <button 
              type="button" 
              className="navbar-action-btn"
              title="Saved Watchlist"
              aria-label="Saved Watchlist"
              onClick={() => onNavigate('profile')}
            >
              <Heart size={19} />
              {savedProperties.length > 0 && (
                <span className="badge-counter">{savedProperties.length}</span>
              )}
            </button>
            
            {/* User Profile Avatar Button (Opens Slide-over Drawer - Screenshot 4) */}
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  type="button" 
                  className="user-profile-chip-btn"
                  onClick={() => setShowProfileDrawer(true)}
                  aria-label="User profile drawer"
                  title="Open User Profile"
                >
                  <div className="user-avatar-btn">
                    {user.avatar || 'PF'}
                  </div>
                  <span className="user-profile-chip-name">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} color="#64748B" />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="user-avatar-btn"
                  style={{ cursor: 'pointer', border: 'none' }}
                  onClick={() => setShowProfileDrawer(true)}
                  title="User Profile Menu"
                  aria-label="User Profile Menu"
                >
                  <User size={18} />
                </button>
                <button
                  type="button"
                  className="signin-nav-btn"
                  onClick={() => onNavigate('signin')}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Slide-Over Drawer (Screenshot 4) */}
      <ProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        onNavigate={onNavigate}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
