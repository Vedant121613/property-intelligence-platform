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
  ExternalLink,
  CreditCard,
  Database
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
  const [editCity, setEditCity] = useState(user?.city || 'Mumbai');
  const [emailAlerts, setEmailAlerts] = useState(user?.emailNotifications ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.smsAlerts ?? true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="content-wrapper" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div 
          style={{
            maxWidth: '460px',
            margin: '0 auto',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FFF3EB',
              color: '#F05A28',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}
          >
            <User size={30} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
            Sign In to View Your Profile
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '24px' }}>
            Access your unlocked registered transactions, saved property watchlist, and certified agreement orders.
          </p>
          <button
            type="button"
            className="hero-search-btn"
            style={{ width: '100%', padding: '12px' }}
            onClick={() => onNavigate('home')}
          >
            Return to Homepage &amp; Sign In
          </button>
        </div>
      </div>
    );
  }

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
      name: pId === 'y-square' ? 'Y Square' : 'Heera Solitaire',
      locality: pId === 'y-square' ? 'Thane West' : 'Saswad Road',
      city: pId === 'y-square' ? 'Mumbai' : 'Pune',
      lastSold: { amount: pId === 'y-square' ? '₹56.09 Lac' : '₹42.50 Lac' }
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
              borderRadius: '8px',
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

        {/* Profile Header Card */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #0B1320 0%, #1E293B 100%)',
            borderRadius: '20px',
            padding: '36px',
            color: '#FFFFFF',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div 
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              background: 'radial-gradient(circle, rgba(240, 90, 40, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            
            {/* Avatar & Info */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div 
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F05A28 0%, #EA580C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.9rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(240, 90, 40, 0.4)',
                  border: '3px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {user.avatar || 'PF'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
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
                    <span>Verified Investor</span>
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: '#94A3B8', fontSize: '0.85rem', marginTop: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#CBD5E1" />
                    {user.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#CBD5E1" />
                    {user.phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#CBD5E1" />
                    {user.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => onNavigate('plans')}
                style={{
                  background: 'linear-gradient(135deg, #F05A28 0%, #EA580C 100%)',
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
                  boxShadow: '0 4px 12px rgba(240, 90, 40, 0.3)'
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
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={15} />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>

              <button
                type="button"
                onClick={() => { logout(); onNavigate('home'); }}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Stats Strip (Synchronized with PostgreSQL) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Unlocked Deeds
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FB923C', marginTop: '2px' }}>
                {unlockedTxns.length}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Free Attempts (DB)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: freeAttemptsLeft > 0 ? '#34D399' : '#F87171', marginTop: '2px' }}>
                {freeAttemptsLeft}/3
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                {freeAttemptsLeft > 0 ? 'Remaining' : 'Exhausted'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Plan
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isPaymentDone ? '#60A5FA' : '#CBD5E1', marginTop: '2px' }}>
                {selectedPlan.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.7rem', color: isPaymentDone ? '#34D399' : '#FB923C' }}>
                {isPaymentDone ? 'Paid Verified' : 'Free Tier'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Saved Watchlist
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60A5FA', marginTop: '2px' }}>
                {savedProperties.length}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Agreement Orders
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>
                {agreementOrders.length}
              </div>
            </div>
          </div>
        </div>

        {/* Inline Edit Card if active */}
        {isEditing && (
          <form 
            onSubmit={handleProfileSave}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '32px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: '18px' }}>
              Edit Profile Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '20px' }}>
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
                  onChange={(e) => setEditCity(e.target.value)}
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
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  style={{ accentColor: '#F05A28' }} 
                />
                <span>Email alerts on newly registered deeds</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={smsAlerts} 
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  style={{ accentColor: '#F05A28' }} 
                />
                <span>Instant WhatsApp/SMS notification for price changes</span>
              </label>
            </div>

            <button
              type="submit"
              className="hero-search-btn"
              style={{ padding: '10px 24px' }}
            >
              Save Changes
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
              color: activeTab === 'unlocked' ? '#F05A28' : '#64748B',
              borderBottom: activeTab === 'unlocked' ? '3px solid #F05A28' : '3px solid transparent',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
              color: activeTab === 'saved' ? '#F05A28' : '#64748B',
              borderBottom: activeTab === 'saved' ? '3px solid #F05A28' : '3px solid transparent',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
              color: activeTab === 'orders' ? '#F05A28' : '#64748B',
              borderBottom: activeTab === 'orders' ? '3px solid #F05A28' : '3px solid transparent',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>
                    Government Deed Valuations Unlocked
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                    These records have been unlocked under your Pureframe account. You have full access to registry specs.
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
                                fontWeight: 700
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
                  padding: '48px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0'
                }}
              >
                <Lock size={36} color="#94A3B8" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>No Unlocked Deeds Yet</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '6px auto 20px' }}>
                  Explore property transactions in Pune, Mumbai, or Bangalore and unlock actual registered deed prices for free!
                </p>
                <button
                  type="button"
                  className="hero-search-btn"
                  onClick={() => onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' })}
                >
                  Explore Registered Transactions
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
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s'
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
                              background: '#FFF3EB',
                              color: '#F05A28',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Building2 size={20} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>{p.name}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{p.locality}, {p.city}</p>
                          </div>
                        </div>

                        <button 
                          type="button"
                          onClick={() => toggleSaveProperty(p.id)}
                          style={{ color: '#EF4444', padding: '4px' }}
                          title="Remove from saved"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ marginTop: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.725rem', color: '#64748B' }}>Latest Registered Sale:</span>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
                          {p.lastSold?.amount || '₹ 56.09 Lac'}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => onNavigate('transactions', { projectId: p.id, cityId: p.city?.toLowerCase() || 'mumbai' })}
                        style={{
                          flex: 1,
                          padding: '9px',
                          background: 'linear-gradient(135deg, #F05A28 0%, #EA580C 100%)',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          textAlign: 'center'
                        }}
                      >
                        View Transactions
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
                  padding: '48px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0'
                }}
              >
                <Heart size={36} color="#94A3B8" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Your Watchlist is Empty</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '6px auto 20px' }}>
                  Save projects you are interested in to receive instant price drop and new registration notifications.
                </p>
                <button
                  type="button"
                  className="hero-search-btn"
                  onClick={() => onNavigate('city', { cityId: 'mumbai' })}
                >
                  Browse Projects
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
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
                Certified Agreement Copies
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Certified deed agreements retrieved directly from the state stamp and registry archives.
              </p>
            </div>

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

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                      {order.projectName} • Unit {order.unitNo}
                    </h4>
                    <p style={{ fontSize: '0.775rem', color: '#64748B' }}>{order.locality} • Ordered {order.date}</p>
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
                        gap: '6px'
                      }}
                    >
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
