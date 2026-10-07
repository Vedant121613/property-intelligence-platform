import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Database, 
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PlansPage({ onNavigate }) {
  const { 
    freeAttemptsLeft, 
    freeAttemptsUsed, 
    isPaymentDone, 
    selectedPlan, 
    selectPlan, 
    resetAttempts,
    user 
  } = useAuth();

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [successBanner, setSuccessBanner] = useState('');

  const handleChoosePlan = async (planId) => {
    setLoadingPlan(planId);
    setSuccessBanner('');
    try {
      await selectPlan(planId);
      setSuccessBanner(`Plan ${planId.toUpperCase()} activated! Database updated with is_payment_done = true.`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleReset = async () => {
    await resetAttempts();
    setSuccessBanner('Database reset! 3 free attempts restored, payment status set to false.');
  };

  const PLANS = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '₹0',
      period: 'forever',
      badge: 'Free Tier',
      description: 'Test Pureframe with authentic registered deeds from local PostgreSQL',
      features: [
        '3 Free Deed Valuations',
        'Inspect Registration Dates & Floor Details',
        'Official IGR Registry Cross-Check',
        'Community Search Access'
      ],
      isFree: true,
      buttonText: isPaymentDone ? 'Downgrade to Free' : (freeAttemptsLeft > 0 ? `${freeAttemptsLeft} of 3 Free Left` : '3/3 Used (Expired)')
    },
    {
      id: 'starter',
      name: 'Starter Explorer',
      price: '₹999',
      period: '/month',
      badge: null,
      description: 'Ideal for home buyers evaluating a specific locality or township',
      features: [
        '25 Verified Deed Unlocks per month',
        'Standard IGR Stamp Records',
        'Historical 12-Month Price Trend Charts',
        'Direct Builder vs Resale Price Verification',
        'Email Support'
      ],
      isFree: false,
      buttonText: selectedPlan === 'starter' && isPaymentDone ? 'Current Active Plan' : 'Select Starter Plan'
    },
    {
      id: 'investor',
      name: 'Investor Pro',
      price: '₹2,499',
      period: '/month',
      badge: 'Most Popular',
      popular: true,
      description: 'Unlimited deed registry intelligence for serious property buyers and investors',
      features: [
        'Unlimited Certified Deed Unlocks',
        'Instant Certified PDF Agreement Copies',
        'AI Negotiation Price Predictor',
        'Direct Sub-Registrar Syncing',
        'Full Litigation & MahaRERA Complaint Tracking',
        'Priority WhatsApp Advisory'
      ],
      isFree: false,
      buttonText: selectedPlan === 'investor' && isPaymentDone ? 'Current Active Plan' : 'Select Investor Pro'
    },
    {
      id: 'enterprise',
      name: 'Broker & Enterprise',
      price: '₹5,999',
      period: '/month',
      badge: 'Teams & API',
      description: 'Designed for commercial brokerages, legal firms, and real estate funds',
      features: [
        'Unlimited Deeds for up to 5 Team Accounts',
        'Bulk CSV & Excel Data Export',
        'Complete State IGR Historical Archives',
        'MahaRERA Project Sanction Maps',
        'Dedicated Senior Account Manager',
        'REST API & Webhook Access'
      ],
      isFree: false,
      buttonText: selectedPlan === 'enterprise' && isPaymentDone ? 'Current Active Plan' : 'Select Enterprise Plan'
    }
  ];

  return (
    <div className="plans-page-container" style={{ padding: '48px 0 64px', background: '#F8FAFC' }}>
      <div className="content-wrapper">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <div className="hero-glow-badge" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>TRANSPARENT PROPERTY VALUATION PLANS</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1E293B', marginBottom: '12px' }}>
            Choose the Right Plan for Verified Deeds
          </h1>
          <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: 1.5 }}>
            Every account receives 3 free deed unlocks stored in your local PostgreSQL database. Upgrade anytime for unlimited transactions.
          </p>

          {/* Database Live Status Banner */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: '8px 18px',
              marginTop: '20px',
              fontSize: '0.825rem',
              color: '#334155',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <Database size={15} color="#10B981" />
            <span>PostgreSQL Status:</span>
            <span style={{ fontWeight: 700, color: '#059669' }}>Connected (pureframe_db)</span>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <span>Mobile: <strong>{user?.rawPhone || user?.phone || '9172272519'}</strong></span>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <span>Free Attempts: <strong>{freeAttemptsLeft}/3</strong></span>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <span>Paid: <strong>{isPaymentDone ? 'TRUE' : 'FALSE'}</strong></span>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <span>Plan: <strong>{selectedPlan.toUpperCase()}</strong></span>
          </div>
        </div>

        {/* Success Notice */}
        {successBanner && (
          <div 
            style={{
              maxWidth: '840px',
              margin: '0 auto 28px',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '10px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#065F46',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <CheckCircle2 size={18} color="#10B981" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '1180px',
            margin: '0 auto 48px'
          }}
        >
          {PLANS.map((plan) => {
            const isCurrent = isPaymentDone ? selectedPlan === plan.id : (plan.isFree && !isPaymentDone);
            return (
              <div
                key={plan.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: plan.popular ? '2px solid #F05A28' : '1px solid #E2E8F0',
                  boxShadow: plan.popular ? '0 12px 30px rgba(240, 90, 40, 0.12)' : '0 4px 12px rgba(0,0,0,0.04)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.02)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Popular / Feature Badge */}
                {plan.badge && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '24px',
                      background: plan.popular ? 'linear-gradient(135deg, #F05A28 0%, #EA580C 100%)' : '#1E293B',
                      color: '#FFFFFF',
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {plan.badge}
                  </span>
                )}

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', minHeight: '38px', marginBottom: '18px' }}>
                  {plan.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1E293B' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <div style={{ flex: 1, marginBottom: '28px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    What's included:
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plan.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.825rem', color: '#334155' }}>
                        <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Selection Button */}
                <button
                  type="button"
                  disabled={isCurrent || loadingPlan === plan.id}
                  onClick={() => plan.isFree ? handleReset() : handleChoosePlan(plan.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: isCurrent ? 'default' : 'pointer',
                    background: isCurrent 
                      ? '#E2E8F0' 
                      : (plan.popular ? '#F05A28' : '#1E293B'),
                    color: isCurrent ? '#64748B' : '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{loadingPlan === plan.id ? 'Updating Database...' : plan.buttonText}</span>
                  {!isCurrent && <ArrowRight size={15} />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Developer / Testing PostgreSQL Reset Console */}
        <div 
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            background: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            borderRadius: '12px',
            padding: '20px 24px',
            textAlign: 'center'
          }}
        >
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
            Developer &amp; Testing Controls (PostgreSQL pureframe_db)
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '14px' }}>
            Click below anytime to reset your user record back to 3 free attempts and clear payment flag for repeat testing.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary-white"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset to 3 Free Attempts</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('transactions', { projectId: 'y-square', cityId: 'mumbai' })}
              className="hero-search-btn"
              style={{ padding: '8px 18px', fontSize: '0.825rem' }}
            >
              <span>Test Unlock on Y Square Deeds</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
