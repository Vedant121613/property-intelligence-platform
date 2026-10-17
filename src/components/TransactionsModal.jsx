import React, { useState } from 'react';
import { X, Search, Lock, Unlock } from 'lucide-react';

export default function TransactionsModal({
  isOpen,
  onClose,
  projectName = 'Heera Solitaire',
  transactions = { sale: [], rent: [] }
}) {
  const [filterType, setFilterType] = useState('all');
  const [unitSearch, setUnitSearch] = useState('');
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [allUnlocked, setAllUnlocked] = useState(true);

  if (!isOpen) return null;

  const combined = [
    ...(transactions.sale || []),
    ...(transactions.rent || [])
  ];

  const filtered = combined.filter(item => {
    if (filterType !== 'all' && item.type.toLowerCase() !== filterType) return false;
    if (unitSearch.trim()) {
      const q = unitSearch.toLowerCase();
      return (
        item.unit.toLowerCase().includes(q) ||
        item.floorTower.toLowerCase().includes(q) ||
        (item.amount && item.amount.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const toggleUnlockRow = (id) => {
    setUnlockedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (allUnlocked) {
      setAllUnlocked(false);
      setUnlockedIds(new Set());
    } else {
      setAllUnlocked(true);
      setUnlockedIds(new Set(combined.map(c => c.id)));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B' }}>
              Registered Transactions - {projectName}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              Historical sale deeds and lease registrations recorded with IGR
            </p>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Controls: Search, Type & Unlock All */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input 
                type="text"
                placeholder="Filter by unit, floor or amount..."
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {['all', 'sale', 'rent'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    background: filterType === type ? '#1D4ED8' : '#F1F5F9',
                    color: filterType === type ? '#FFFFFF' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {type}
                </button>
              ))}

              <button
                type="button"
                onClick={handleToggleAll}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: allUnlocked ? '#0F766E' : '#ECFDF5',
                  color: allUnlocked ? '#FFFFFF' : '#065F46',
                  border: allUnlocked ? '1px solid #0F766E' : '1px solid #A7F3D0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Unlock all deed amounts instantly"
              >
                {allUnlocked ? <Lock size={14} /> : <Unlock size={14} />}
                <span>{allUnlocked ? 'Lock Prices' : '⚡ Unlock All (Unlimited)'}</span>
              </button>
            </div>
          </div>

          {/* Table */}
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
                {filtered.length > 0 ? (
                  filtered.map((row) => {
                    const isUnlocked = allUnlocked || unlockedIds.has(row.id);
                    return (
                      <tr key={row.id}>
                        <td>{row.date}</td>
                        <td>
                          <span className="sale-pill">{row.type}</span>
                        </td>
                        <td>{row.floorTower}</td>
                        <td style={{ fontWeight: 600 }}>{row.unit}</td>
                        <td>
                          {isUnlocked ? (
                            <div 
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                              onClick={() => toggleUnlockRow(row.id)}
                              title="Click to lock price"
                            >
                              <span className="amount-text" style={{ color: '#15803D' }}>{row.amount}</span>
                              <Unlock size={13} color="#15803D" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="locked-amount-badge"
                              onClick={() => toggleUnlockRow(row.id)}
                              title="Click to unlock price (Unlimited)"
                              style={{ border: 'none', cursor: 'pointer' }}
                            >
                              <Lock size={12} />
                              <span>Unlock</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                      No matching transaction records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
