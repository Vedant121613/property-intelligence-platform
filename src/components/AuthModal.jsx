import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CITIES } from '../data/mockData';

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin', onSuccess }) {
  const { login, signup, loginWithPhoneOtp } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpCity, setSignUpCity] = useState('pune');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [defaultTab, isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!signInIdentifier.trim()) {
      setErrorMsg('Please enter your mobile number or email.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const cleanPhone = signInIdentifier.replace(/\D/g, '').slice(-10);
      let resUser;
      if (cleanPhone.length === 10) {
        resUser = await loginWithPhoneOtp(cleanPhone);
      } else {
        resUser = login(signInIdentifier.trim(), signInPassword);
      }

      setSuccessMsg('Signed in successfully!');
      setTimeout(() => {
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 350);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Unable to sign in. Please check your credentials.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = signUpPhone.replace(/\D/g, '').slice(-10);
    if (!signUpEmail.trim() && cleanPhone.length !== 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number or email address.');
      return;
    }

    if (signUpPhone.trim() && cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const generatedPhone = cleanPhone || ('98200' + Math.floor(10000 + Math.random() * 90000));
      const newUser = signup({
        name: signUpName.trim(),
        email: signUpEmail.trim() || `${generatedPhone}@pureframe.io`,
        phone: generatedPhone,
        city: signUpCity
      });

      setSuccessMsg('Account created with 3 Free Unlocks!');
      setTimeout(() => {
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 400);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Error creating account. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-dialog auth-modal-dialog" 
        style={{ maxWidth: '440px', padding: 0, overflow: 'hidden' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '24px 28px 20px',
            background: 'linear-gradient(135deg, #0B1320 0%, #1E293B 100%)',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              position: 'absolute', 
              top: '18px', 
              right: '18px', 
              color: '#94A3B8',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span 
              style={{
                background: 'var(--brand-gradient)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.05em'
              }}
            >
              PUREFRAME ACCESS
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.75rem', fontWeight: 600 }}>
              <ShieldCheck size={13} />
              <span>Verified IGR Registries</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', margin: '4px 0' }}>
            {activeTab === 'signin' ? 'Sign In to Pureframe' : 'Create Free Pureframe Account'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
            Access authentic government deed registrations, unlock verified transaction prices, and track market trends.
          </p>

          {/* 3 Free Trials Highlight Box */}
          <div 
            style={{ 
              marginTop: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '6px 12px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.775rem',
              color: '#6EE7B7'
            }}
          >
            <Gift size={15} color="#34D399" />
            <span><strong>3 Free Deed Unlocks</strong> included with every user account!</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'signin' ? '#1D4ED8' : '#64748B',
              border: 'none',
              borderBottom: activeTab === 'signin' ? '2px solid #1D4ED8' : '2px solid transparent',
              background: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'signup' ? '#1D4ED8' : '#64748B',
              border: 'none',
              borderBottom: activeTab === 'signup' ? '2px solid #1D4ED8' : '2px solid transparent',
              background: activeTab === 'signup' ? '#FFFFFF' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Create Account (Free 3 Trials)
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px 28px 28px' }}>
          {errorMsg && (
            <div 
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                marginBottom: '16px'
              }}
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div 
              style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={15} color="#059669" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Mobile Number or Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="10-digit mobile or email address"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155' }}>
                    Password or OTP (Optional)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Instant Access</span>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="password"
                    placeholder="Enter password or leave blank for instant login"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '10px',
                  background: 'var(--brand-gradient)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.75 : 1,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to Pureframe'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Mobile Number (For saving your 3 Free Trials) *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Email Address (Optional)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Primary City of Interest
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <select
                    value={signUpCity}
                    onChange={(e) => {
                      if (e.target.value === 'mumbai') return;
                      setSignUpCity(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      background: '#fff'
                    }}
                  >
                    {CITIES.map(c => (
                      <option key={c.id} value={c.id} disabled={c.isUpcoming}>
                        {c.name} {c.isUpcoming ? '(Upcoming)' : '(Live Registries)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '10px',
                  background: 'var(--brand-gradient)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.75 : 1,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Get 3 Free Trials & Register'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.725rem', color: '#94A3B8', lineHeight: 1.5 }}>
            <span style={{ color: '#10B981', fontWeight: 600 }}>100% Privacy Protected:</span> Pureframe never sells your number to spam brokers or cold callers.
          </div>
        </div>
      </div>
    </div>
  );
}
