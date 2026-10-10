import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  RotateCcw,
  Zap,
  ArrowRight,
  X
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
  const [pendingPlan, setPendingPlan] = useState(null);
  const [showActivateModal, setShowActivateModal] = useState(false);

  const handleOpenActivatePopup = (plan) => {
    setPendingPlan(plan);
    setShowActivateModal(true);
  };

  const handleConfirmActivatePlan = async (planId) => {
    setLoadingPlan(planId);
    setShowActivateModal(false);
    setSuccessBanner('');
    try {
      await selectPlan(planId);
      const planName = pendingPlan?.name || planId.toUpperCase();
      setSuccessBanner(`🎉 ${planName} plan activated successfully! All pro features and unlimited deed valuations are now active.`);
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
      description: 'Explore Pureframe with authentic government registered deed records',
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
            Every verified account receives 3 complimentary deed valuation unlocks. Upgrade anytime for unlimited access to authentic registry records.
          </p>

          {/* Account Status Badge */}
          {user && (
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '24px',
                padding: '8px 20px',
                marginTop: '18px',
                fontSize: '0.825rem',
                color: '#334155',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <ShieldCheck size={16} color="#10B981" />
              <span>Account: <strong>{user?.rawPhone || user?.phone}</strong></span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <span>Free Unlocks: <strong>{freeAttemptsLeft} of 3 remaining</strong></span>
              {isPaymentDone && (
                <>
                  <span style={{ color: '#CBD5E1' }}>•</span>
                  <span style={{ color: '#1D4ED8', fontWeight: 700 }}>{selectedPlan.toUpperCase()} Member</span>
                </>
              )}
            </div>
          )}
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
                  border: plan.popular ? '2px solid #1D4ED8' : '1px solid #E2E8F0',
                  boxShadow: plan.popular ? '0 12px 30px rgba(37, 99, 235, 0.16)' : '0 4px 12px rgba(0,0,0,0.04)',
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
                      background: plan.popular ? 'var(--brand-gradient)' : '#0F172A',
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
                  onClick={() => plan.isFree ? handleReset() : handleOpenActivatePopup(plan)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: isCurrent ? 'default' : 'pointer',
                    background: isCurrent 
                      ? '#E2E8F0' 
                      : (plan.popular ? '#1D4ED8' : '#0F172A'),
                    color: isCurrent ? '#64748B' : '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{loadingPlan === plan.id ? 'Activating Plan...' : plan.buttonText}</span>
                  {!isCurrent && <ArrowRight size={15} />}
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* Activate Payment Plan Popup Modal */}
      {showActivateModal && pendingPlan && (
        <div 
          className="modal-backdrop" 
          onClick={() => setShowActivateModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            padding: '16px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#FFFFFF',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              animation: 'modalSlideIn 0.2s ease-out'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #0B1320 0%, #1E3A8A 100%)',
                padding: '24px',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '12px', 
                    background: 'rgba(255, 255, 255, 0.15)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Sparkles size={20} color="#60A5FA" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    Activate Payment Plan
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '2px 0 0' }}>
                    Subscription Plan Activation
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowActivateModal(false)}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: 'none', 
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1', 
                  cursor: 'pointer'
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              <div 
                style={{ 
                  background: '#F8FAFC', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '12px', 
                  padding: '16px 18px', 
                  marginBottom: '18px' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    {pendingPlan.name}
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D4ED8' }}>
                    {pendingPlan.price} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B' }}>{pendingPlan.period}</span>
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>
                  {pendingPlan.description}
                </p>
              </div>

              <div 
                style={{ 
                  background: '#EFF6FF', 
                  border: '1px solid #BFDBFE', 
                  borderRadius: '12px', 
                  padding: '14px 16px', 
                  marginBottom: '22px', 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'flex-start' 
                }}
              >
                <ShieldCheck size={20} color="#1D4ED8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.825rem', color: '#1E40AF', lineHeight: '1.45' }}>
                  Would you like to activate the <strong>{pendingPlan.name}</strong> membership on your account now?
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowActivateModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmActivatePlan(pendingPlan.id)}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(29, 78, 216, 0.35)'
                  }}
                >
                  <CheckCircle2 size={17} />
                  <span>Yes, Activate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
