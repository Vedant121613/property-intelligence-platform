import React from 'react';

export default function OTPCountdown({ 
  timerSeconds, 
  formatTime, 
  isResending, 
  resendChannel, 
  onResend 
}) {
  return (
    <div className="auth-timer-resend-area">
      <div className="auth-expiry-timer-text">
        {timerSeconds > 0 ? (
          <>Resend available in <strong style={{ color: '#1E293B' }}>{formatTime(timerSeconds)}</strong></>
        ) : (
          <span style={{ color: '#16A34A', fontWeight: 600 }}>You can now request a new code</span>
        )}
      </div>

      <div className="auth-resend-prompt" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>Didn't receive the code?</span>
        <button 
          type="button"
          className="auth-resend-btn"
          disabled={timerSeconds > 0 || isResending}
          onClick={() => onResend('11')}
          style={{
            opacity: timerSeconds > 0 ? 0.5 : 1,
            cursor: timerSeconds > 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {isResending && resendChannel === '11' ? 'Resending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
}
