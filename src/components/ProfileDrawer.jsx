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
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileDrawer({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onOpenAuth 
}) {
  const { user, isAuthenticated, logout, openAuthModal, freeAttemptsLeft, isPaymentDone } = useAuth();

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

  const handleOpenLogin = () => {
    onClose();
    if (onOpenAuth) onOpenAuth('signin');
    else openAuthModal('signin');
  };

  const handleOpenSignup = () => {
    onClose();
    if (onOpenAuth) onOpenAuth('signup');
    else openAuthModal('signup');
  };

  const handleLogout = () => {
    logout();
    onClose();
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
        {/* Drawer Header */}
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
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: isAuthenticated ? 'var(--brand-gradient)' : '#1E293B',
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
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                {isAuthenticated && user ? user.name : 'Welcome, Guest'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                {isAuthenticated && user 
                  ? (user.phone || user.email || 'Verified Member')
                  : 'Sign in to save your 3 free trials'}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              color: '#64748B', 
              background: 'none',
              border: 'none',
              padding: '6px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3 Free Trials Status Banner */}
        <div style={{ padding: '12px 20px', background: isPaymentDone ? '#EFF6FF' : '#F0FDF4', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', fontWeight: 700, color: isPaymentDone ? '#1D4ED8' : '#166534' }}>
              <Gift size={14} />
              <span>{isPaymentDone ? 'PRO Unlimited Access' : `${freeAttemptsLeft} of 3 Free Trials Left`}</span>
            </div>
            {!isPaymentDone && (
              <span style={{ fontSize: '0.7rem', color: '#15803D', fontWeight: 600 }}>
                {freeAttemptsLeft > 0 ? `${freeAttemptsLeft} Remaining` : 'Limit Reached'}
              </span>
            )}
          </div>

          {!isPaymentDone && (
            <div style={{ width: '100%', height: '5px', background: '#DCFCE7', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${(freeAttemptsLeft / 3) * 100}%`, 
                  height: '100%', 
                  background: freeAttemptsLeft > 1 ? '#10B981' : '#F59E0B',
                  borderRadius: '4px',
                  transition: 'width 0.3s'
                }} 
              />
            </div>
          )}
        </div>

        {/* Unauthenticated Quick Action Buttons */}
        {!isAuthenticated && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={handleOpenSignup}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'var(--brand-gradient)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Sparkles size={16} />
              <span>Create Account (3 Free Trials)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenLogin}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '8px',
                background: '#FFFFFF',
                color: '#1E293B',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <LogIn size={15} />
              <span>Sign In with Mobile</span>
            </button>
          </div>
        )}

        {/* Navigation Item List */}
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
            <span>Profile & Account</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('plans')}
          >
            <CreditCard size={18} color="#475569" />
            <span>Subscription Plans</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('favourites')}
          >
            <Heart size={18} color="#475569" />
            <span>Favourites & Watchlist</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('viewed')}
          >
            <FileText size={18} color="#475569" />
            <span>Unlocked Deeds History</span>
          </div>

          <div style={{ width: '100%', height: '1px', background: '#F1F5F9', margin: '8px 0' }} />

          <div 
            className="drawer-nav-item"
            onClick={() => { onClose(); onNavigate('home'); }}
          >
            <Info size={18} color="#64748B" />
            <span>About Pureframe</span>
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #FCA5A5',
                background: '#FEF2F2',
                color: '#DC2626',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out ({user?.name ? user.name.split(' ')[0] : 'User'})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenLogin}
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
              <LogIn size={16} />
              <span>Sign In to Pureframe</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
