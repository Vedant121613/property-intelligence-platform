import React from 'react';
import { 
  Home, 
  MapPin, 
  FileText, 
  Heart, 
  User, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav({ currentRoute = 'home', onNavigate }) {
  const { savedProperties, unlockedTxns, user, isAuthenticated } = useAuth();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      page: 'home',
      params: {}
    },
    {
      id: 'city',
      label: 'Explore',
      icon: MapPin,
      page: 'city',
      params: { cityId: 'pune' }
    },
    {
      id: 'transactions',
      label: 'Deeds',
      icon: FileText,
      page: 'transactions',
      params: { projectId: 'y-square', cityId: 'mumbai' },
      badge: unlockedTxns?.length > 0 ? unlockedTxns.length : null
    },
    {
      id: 'watchlist',
      label: 'Saved',
      icon: Heart,
      page: 'profile',
      params: {},
      badge: savedProperties?.length > 0 ? savedProperties.length : null
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      page: 'profile',
      params: {}
    }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation Bar">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            currentRoute === item.page || 
            (item.id === 'watchlist' && currentRoute === 'profile') ||
            (item.id === 'city' && (currentRoute === 'locality' || currentRoute === 'project'));

          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.page, item.params)}
              aria-label={item.label}
            >
              <div className="mobile-nav-icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
                {item.badge != null && item.badge > 0 && (
                  <span className="mobile-nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
