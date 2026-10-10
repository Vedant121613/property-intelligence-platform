import React from 'react';
import { 
  X, 
  Home, 
  Tag, 
  ShoppingBag, 
  User, 
  Briefcase, 
  CreditCard, 
  Heart, 
  FileText, 
  Info, 
  LogOut,
  LogIn,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileDrawer({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onOpenAuth 
}) {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  const handleItemClick = (action) => {
    onClose();
    if (action === 'home') onNavigate('home');
    else if (action === 'profile') onNavigate('profile');
    else if (action === 'buy') onNavigate('city', { cityId: 'pune' });
    else if (action === 'sell') onNavigate('home');
    else if (action === 'plans') onNavigate('plans');
    else if (action === 'favourites') onNavigate('profile');
    else if (action === 'viewed') onNavigate('profile');
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        justifyContent: 'flex-end',
        padding: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 2500
      }}
    >
      <div 
        className="profile-slideover-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '320px',
          maxWidth: '85vw',
          height: '100vh',
          background: '#FFFFFF',
          boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s ease-out',
          overflowY: 'auto'
        }}
      >
        {/* Drawer Header (Screenshot 4) */}
        <div 
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#1E293B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              {isAuthenticated && user ? (user.avatar || 'PF') : <User size={20} />}
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
                {isAuthenticated && user ? user.name : 'Pureframe User'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {isAuthenticated && user ? user.role : 'Guest Member'}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              color: '#64748B', 
              padding: '6px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Item List (Screenshot 4) */}
        <div style={{ padding: '12px 0', flex: 1 }}>
          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('home')}
          >
            <Home size={18} color="#475569" />
            <span>Home</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('sell')}
          >
            <Tag size={18} color="#475569" />
            <span>Sell</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('buy')}
          >
            <ShoppingBag size={18} color="#475569" />
            <span>Buy</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('profile')}
          >
            <User size={18} color="#475569" />
            <span>Profile</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('profile')}
          >
            <Briefcase size={18} color="#475569" />
            <span>My Account</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('plans')}
          >
            <CreditCard size={18} color="#475569" />
            <span>Plans</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('favourites')}
          >
            <Heart size={18} color="#475569" />
            <span>Favourites</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('viewed')}
          >
            <FileText size={18} color="#475569" />
            <span>Viewed Transactions</span>
          </div>

          <div style={{ width: '100%', height: '1px', background: '#F1F5F9', margin: '8px 0' }} />

          <div 
            className="drawer-nav-item"
            onClick={() => { onClose(); onNavigate('home'); }}
          >
            <Info size={18} color="#64748B" />
            <span>About Us</span>
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          <button
            type="button"
            onClick={() => { onClose(); onNavigate('profile'); }}
            className="hero-search-btn"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <User size={16} />
            <span>View Full Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
