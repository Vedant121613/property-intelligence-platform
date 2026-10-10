import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendOtp, verifyOtp, resendOtp } from '../../services/authService';
import MobileInput from './MobileInput';
import OTPInput from './OTPInput';
import OTPCountdown from './OTPCountdown';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { loginWithPhoneOtp } = useAuth();

  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [reqId, setReqId] = useState('');
  const [authState, setAuthState] = useState('idle');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [feedback, setFeedback] = useState(null);
  const [resendChannel, setResendChannel] = useState(null);

  const otpInputRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timerSeconds]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setFeedback({ type: 'error', message: 'Please enter a valid 10-digit mobile number' });
      return;
    }

    setAuthState('sending');
    setFeedback(null);
    try {
      const res = await sendOtp(clean);
      setReqId(res.reqId || '');
      setStep('otp');
      setTimerSeconds(60);
      setAuthState('otpSent');
      setFeedback({ type: 'success', message: 'OTP sent to your mobile number' });
      setTimeout(() => {
        if (otpInputRef.current) otpInputRef.current.focus();
      }, 150);
    } catch (err) {
      setAuthState('error');
      setFeedback({ type: 'error', message: err.message || 'Unable to send OTP' });
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setFeedback({ type: 'error', message: 'Please enter the verification code' });
      return;
    }

    setAuthState('verifying');
    setFeedback(null);
    try {
      await verifyOtp(reqId, cleanOtp, phoneNumber);
      setAuthState('verified');
      setFeedback({ type: 'success', message: 'Verified successfully!' });
      setTimeout(async () => {
        await loginWithPhoneOtp(phoneNumber);
        if (onSuccess) onSuccess();
        onClose();
      }, 400);
    } catch (err) {
      setAuthState('error');
      setFeedback({ type: 'error', message: err.message || 'Invalid or expired OTP' });
    }
  };

  const handleResendOtp = async (channel = '11') => {
    if (timerSeconds > 0) return;
    setAuthState('resending');
    setResendChannel(channel);
    setFeedback(null);
    try {
      const res = await resendOtp(reqId, channel, phoneNumber);
      setTimerSeconds(60);
      setAuthState('otpSent');
      setFeedback({ type: 'success', message: res.message || 'New OTP sent' });
    } catch (err) {
      setAuthState('error');
      setFeedback({ type: 'error', message: err.message || 'Failed to resend code' });
    } finally {
      setResendChannel(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-dialog auth-modal-dialog" 
        style={{ maxWidth: '420px', padding: 0 }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0B1320 0%, #1E293B 100%)',
          color: '#FFFFFF',
          position: 'relative'
        }}>
          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              color: '#94A3B8',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Close"
          >
            <X size={15} />
          </button>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
            {step === 'otp' ? 'Verify Code' : 'Sign In'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px', margin: 0 }}>
            {step === 'otp' ? `Code sent to +91 ${phoneNumber}` : 'Enter your mobile number to sign in'}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {feedback && (
            <div className={`auth-feedback-banner ${feedback.type}`} style={{ marginBottom: '16px' }}>
              {feedback.type === 'success' ? (
                <CheckCircle2 size={16} color="#10B981" />
              ) : (
                <AlertCircle size={16} color="#EF4444" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={step === 'otp' ? handleVerifyOtp : handleSendOtp}>
            <MobileInput 
              value={phoneNumber}
              onChange={setPhoneNumber}
              disabled={step === 'otp'}
              isLocked={step === 'otp'}
              onEdit={() => {
                setStep('phone');
                setOtp('');
                setFeedback(null);
                setAuthState('idle');
              }}
            />

            {step === 'otp' && (
              <OTPInput 
                value={otp}
                onChange={setOtp}
                inputRef={otpInputRef}
                disabled={authState === 'verifying'}
              />
            )}

            <div style={{ marginTop: '20px' }}>
              <button 
                type="submit"
                disabled={(step === 'phone' && phoneNumber.length < 10) || (step === 'otp' && !otp.trim()) || authState === 'sending' || authState === 'verifying'}
                className="auth-submit-btn active"
                style={{ width: '100%' }}
              >
                {step === 'otp' 
                  ? (authState === 'verifying' ? 'Verifying...' : 'Verify & Continue')
                  : (authState === 'sending' ? 'Sending Code...' : 'Send OTP')}
              </button>
            </div>

            {step === 'otp' && (
              <OTPCountdown 
                timerSeconds={timerSeconds}
                formatTime={formatTime}
                isResending={authState === 'resending'}
                resendChannel={resendChannel}
                onResend={handleResendOtp}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
