import React, { useState } from 'react';
import { X, Search, Download } from 'lucide-react';

export default function TransactionsModal({
  isOpen,
  onClose,
  projectName = 'Heera Solitaire',
  transactions = { sale: [], rent: [] }
}) {
  const [filterType, setFilterType] = useState('all');
  const [unitSearch, setUnitSearch] = useState('');

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
        item.amount.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
            onClick={onClose}
            style={{ color: '#64748B', padding: '6px', borderRadius: '4px' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Controls: Search & Type */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
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

            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'sale', 'rent'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '8px 16px',
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
                  filtered.map((row) => (
                    <tr key={row.id}>
                      <td>{row.date}</td>
                      <td>
                        <span className="sale-pill">{row.type}</span>
                      </td>
                      <td>{row.floorTower}</td>
                      <td>{row.unit}</td>
                      <td className="amount-text">{row.amount}</td>
                    </tr>
                  ))
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
