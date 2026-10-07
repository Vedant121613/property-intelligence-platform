import React from 'react';
import { Edit2 } from 'lucide-react';

export default function MobileInput({ value, onChange, disabled, onEdit, isLocked }) {
  return (
    <div className="auth-input-group">
      <label className="auth-field-label">Mobile Number</label>
      <div className="auth-phone-input-row">
        <div className="auth-country-code-pill">+91</div>
        <input 
          type="tel"
          className="auth-phone-number-field"
          placeholder="Enter 10-digit number"
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
            onChange(val);
          }}
          disabled={disabled}
          required
        />
        {isLocked && onEdit ? (
          <button 
            type="button" 
            className="auth-edit-phone-btn"
            title="Change mobile number"
            onClick={onEdit}
          >
            <Edit2 size={14} />
            <span>Change</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
