import React from 'react';
import { MessageSquare } from 'lucide-react';

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

      <div className="auth-resend-prompt" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            {isResending && resendChannel === '11' ? 'Resending...' : 'Resend SMS'}
          </button>
        </div>

        {/* WhatsApp Retry Option */}
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem' }}>
          <button
            type="button"
            onClick={() => onResend('12')}
            disabled={timerSeconds > 0 || isResending}
            style={{
              background: 'transparent',
              border: 'none',
              color: timerSeconds > 0 ? '#94A3B8' : '#25D366',
              fontWeight: 600,
              cursor: timerSeconds > 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: timerSeconds > 0 ? 0.6 : 1
            }}
          >
            <MessageSquare size={13} />
            <span>{isResending && resendChannel === '12' ? 'Sending via WhatsApp...' : 'Send via WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
