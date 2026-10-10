import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Unlock, 
  Heart, 
  FileText, 
  Bell, 
  ShieldCheck, 
  Edit3, 
  ArrowRight, 
  Download, 
  Trash2,
  CheckCircle2,
  Sparkles,
  Building2,
  CreditCard,
  RotateCcw,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Y_SQUARE_TRANSACTIONS, PROJECT_DETAILS, CITIES } from '../data/mockData';

export default function ProfilePage({ onNavigate }) {
  const { 
    user, 
    isAuthenticated, 
    logout, 
    updateProfile, 
    unlockedTxns, 
    savedProperties, 
    toggleSaveProperty,
    agreementOrders,
    freeAttemptsLeft, 
    freeAttemptsUsed, 
    isPaymentDone, 
    selectedPlan, 
    resetAttempts
  } = useAuth();

  const [activeTab, setActiveTab] = useState('unlocked');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editCity, setEditCity] = useState(user?.city || 'Pune');
  const [emailAlerts, setEmailAlerts] = useState(user?.emailNotifications ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.smsAlerts ?? true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      city: editCity,
      emailNotifications: emailAlerts,
      smsAlerts: smsAlerts
    });
    setIsEditing(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Find all unlocked transaction objects from mock DB
  const unlockedRecords = Y_SQUARE_TRANSACTIONS.filter(t => unlockedTxns.includes(t.id));

  // Find saved project objects
  const savedProjectsList = savedProperties.map(pId => {
    return PROJECT_DETAILS[pId] || {
      id: pId,
      name: pId === 'heera-solitaire' ? 'Heera Solitaire' : 'Y Square',
      locality: pId === 'heera-solitaire' ? 'Saswad Road' : 'Thane West',
      city: pId === 'heera-solitaire' ? 'Pune' : 'Mumbai',
      lastSold: { amount: pId === 'heera-solitaire' ? '₹42.50 Lac' : '₹56.09 Lac' }
    };
  });

  return (
    <div style={{ background: '#F8FAFC', minHeight: '85vh', padding: '36px 0 64px' }}>
      <div className="content-wrapper">
        
        {saveSuccessNotice && (
          <div 
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              padding: '12px 18px',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            <CheckCircle2 size={18} color="#16A34A" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Profile Header Card - Executive Royal Sapphire Navy Theme */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #0A1329 0%, #0F172A 50%, #1E3A8A 100%)',
            borderRadius: '24px',
            padding: '36px 40px',
            color: '#FFFFFF',
            boxShadow: '0 15px 35px -10px rgba(15, 23, 42, 0.25)',
            marginBottom: '28px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div 
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-60px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            
            {/* Avatar & User Details */}
            <div style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
              <div 
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.25)'
                }}
              >
                {user.avatar || 'PF'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>
                    {user.name}
                  </h1>
                  <span 
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34D399',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldCheck size={13} />
                    <span>Verified Member</span>
                  </span>
                  {isPaymentDone && (
                    <span 
                      style={{
                        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                        color: '#92400E',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={12} />
                      <span>{selectedPlan.toUpperCase()} PRO</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#94A3B8', fontSize: '0.85rem', marginTop: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#93C5FD" />
                    {user.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#93C5FD" />
                    {user.phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#93C5FD" />
                    {user.city || 'Pune'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onNavigate('plans')}
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29, 78, 216, 0.35)'
                }}
              >
                <CreditCard size={15} />
                <span>Subscription Plans</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={15} />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>

              <button
                type="button"
                onClick={() => { logout(); onNavigate('home'); }}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* 3 by 3 Attempts Tracker Banner & Quick Metrics */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}
        >
          {/* THE 3 BY 3 ATTEMPT TRACKER (VISIBLE ONLY WHEN LOGGED IN) */}
          <div 
            style={{
              background: '#FFFFFF',
              border: isPaymentDone ? '1px solid #BFDBFE' : '1px solid #A7F3D0',
              borderRadius: '16px',
              padding: '20px 22px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Deed Valuation Attempts
              </span>
              <span 
                style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  background: isPaymentDone ? '#EFF6FF' : '#DCFCE7', 
                  color: isPaymentDone ? '#1D4ED8' : '#15803D',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}
              >
                {isPaymentDone ? 'Paid Pro' : 'Free Trial'}
              </span>
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: isPaymentDone ? '#1D4ED8' : (freeAttemptsLeft > 0 ? '#059669' : '#DC2626') }}>
              {isPaymentDone ? 'UNLIMITED' : `${freeAttemptsLeft}/3 Free`}
            </div>

            {/* 3-Step Capsule Meter */}
            {!isPaymentDone && (
              <div style={{ display: 'flex', gap: '6px', margin: '10px 0 8px' }}>
                {[1, 2, 3].map((step) => {
                  const isAvailable = step <= freeAttemptsLeft;
                  return (
                    <div 
                      key={step} 
                      style={{
                        flex: 1,
                        height: '7px',
                        borderRadius: '4px',
                        background: isAvailable ? '#10B981' : '#CBD5E1',
                        transition: 'background 0.3s ease'
                      }}
                      title={isAvailable ? `Attempt ${step} Available` : `Attempt ${step} Used`}
                    />
                  );
                })}
              </div>
            )}

            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
              {isPaymentDone 
                ? 'Unlimited official deed unlocks enabled'
                : (freeAttemptsLeft > 0 
                  ? `${freeAttemptsLeft} of 3 free deed valuations remaining` 
                  : 'Free limit reached (3/3 used). Upgrade for unlimited unlocks.')}
            </div>
          </div>

          {/* Metric 2: Unlocked Deeds */}
          <div 
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px 22px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Unlocked Deeds
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
              {unlockedTxns.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
              Full government deed valuations recorded
            </div>
          </div>

          {/* Metric 3: Saved Watchlist */}
          <div 
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px 22px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Saved Properties
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
              {savedProperties.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
              Projects on your price watch monitor
            </div>
          </div>

          {/* Metric 4: Certified Agreement Orders */}
          <div 
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px 22px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Certified Orders
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
              {agreementOrders.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
              Official deed copies ready to download
            </div>
          </div>
        </div>

        {/* Inline Edit Profile Card */}
        {isEditing && (
          <form 
            onSubmit={handleProfileSave}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '28px',
              marginBottom: '28px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '18px' }}>
              Edit Profile Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  City
                </label>
                <select
                  value={editCity}
                  onChange={(e) => {
                    if (e.target.value === 'Mumbai') return;
                    setEditCity(e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    background: '#fff'
                  }}
                >
                  {CITIES.map(c => (
                    <option key={c.id} value={c.name} disabled={c.isUpcoming}>
                      {c.name} {c.isUpcoming ? '(Upcoming - Unavailable)' : '(Live)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  style={{ accentColor: '#1D4ED8' }} 
                />
                <span>Email alerts on newly registered deeds</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={smsAlerts} 
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  style={{ accentColor: '#1D4ED8' }} 
                />
                <span>Instant SMS notifications for price updates</span>
              </label>
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#1D4ED8',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Save Profile
            </button>
          </form>
        )}

        {/* Navigation Tabs */}
        <div 
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid #E2E8F0',
            marginBottom: '28px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('unlocked')}
            style={{
              padding: '12px 20px',
              fontSize: '0.925rem',
              fontWeight: 700,
              color: activeTab === 'unlocked' ? '#1D4ED8' : '#64748B',
              borderBottom: activeTab === 'unlocked' ? '3px solid #1D4ED8' : '3px solid transparent',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Unlock size={17} />
            <span>Unlocked Deeds ({unlockedTxns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '12px 20px',
              fontSize: '0.925rem',
              fontWeight: 700,
              color: activeTab === 'saved' ? '#1D4ED8' : '#64748B',
              borderBottom: activeTab === 'saved' ? '3px solid #1D4ED8' : '3px solid transparent',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Heart size={17} />
            <span>Saved Watchlist ({savedProperties.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 20px',
              fontSize: '0.925rem',
              fontWeight: 700,
              color: activeTab === 'orders' ? '#1D4ED8' : '#64748B',
              borderBottom: activeTab === 'orders' ? '3px solid #1D4ED8' : '3px solid transparent',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <FileText size={17} />
            <span>Certified Agreements ({agreementOrders.length})</span>
          </button>
        </div>

        {/* Tab 1: Unlocked Transactions */}
        {activeTab === 'unlocked' && (
          <div>
            {unlockedRecords.length > 0 ? (
              <div 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    Government Deed Valuations Unlocked
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', margin: 0 }}>
                    These records have been unlocked under your account with authentic IGR registered specs.
                  </p>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Project &amp; Locality</th>
                        <th>Type</th>
                        <th>Floor, Tower</th>
                        <th>Unit</th>
                        <th>Registered Deed Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unlockedRecords.map((txn) => (
                        <tr key={txn.id}>
                          <td>{txn.date}</td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#1E293B' }}>{txn.project}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{txn.locality}</div>
                          </td>
                          <td>
                            <span className="sale-pill">{txn.type}</span>
                          </td>
                          <td>{txn.floorTower}</td>
                          <td style={{ fontWeight: 800 }}>{txn.unit}</td>
                          <td>
                            <span style={{ fontWeight: 800, color: '#15803D', fontSize: '0.95rem' }}>
                              {txn.displayAmount}
                            </span>
                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                              Exact: {txn.exactAmount}
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => onNavigate('details', { transactionId: txn.id })}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#0284C7',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <span>View Specs</span>
                              <ArrowRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Lock size={26} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>No Unlocked Deeds Yet</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 20px' }}>
                  Explore verified transactions in Pune and unlock actual registered deed prices using your 3 free attempts!
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('locality', { cityId: 'pune', localityId: 'saswad-road' })}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#1D4ED8',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Explore Pune Registered Deeds
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Watchlist */}
        {activeTab === 'saved' && (
          <div>
            {savedProjectsList.length > 0 ? (
              <div className="cards-grid-3">
                {savedProjectsList.map((p) => (
                  <div 
                    key={p.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div 
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: '#EFF6FF',
                              color: '#1D4ED8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Building2 size={20} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{p.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0' }}>{p.locality}, {p.city}</p>
                          </div>
                        </div>

                        <button 
                          type="button"
                          onClick={() => toggleSaveProperty(p.id)}
                          style={{ color: '#EF4444', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                          title="Remove from saved"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ marginTop: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.725rem', color: '#64748B' }}>Latest Registered Sale:</span>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
                          {p.lastSold?.amount || '₹ 42.50 Lac'}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => onNavigate('project', { cityId: 'pune', localityId: 'saswad-road', projectId: p.id })}
                        style={{
                          width: '100%',
                          padding: '9px',
                          background: '#1D4ED8',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          textAlign: 'center',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        View Project Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Heart size={26} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>Your Watchlist is Empty</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 20px' }}>
                  Save projects you are interested in to monitor price trends and new sale deed registrations.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('city', { cityId: 'pune' })}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#1D4ED8',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Browse Pune Projects
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Agreement Orders */}
        {activeTab === 'orders' && (
          <div 
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Certified Agreement Copies
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', margin: 0 }}>
                Certified deed agreements retrieved directly from the state stamp and registry archives.
              </p>
            </div>

            {agreementOrders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {agreementOrders.map((order) => (
                  <div 
                    key={order.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>{order.id}</span>
                        <span 
                          style={{
                            background: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            color: '#059669',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginTop: '4px', margin: 0 }}>
                        {order.projectName} • Unit {order.unitNo}
                      </h4>
                      <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '2px 0 0' }}>{order.locality} • Ordered {order.date}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>{order.price}</span>
                      <button
                        type="button"
                        style={{
                          background: '#0F172A',
                          color: '#FFFFFF',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={14} />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748B' }}>
                <FileText size={32} style={{ margin: '0 auto 8px', display: 'block', color: '#94A3B8' }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No certified agreements ordered yet.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
