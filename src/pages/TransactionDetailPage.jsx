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
  FileCheck2,
  FileText,
  CheckCircle2
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { getTransactionRecordDetails } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';

export default function TransactionDetailPage({ 
  transactionId = '11089052', 
  onNavigate 
}) {
  const { isPropertySaved, toggleSaveProperty, orderAgreement } = useAuth();
  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDesc, setShowDesc] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getTransactionRecordDetails(transactionId)
      .then(res => {
        if (isMounted) {
          setTxn(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [transactionId]);

  if (loading || !txn) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
        Loading transaction breakdown...
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Home', target: { page: 'home', params: {} } },
    { label: txn.city || 'Mumbai', target: { page: 'city', params: { cityId: 'mumbai' } } },
    { label: txn.locality, target: { page: 'transactions', params: { projectId: 'y-square', cityId: 'mumbai' } } },
    { label: `${txn.project} • Unit ${txn.unitNo}` }
  ];

  return (
    <div>
      {/* Top Yellow Promo Bar (Screenshot 5) */}
      <div className="yellow-promo-bar">
        <span className="yellow-promo-badge">NEW</span>
        <span style={{ color: '#EA580C', fontWeight: 700 }}>✦ AI POWERED</span>
        <span>Search by Property Address</span>
        <ChevronRight size={14} color="#EA580C" />
      </div>

      <div className="content-wrapper" style={{ padding: '24px 24px 56px' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '16px' }}>
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
        </div>

        {/* Home Loan Savings Callout Banner (Screenshot 5) */}
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

        {/* Main Detail Card (Screenshot 5) */}
        <div className="details-page-card">
          <div className="details-header-row">
            {/* Left Info */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div 
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: '#FFF3EB',
                  color: '#CF5C36',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Building2 size={26} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E293B' }}>
                    {txn.project}
                  </h1>
                  <button 
                    type="button"
                    onClick={() => onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#0284C7',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <span>more insights</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748B' }}>{txn.locality}</span>
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
                    viewed by {txn.viewedBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Price & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="details-price-title">{txn.amountHeadline}</span>
                <span className="sale-pill">{txn.saleTypeBadge}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #BBF7D0',
                    background: '#F0FDF4',
                    color: '#166534',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 600
                  }}
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #FED7AA',
                    background: '#FFF7ED',
                    color: '#C2410C',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: 600
                  }}
                >
                  <Bell size={14} />
                  <span>Set Alert</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleSaveProperty('y-square')}
                  style={{
                    padding: '6px 10px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    color: isPropertySaved('y-square') ? '#EF4444' : '#64748B',
                    background: '#FFFFFF'
                  }}
                  title={isPropertySaved('y-square') ? "Saved in Watchlist" : "Save to Watchlist"}
                  aria-label="Save to favorites"
                >
                  <Heart size={16} fill={isPropertySaved('y-square') ? '#EF4444' : 'none'} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', background: '#F1F5F9', margin: '20px 0' }} />

          {/* Detailed Specification Grid (Screenshot 5) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '24px 20px',
              marginBottom: '28px'
            }}
          >
            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Amount</span>
                <Info size={12} color="#94A3B8" />
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
                {txn.amountExact}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Registration Date</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {txn.registrationDate}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Area (sqft)</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {txn.areaSqFt}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Rate per sq. ft</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {txn.ratePerSqFt}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Unit No.</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
                {txn.unitNo}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Floor</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {txn.floor}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Tower / Wing</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {txn.towerWing}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Area-type</span>
                <Info size={12} color="#94A3B8" />
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {txn.areaType}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.775rem', color: '#64748B' }}>Sale Type</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginTop: '4px' }}>
                {txn.saleType}
              </div>
            </div>
          </div>

          {/* Collapsible Property Description (Screenshot 5) */}
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
                fontWeight: 600
              }}
            >
              <span>Property Description</span>
              {showDesc ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {showDesc && (
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '10px', lineHeight: 1.6 }}>
                {txn.description}
              </p>
            )}
          </div>
        </div>

        {/* Agreement Copy Banner (Screenshot 5) */}
        <div className="copy-agreement-banner">
          <div>
            <h3>Get a copy of the agreement for {txn.agreementCopyPrice}</h3>
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
                style={{ color: '#047857', textDecoration: 'underline', marginLeft: '6px' }}
              >
                Go to Profile
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="hero-search-btn"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              onClick={() => {
                orderAgreement({
                  projectName: txn.project,
                  unitNo: txn.unitNo,
                  locality: `${txn.locality}, ${txn.city || 'Mumbai'}`,
                  price: txn.agreementCopyPrice
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
