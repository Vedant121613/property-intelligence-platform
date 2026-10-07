import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CITIES } from '../data/mockData';

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin', onSuccess }) {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpCity, setSignUpCity] = useState('mumbai');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!signInIdentifier.trim()) {
      setErrorMsg('Please enter your email or mobile number.');
      return;
    }
    setErrorMsg('');
    login(signInIdentifier.trim(), signInPassword);
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim()) {
      setErrorMsg('Please fill in your name and email address.');
      return;
    }
    setErrorMsg('');
    signup({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      phone: signUpPhone.trim() || '+91 98200 00000',
      city: signUpCity
    });
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-dialog auth-modal-dialog" 
        style={{ maxWidth: '440px', padding: 0 }} 
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
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span 
              style={{
                background: 'linear-gradient(135deg, #F05A28 0%, #EA580C 100%)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.05em'
              }}
            >
              PUREFRAME ID
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '0.75rem', fontWeight: 600 }}>
              <ShieldCheck size={13} />
              <span>Verified Access</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            {activeTab === 'signin' ? 'Welcome Back to Pureframe' : 'Create Your Pureframe Account'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
            Access authentic government deed registries, unlocked prices, and verified market trends.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'signin' ? '#F05A28' : '#64748B',
              borderBottom: activeTab === 'signin' ? '2px solid #F05A28' : '2px solid transparent',
              background: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
              transition: 'all 0.15s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: activeTab === 'signup' ? '#F05A28' : '#64748B',
              borderBottom: activeTab === 'signup' ? '2px solid #F05A28' : '2px solid transparent',
              background: activeTab === 'signup' ? '#FFFFFF' : 'transparent',
              transition: 'all 0.15s'
            }}
          >
            Create Account
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

          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Email or Mobile Number
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="name@domain.com or 10-digit mobile"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
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
                    Password or OTP
                  </label>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="password"
                    placeholder="Enter your password"
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
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #F05A28 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(240, 90, 40, 0.3)'
                }}
              >
                <span>Sign In to Pureframe</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
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
                  Email Address
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
                  Mobile Number (Optional)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
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
                    onChange={(e) => setSignUpCity(e.target.value)}
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
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #F05A28 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(240, 90, 40, 0.3)'
                }}
              >
                <span>Create Pureframe Account</span>
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
