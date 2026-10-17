import React, { useState } from 'react';
import { Info, ArrowRight, Lock, Unlock } from 'lucide-react';
import UnlockTransactionModal from './UnlockTransactionModal';

export default function TransactionsTable({ 
  transactions = { sale: [], rent: [] }, 
  totalTransactionsCount = 72,
  onViewAllClick,
  onNavigate
}) {
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
    if (allUnlocked) {
      setAllUnlocked(false);
      setUnlockedIds(new Set());
    } else {
      setAllUnlocked(true);
      setUnlockedIds(new Set(rows.map(r => r.id)));
    }
  };

  const handleToggleRowLock = (e, rowId) => {
    e.stopPropagation();
    e.preventDefault();
    setUnlockedIds(prev => {
      const next = new Set(prev);
      if (allUnlocked) {
        if (next.has(rowId)) next.delete(rowId);
        else next.add(rowId);
      } else {
        if (next.has(rowId)) next.delete(rowId);
        else next.add(rowId);
      }
      return next;
    });
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
              <th>Deed Record</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.slice(0, 5).map((row) => {
                const isUnlocked = allUnlocked || unlockedIds.has(row.id);
                const displayAmt = row.amount || row.priceFormatted || '₹ 84.50 Lac';

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
                        onClick={(e) => handleToggleRowLock(e, row.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 9px',
                          borderRadius: '6px',
                          background: isUnlocked ? '#ECFDF5' : '#FEF3C7',
                          border: isUnlocked ? '1px solid #A7F3D0' : '1px solid #FDE68A',
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
                            <Lock size={12} color="#B45309" />
                            <span style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 700 }}>
                              Unlock Price
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      {onNavigate ? (
                        <button
                          type="button"
                          onClick={() => onNavigate('details', { transactionId: row.id })}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#1D4ED8',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: '2px 6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>View Deed</span>
                          <ArrowRight size={12} />
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Verified</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
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
