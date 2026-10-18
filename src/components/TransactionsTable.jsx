import React, { useState } from 'react';
import { Info, ArrowRight, Lock, Unlock } from 'lucide-react';
import UnlockTransactionModal from './UnlockTransactionModal';
import { useAuth } from '../context/AuthContext';

export default function TransactionsTable({ 
  transactions = { sale: [], rent: [] }, 
  totalTransactionsCount = 72,
  onViewAllClick,
  onNavigate
}) {
  const { 
    isAuthenticated, 
    openAuthModal, 
    unlockTxn, 
    isTxnUnlocked, 
    freeAttemptsLeft, 
    isPaymentDone 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('sale');
  const [allUnlocked, setAllUnlocked] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [selectedTxn, setSelectedTxn] = useState(null);

  const rows = (activeTab === 'sale' ? transactions.sale : transactions.rent) || [];

  const handleUnlockSuccess = (txnId) => {
    setUnlockedIds(prev => new Set(prev).add(txnId));
    setSelectedTxn(null);
  };

  const handleToggleAll = () => {
    if (isPaymentDone) {
      if (allUnlocked) {
        setAllUnlocked(false);
        setUnlockedIds(new Set());
      } else {
        setAllUnlocked(true);
        setUnlockedIds(new Set(rows.map(r => r.id)));
      }
      return;
    }

    if (!isAuthenticated) {
      openAuthModal('signup');
      return;
    }

    // Free tier: Prompt plan selection for bulk unlock
    if (rows.length > 0) {
      setSelectedTxn(rows[0]);
    }
  };

  const handleToggleRowLock = async (e, row) => {
    e.stopPropagation();
    e.preventDefault();

    const isCurrentlyUnlocked = allUnlocked || unlockedIds.has(row.id);

    // 1. If currently displaying the unlocked price, toggle off (lock)
    if (isCurrentlyUnlocked) {
      setUnlockedIds(prev => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });
      return;
    }

    // 2. If already unlocked in user account, reveal directly in place without consuming a trial
    if (isTxnUnlocked(row.id)) {
      setUnlockedIds(prev => new Set(prev).add(row.id));
      return;
    }

    // 3. If not logged in, prompt sign in or sign up to claim 3 free trials
    if (!isAuthenticated) {
      openAuthModal('signup', async () => {
        const res = await unlockTxn(row.id);
        if (res.unlocked || res.success) {
          setUnlockedIds(prev => new Set(prev).add(row.id));
        }
      });
      return;
    }

    // 4. If out of attempts and not paid, open plan modal
    if (!isPaymentDone && freeAttemptsLeft <= 0) {
      setSelectedTxn(row);
      return;
    }

    // 5. Authenticated with attempts remaining or paid: unlock in place!
    const res = await unlockTxn(row.id);
    if (res.unlocked || res.success) {
      setUnlockedIds(prev => new Set(prev).add(row.id));
    } else if (res.limitReached) {
      setSelectedTxn(row);
    }
  };

  return (
    <div className="transactions-section">
      <div className="transactions-header">
        <div className="transactions-title-row">
          <span>Negotiate better using Recent Transactions</span>
          <Info size={16} color="#94A3B8" style={{ cursor: 'pointer' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleToggleAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: allUnlocked ? '#ECFDF5' : '#FFFBEB',
              color: allUnlocked ? '#065F46' : '#B45309',
              border: allUnlocked ? '1px solid #A7F3D0' : '1px solid #FDE68A',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Toggle all price visibility (Unlimited)"
          >
            {allUnlocked ? <Unlock size={13} color="#059669" /> : <Lock size={13} color="#B45309" />}
            <span>{allUnlocked ? '⚡ All Prices Unlocked (Unlimited)' : '🔒 Unlock All Prices'}</span>
          </button>

          <button 
            type="button" 
            className="view-all-txns-btn"
            onClick={onViewAllClick}
          >
            <span>View {totalTransactionsCount} Transactions</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="table-tabs">
        <button 
          type="button"
          className={`tab-btn ${activeTab === 'sale' ? 'active' : ''}`}
          onClick={() => setActiveTab('sale')}
        >
          Sale
        </button>
        <button 
          type="button"
          className={`tab-btn ${activeTab === 'rent' ? 'active' : ''}`}
          onClick={() => setActiveTab('rent')}
        >
          Rent
        </button>
      </div>

      {/* Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Floor, Tower</th>
              <th>Unit</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.slice(0, 5).map((row) => {
                const isUnlocked = allUnlocked || unlockedIds.has(row.id);
                const rawAmt = row.amount || row.priceFormatted;
                const displayAmt = (rawAmt && rawAmt !== 'Rs. NaN Lac' && rawAmt !== '₹ 0.00 Lac' && rawAmt !== '-')
                  ? (rawAmt.startsWith('₹') || rawAmt.startsWith('Rs') ? rawAmt : `₹ ${rawAmt}`)
                  : (row.price && Number(row.price) > 0 
                      ? (Number(row.price) >= 10000000 ? `₹ ${(Number(row.price) / 10000000).toFixed(2)} Cr` : `₹ ${(Number(row.price) / 100000).toFixed(2)} Lac`)
                      : '-');

                return (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>
                      <span className="sale-pill">{row.type}</span>
                    </td>
                    <td>{row.floorTower}</td>
                    <td style={{ fontWeight: 600 }}>{row.unit}</td>
                    <td>
                      <div 
                        className="price-amount-cell"
                        onClick={(e) => handleToggleRowLock(e, row)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: isUnlocked ? '#ECFDF5' : '#EFF6FF',
                          border: isUnlocked ? '1px solid #A7F3D0' : '1px solid #BFDBFE',
                          color: isUnlocked ? '#065F46' : '#1D4ED8',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title={isUnlocked ? "Click to lock price" : "Click to unlock price directly"}
                      >
                        {isUnlocked ? (
                          <>
                            <span className="amount-text" style={{ color: '#065F46', fontWeight: 700 }}>
                              {displayAmt}
                            </span>
                            <Unlock size={13} color="#059669" />
                          </>
                        ) : (
                          <>
                            <Lock size={12} color="#1D4ED8" />
                            <span style={{ fontSize: '0.8rem', color: '#1D4ED8', fontWeight: 700 }}>
                              Unlock Price
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                  No recent {activeTab} transactions registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Unlock Checkbox Modal */}
      <UnlockTransactionModal
        isOpen={Boolean(selectedTxn)}
        onClose={() => setSelectedTxn(null)}
        transaction={selectedTxn}
        onUnlockSuccess={handleUnlockSuccess}
      />
    </div>
  );
}
