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
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [selectedTxn, setSelectedTxn] = useState(null);

  const rows = (activeTab === 'sale' ? transactions.sale : transactions.rent) || [];

  const handleUnlockSuccess = (txnId) => {
    setUnlockedIds(prev => new Set(prev).add(txnId));
    setSelectedTxn(null);
    if (onNavigate) {
      onNavigate('details', { transactionId: txnId });
    }
  };

  return (
    <div className="transactions-section">
      <div className="transactions-header">
        <div className="transactions-title-row">
          <span>Negotiate better using Recent Transactions</span>
          <Info size={16} color="#94A3B8" style={{ cursor: 'pointer' }} />
        </div>

        <button 
          type="button" 
          className="view-all-txns-btn"
          onClick={onViewAllClick}
        >
          <span>View {totalTransactionsCount} Transactions</span>
          <ArrowRight size={14} />
        </button>
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
                const isUnlocked = unlockedIds.has(row.id);

                return (
                  <tr 
                    key={row.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (isUnlocked && onNavigate) {
                        onNavigate('details', { transactionId: row.id });
                      } else {
                        setSelectedTxn(row);
                      }
                    }}
                  >
                    <td>{row.date}</td>
                    <td>
                      <span className="sale-pill">{row.type}</span>
                    </td>
                    <td>{row.floorTower}</td>
                    <td style={{ fontWeight: 600 }}>{row.unit}</td>
                    <td>
                      {isUnlocked ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="amount-text" style={{ color: '#15803D' }}>{row.amount}</span>
                          <Unlock size={13} color="#15803D" />
                        </div>
                      ) : (
                        <div 
                          className="locked-amount-badge"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTxn(row);
                          }}
                        >
                          <Lock size={12} />
                          <span>Unlock</span>
                        </div>
                      )}
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
