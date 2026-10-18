import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ChevronRight, 
  ChevronDown, 
  Share2, 
  Bell, 
  Heart, 
  Info, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { getTransactionRecordDetails } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';

export default function TransactionDetailPage({ 
  transactionId = 'kh-2470', 
  onNavigate 
}) {
  const { 
    isAuthenticated, 
    openAuthModal, 
    unlockTxn, 
    isTxnUnlocked, 
    freeAttemptsLeft, 
    isPaymentDone,
    isPropertySaved, 
    toggleSaveProperty, 
    orderAgreement 
  } = useAuth();

  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDesc, setShowDesc] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getTransactionRecordDetails(transactionId)
      .then(res => {
        if (isMounted) {
          setTxn(res);
          setLoading(false);
          if (isTxnUnlocked(transactionId) || (res && isTxnUnlocked(res.id))) {
            setUnlocked(true);
          }
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [transactionId, isTxnUnlocked]);

  const handleUnlockClick = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (unlocked) {
      setUnlocked(false);
      return;
    }

    const targetId = txn?.id || transactionId;

    if (!isAuthenticated) {
      openAuthModal('signup', async () => {
        const res = await unlockTxn(targetId);
        if (res.unlocked || res.success) setUnlocked(true);
      });
      return;
    }

    if (!isPaymentDone && freeAttemptsLeft <= 0) {
      openAuthModal('signup');
      return;
    }

    const res = await unlockTxn(targetId);
    if (res.unlocked || res.success) {
      setUnlocked(true);
    }
  };

  const handleShare = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading || !txn) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
        Loading transaction breakdown...
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', target: { page: 'home', params: {} } },
    { label: txn.city || 'Pune', target: { page: 'city', params: { cityId: (txn.city || 'pune').toLowerCase() } } },
    { label: `${txn.locality || 'Kharadi'}`, target: { page: 'city', params: { cityId: (txn.city || 'pune').toLowerCase() } } },
    { label: `${txn.project} • ${txn.unitNo}` }
  ];

  const displayPriceHeadline = (txn.amountHeadline && txn.amountHeadline !== '-')
    ? txn.amountHeadline
    : (txn.price > 0 ? (txn.price >= 10000000 ? `₹ ${(txn.price / 10000000).toFixed(2)} Cr` : `₹ ${(txn.price / 100000).toFixed(2)} Lac`) : '-');

  const displayPriceExact = (txn.amountExact && txn.amountExact !== '-')
    ? txn.amountExact
    : (txn.price > 0 ? `₹ ${txn.price.toLocaleString('en-IN')}` : displayPriceHeadline);

  return (
    <div>
      {/* Top Trust Promo Bar */}
      <div className="yellow-promo-bar">
        <span className="yellow-promo-badge">NEW</span>
        <span style={{ color: '#1D4ED8', fontWeight: 700 }}>✦ AI POWERED</span>
        <span>Search by Property Address</span>
        <ChevronRight size={14} color="#1D4ED8" />
      </div>

      <div className="content-wrapper" style={{ padding: '24px 24px 56px' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '16px' }}>
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
        </div>

        {/* Home Loan Savings Callout Banner */}
        <div className="loan-savings-card">
          <div className="loan-savings-left">
            <div className="loan-savings-tag">
              ✦ DATA-LED SAVINGS INSIGHTS • 60-SECOND CHECK
            </div>
            <h3 className="loan-savings-title">
              Most homeowners are <span>overpaying</span> on their home loan. Are you?
            </h3>
            <button type="button" className="loan-savings-btn">
              <span>See my savings</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="loan-savings-stats">
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>TYPICAL</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#475569' }}>8.7% p.a.</div>
              <div style={{ color: '#0284C7', fontSize: '0.8rem' }}>↓</div>
              <div style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700 }}>PROFILE-MATCHED</div>
              <div className="rate-badge">7.1% p.a.</div>
              <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 800 }}>Save up to 40%</div>
            </div>
          </div>
        </div>

        {/* Main Detail Card */}
        <div className="details-page-card">
          <div className="details-header-row">
            {/* Left Info */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div 
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: '#EFF6FF',
                  color: '#1D4ED8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Building2 size={26} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E293B' }}>
                    {txn.project}
                  </h1>
                  <button 
                    type="button"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('project', { 
                          projectId: txn.projectSlug || txn.project, 
                          villageName: txn.locality || 'Kharadi', 
                          talukaName: 'Haveli',
                          projectName: txn.project 
                        });
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#0284C7',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <span>more insights</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748B' }}>{txn.locality || 'Kharadi'}</span>
                  <span 
                    style={{
                      background: '#F1F5F9',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    viewed by {txn.viewedBy || '25+ buyers'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Price & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleUnlockClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: unlocked ? '#047857' : '#B45309',
                    background: unlocked ? '#ECFDF5' : '#FEF3C7',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: unlocked ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={unlocked ? "Price unlocked (Click to lock)" : "Price locked (Click to unlock)"}
                >
                  {unlocked ? <Unlock size={16} color="#059669" /> : <Lock size={16} color="#B45309" />}
                  <span>{unlocked ? displayPriceHeadline : 'Unlock Price'}</span>
                </button>
                <span className="sale-pill">{txn.saleTypeBadge || 'Verified Deed'}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleShare}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #BBF7D0',
                    background: copied ? '#DCFCE7' : '#F0FDF4',
                    color: '#166534',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={14} />
                  <span>{copied ? 'Link Copied!' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #BFDBFE',
                    background: '#EFF6FF',
                    color: '#1E40AF',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Bell size={14} />
                  <span>Set Alert</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleSaveProperty(txn.id || transactionId)}
                  style={{
                    padding: '6px 10px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    color: isPropertySaved(txn.id || transactionId) ? '#EF4444' : '#64748B',
                    background: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                  title={isPropertySaved(txn.id || transactionId) ? "Saved in Watchlist" : "Save to Watchlist"}
                  aria-label="Save to favorites"
                >
                  <Heart size={16} fill={isPropertySaved(txn.id || transactionId) ? '#EF4444' : 'none'} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', background: '#F1F5F9', margin: '20px 0' }} />

          {/* Detailed Specification Grid */}
          <div className="txn-specs-grid">
            {/* Amount */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Amount</span>
                <Info size={12} color="#94A3B8" />
              </div>
              <div style={{ marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleUnlockClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: unlocked ? '#047857' : '#B45309',
                    background: unlocked ? '#ECFDF5' : '#FEF3C7',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: unlocked ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={unlocked ? "Price unlocked (Click to lock)" : "Price locked (Click to unlock directly)"}
                >
                  {unlocked ? <Unlock size={14} color="#059669" /> : <Lock size={14} color="#B45309" />}
                  <span>{unlocked ? displayPriceExact : 'Unlock Price'}</span>
                </button>
              </div>
            </div>

            {/* Registration Date */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Registration Date</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                {txn.registrationDate || '-'}
              </div>
            </div>

            {/* Area */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Area (sqft)</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                {txn.areaSqFt || '-'}
              </div>
            </div>

            {/* Rate per sq. ft */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Rate per sq. ft</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                {unlocked ? (txn.ratePerSqFt || '-') : '••••••••'}
              </div>
            </div>

            {/* Unit No. */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Unit No.</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginTop: '6px' }}>
                {txn.unitNo || '-'}
              </div>
            </div>

            {/* Floor */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Floor</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                {txn.floor || txn.floorNo || '-'}
              </div>
            </div>

            {/* Tower / Wing */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Tower / Wing</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                {txn.towerWing || '-'}
              </div>
            </div>

            {/* Area-type */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Area-type</span>
                <Info size={12} color="#94A3B8" />
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                {txn.areaType || 'Carpet Area'}
              </div>
            </div>

            {/* Sale Type */}
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Sale Type</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '6px' }}>
                {txn.saleType || txn.saleTypeBadge || 'Registered Deed'}
              </div>
            </div>
          </div>

          {/* Collapsible Property Description */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={() => setShowDesc(!showDesc)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#0284C7',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <span>Property Description</span>
              {showDesc ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {showDesc && (
              <div style={{ marginTop: '12px', background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6, marginBottom: '10px' }}>
                  {txn.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.8rem', color: '#64748B', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                  <div><strong>Sub-Registrar:</strong> {txn.subRegistrarOffice || 'Haveli Sub-Registrar'}</div>
                  <div><strong>Document No:</strong> {txn.docNo || 'Registered'}</div>
                  <div><strong>Purchaser:</strong> {txn.purchaserName || 'Verified Resident'}</div>
                  <div><strong>Seller/Promoter:</strong> {txn.sellerName || 'Promoter'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agreement Copy Banner */}
        <div className="copy-agreement-banner">
          <div>
            <h3>Get a copy of the agreement for {txn.agreementCopyPrice || '₹ 999'}</h3>
            <p>
              Agreements are useful to get details on legal title, payment structure, amenities promised &amp; other costs like advance maintenance charges.
            </p>
          </div>

          {orderPlaced ? (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#059669',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Copy Ordered! View in Profile</span>
              <button 
                type="button" 
                onClick={() => onNavigate('profile')}
                style={{ color: '#047857', textDecoration: 'underline', marginLeft: '6px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >
                Go to Profile
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="hero-search-btn"
              style={{ padding: '10px 24px', fontSize: '0.9rem', cursor: 'pointer' }}
              onClick={() => {
                orderAgreement({
                  projectName: txn.project,
                  unitNo: txn.unitNo,
                  locality: `${txn.locality || 'Kharadi'}, ${txn.city || 'Pune'}`,
                  price: txn.agreementCopyPrice || '₹ 999'
                });
                setOrderPlaced(true);
              }}
            >
              Request Agreement Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
