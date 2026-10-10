import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Bell, 
  Download, 
  Sparkles, 
  Calendar, 
  Lock, 
  Unlock, 
  ChevronRight, 
  TrendingDown, 
  FileSpreadsheet,
  ArrowRight,
  Filter,
  Heart,
  LayoutGrid,
  List
} from 'lucide-react';
import UnlockTransactionModal from '../components/UnlockTransactionModal';
import { getProjectTransactionsList } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';

export default function TransactionsPage({ 
  projectId = 'y-square', 
  cityId = 'mumbai', 
  onNavigate 
}) {
  const { isTxnUnlocked, isPropertySaved, toggleSaveProperty } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [txTypeFilter, setTxTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Local unlocked items state
  const [unlockedTxnIds, setUnlockedTxnIds] = useState(new Set());
  const [selectedTxnForUnlock, setSelectedTxnForUnlock] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getProjectTransactionsList(projectId, { type: txTypeFilter })
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [projectId, txTypeFilter]);

  if (loading || !data) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
        Loading registered transactions...
      </div>
    );
  }

  const handleUnlockClick = (txn) => {
    setSelectedTxnForUnlock(txn);
  };

  const handleUnlockSuccess = (txnId) => {
    setUnlockedTxnIds(prev => new Set(prev).add(txnId));
    setSelectedTxnForUnlock(null);
    // Proceed to detailed view (Screenshot 5)
    onNavigate('details', { transactionId: txnId, projectId });
  };

  return (
    <div>
      {/* Trust Promotion Bar */}
      <div className="yellow-promo-bar">
        <span className="yellow-promo-badge">NEW</span>
        <span style={{ color: '#1D4ED8', fontWeight: 700 }}>✦ AI POWERED</span>
        <span>Search by Property Address</span>
        <ChevronRight size={14} color="#1D4ED8" />
      </div>

      <div className="content-wrapper" style={{ padding: '24px 24px 48px' }}>
        {/* Project Header Card */}
        <div 
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: '#EFF6FF',
                color: '#1D4ED8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={24} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E293B' }}>
                  {data.projectName}
                </h1>
                <ArrowRight size={16} color="#94A3B8" />
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid #BFDBFE',
                    background: '#EFF6FF',
                    color: '#1E40AF',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  <Bell size={12} />
                  <span>Set Alert</span>
                </button>

                {/* Save to Watchlist / Profile button */}
                <button
                  type="button"
                  onClick={() => toggleSaveProperty(projectId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: isPropertySaved(projectId) ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
                    background: isPropertySaved(projectId) ? '#FEF2F2' : '#FFFFFF',
                    color: isPropertySaved(projectId) ? '#EF4444' : '#64748B',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={13} fill={isPropertySaved(projectId) ? '#EF4444' : 'none'} />
                  <span>{isPropertySaved(projectId) ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.875rem', color: '#64748B' }}>{data.locality}</span>
                <span 
                  style={{
                    background: '#F1F5F9',
                    color: '#475569',
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}
                >
                  viewed by {data.viewedByCount}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#1D4ED8',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <Sparkles size={15} />
              <span>Analyse data like a PRO</span>
            </button>

            <button 
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#15803D',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <FileSpreadsheet size={16} />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        {/* Section Heading & View Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>
            Showing {data.totalCount} transactions
          </h2>

          {/* View Mode Toggle: Table or Card Grid */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? '#1E293B' : '#64748B',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <List size={14} />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: viewMode === 'cards' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'cards' ? '#1E293B' : '#64748B',
                boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Sidebar Filters + Main Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* Left Sidebar Filters (Screenshot 4) */}
          <aside 
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B' }}>Filters</span>
              <button 
                type="button"
                onClick={() => {
                  setTxTypeFilter('all');
                  setStartDate('');
                  setEndDate('');
                  setMinArea('');
                  setMaxArea('');
                }}
                style={{ fontSize: '0.775rem', color: '#0284C7', fontWeight: 600 }}
              >
                Clear all
              </button>
            </div>

            {/* Transaction Type Radio Options */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px' }}>
                Transaction Type
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="txtype" 
                    checked={txTypeFilter === 'all' || txTypeFilter === 'sale'}
                    onChange={() => setTxTypeFilter('sale')}
                    style={{ accentColor: '#1D4ED8' }}
                  />
                  <span>Sale</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="txtype" 
                    checked={txTypeFilter === 'rent'}
                    onChange={() => setTxTypeFilter('rent')}
                    style={{ accentColor: '#1D4ED8' }}
                  />
                  <span>Rent</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="txtype" 
                    checked={txTypeFilter === 'mortgage'}
                    onChange={() => setTxTypeFilter('mortgage')}
                    style={{ accentColor: '#1D4ED8' }}
                  />
                  <span>Mortgage</span>
                </label>
              </div>
            </div>

            {/* Registration Date Filter */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px' }}>
                Registration Date
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem'
                  }}
                />
                <input 
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem'
                  }}
                />
              </div>
            </div>

            {/* Min / Max Area */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px' }}>
                Area (Sq.ft.)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="number"
                  placeholder="Min"
                  value={minArea}
                  onChange={(e) => setMinArea(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem'
                  }}
                />
                <input 
                  type="number"
                  placeholder="Max"
                  value={maxArea}
                  onChange={(e) => setMaxArea(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem'
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div>
            {/* Home Loan Savings Callout Banner (Screenshot 4) */}
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

            {/* Transactions Content View (Table or Cards) */}
            {viewMode === 'table' ? (
              <div 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Project</th>
                        <th>Type</th>
                        <th>Floor, Tower</th>
                        <th>Unit</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transactions.map((txn) => {
                        const isUnlocked = isTxnUnlocked(txn.id) || unlockedTxnIds.has(txn.id);

                        return (
                          <tr 
                            key={txn.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              if (isUnlocked) {
                                onNavigate('details', { transactionId: txn.id, projectId });
                              } else {
                                handleUnlockClick(txn);
                              }
                            }}
                          >
                            <td style={{ whiteSpace: 'nowrap' }}>{txn.date}</td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#1E293B' }}>{txn.project}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{txn.locality}</div>
                            </td>
                            <td>
                              <span className="sale-pill">{txn.type}</span>
                            </td>
                            <td>{txn.floorTower}</td>
                            <td style={{ fontWeight: 700 }}>{txn.unit}</td>
                            <td>
                              {/* Amount contains lock icon. Clicking opens free checkbox unlock flow! */}
                              {isUnlocked ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span className="amount-text" style={{ color: '#15803D' }}>
                                    {txn.displayAmount}
                                  </span>
                                  <Unlock size={14} color="#15803D" />
                                </div>
                              ) : (
                                <div 
                                  className="locked-amount-badge"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnlockClick(txn);
                                  }}
                                  title="Click to unlock this transaction for free"
                                >
                                  <Lock size={13} />
                                  <span>Unlock</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {data.transactions.map((txn) => {
                  const isUnlocked = isTxnUnlocked(txn.id) || unlockedTxnIds.has(txn.id);

                  return (
                    <div
                      key={txn.id}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '18px 20px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'transform 0.15s, border-color 0.15s'
                      }}
                      onClick={() => {
                        if (isUnlocked) {
                          onNavigate('details', { transactionId: txn.id, projectId });
                        } else {
                          handleUnlockClick(txn);
                        }
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{txn.date}</span>
                          <span className="sale-pill">{txn.type}</span>
                        </div>

                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>
                          Unit {txn.unit} • Floor {txn.floorTower}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                          {txn.project}, {txn.locality}
                        </div>
                      </div>

                      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Registered Deed:</span>
                        {isUnlocked ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 800, color: '#15803D', fontSize: '0.95rem' }}>{txn.displayAmount}</span>
                            <Unlock size={14} color="#15803D" />
                          </div>
                        ) : (
                          <div 
                            className="locked-amount-badge"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnlockClick(txn);
                            }}
                          >
                            <Lock size={12} />
                            <span>Free Unlock</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Free Unlock Modal (Checkbox-based as explicitly requested by user) */}
      <UnlockTransactionModal
        isOpen={Boolean(selectedTxnForUnlock)}
        onClose={() => setSelectedTxnForUnlock(null)}
        transaction={selectedTxnForUnlock}
        onUnlockSuccess={handleUnlockSuccess}
      />
    </div>
  );
}
