import React from 'react';

export default function OTPInput({ value, onChange, inputRef, disabled }) {
  return (
    <div className="auth-input-group" style={{ marginTop: '16px' }}>
      <label className="auth-field-label">One Time Password (OTP)</label>
      <input 
        ref={inputRef}
        type="text"
        maxLength={6}
        className="auth-otp-input-field"
        placeholder="Enter 6-digit OTP"
        value={value}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
          onChange(val);
        }}
        disabled={disabled}
        autoFocus
      />
    </div>
  );
}
